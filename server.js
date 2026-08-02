const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

// Models
const User = require('./models/user');
const CartItem = require('./models/cartitem');
const Order = require('./models/order');
const Painting = require('./models/painting');

// Routes
const cartRoutes = require('./routes/cart');
const profileRoutes = require('./routes/profile');
const orderRoutes = require('./routes/order');
const checkoutRoutes = require('./routes/checkout');
const logoutRoutes = require('./routes/logout');

const app = express();
const cors = require('cors');
const { Server } = require('http');

app.use(cors({
  origin: 'http://localhost:3000',  // Replace with your frontend URL and port
  credentials: true                 // Allow cookies and credentials to be sent
}));
 
const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/virtual-art-gallery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session setup with MongoDB store (persist sessions)
app.use(session({
  secret: 'ars-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/virtual-art-gallery' }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days
    sameSite: 'lax',  // This allows the cookie to be sent on normal navigation and refresh
    secure: false     // For local dev, HTTPS false. On production HTTPS true.
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Painting routes
const expressRouter = express.Router();

expressRouter.get('/', async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch paintings' });
  }
});

expressRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const newPainting = new Painting({
      title,
      price,
      description,
      image: '/images/' + req.file.filename
    });
    await newPainting.save();
    res.status(201).json(newPainting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload painting' });
  }
});

expressRouter.delete('/:id', async (req, res) => {
  try {
    await Painting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.use('/api/paintings', expressRouter);

// Buy Now temp store
app.post('/buy-now', (req, res) => {
  req.session.buyNowItem = req.body;
  res.status(200).json({ message: 'Item stored for buy now' });
});

app.get('/buy-now', (req, res) => {
  res.status(200).json({ item: req.session.buyNowItem || null });
});

// Auth middleware
function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).send('Login required');
  next();
}

// Passport config
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Auth routes
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      return res.json({ success: true });
    });
  })(req, res, next);
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hash, email });
    await newUser.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Registration error' });
  }
});

// Remove GET /logout to avoid confusion; use only POST /logout for logout logic
// app.get('/logout', ... ) removed

// Cart
app.post('/cart', requireLogin, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  try {
    const existingCartItem = await CartItem.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await new CartItem({ userId, productId, quantity }).save();
    }
    res.status(200).json({ message: 'Added to cart' });
  } catch {
    res.status(500).json({ message: 'Cart add failed' });
  }
});

app.get('/cart', requireLogin, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user._id }).populate('productId');
    res.json({ cart: cartItems });
  } catch {
    res.status(500).json({ message: 'Fetch cart failed' });
  }
});

// Sync (replace) the user's cart with the provided cart array
app.post('/cart/sync', requireLogin, async (req, res) => {
  try {
    const { cart } = req.body; // [{ productId, quantity }]
    // Remove all existing cart items for this user
    await CartItem.deleteMany({ userId: req.user._id });
    // Insert new cart items
    if (Array.isArray(cart) && cart.length > 0) {
      const newItems = cart.map(item => ({
        userId: req.user._id,
        productId: item.productId,
        quantity: item.quantity
      }));
      await CartItem.insertMany(newItems);
    }
    res.status(200).json({ message: 'Cart synchronized' });
  } catch (err) {
    res.status(500).json({ message: 'Cart sync failed' });
  }
});

app.delete('/cart/:id', requireLogin, async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Removed from cart' });
  } catch {
    res.status(500).json({ message: 'Cart delete failed' });
  }
});

// Checkout (handles both cart and buy now)
app.post('/checkout', requireLogin, async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingInfo, buyNowItem } = req.body;

    let items = [];

    if (buyNowItem) {
      // Single buy-now item
      items.push(buyNowItem);
    } else {
      // Get all cart items
      const cartItems = await CartItem.find({ userId }).populate('productId');
      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      items = cartItems.map(item => ({
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image
      }));
    }

    // Create and save order
    const newOrder = new Order({
      userId,
      shippingInfo,
      items
    });

    await newOrder.save();

    // Clear cart if not buyNow
    if (!buyNowItem) {
      await CartItem.deleteMany({ userId });
    }

    res.status(200).json({ message: 'Checkout successful', orderId: newOrder._id });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Orders
app.get('/orders', requireLogin, async (req, res) => {
  try {
    // Fixed query: filter by userId (matches your Order schema)
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    res.json({ orders });
  } catch {
    res.status(500).json({ message: 'Fetch orders failed' });
  }
});

app.get('/order-summary/:id', requireLogin, async (req, res) => {
  try {
    // Fixed query: userId filter
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id }).populate('items.productId');
    if (!order) return res.status(404).send('Order not found');
    res.status(200).json(order);
  } catch {
    res.status(500).send('Order summary failed');
  }
});

// Profile
app.get('/profile', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      username: user.username,
      email: user.email,
      address: user.shippingAddress || 'Not provided'
    });
  } catch {
    res.status(500).json({ message: 'Fetch profile failed' });
  }
});

// Debug route to check if user is authenticated
app.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user.username });
  } else {
    return res.json({ loggedIn: false });
  }
});

// Routes
app.use(checkoutRoutes);
app.use(logoutRoutes);
app.use(cartRoutes);
app.use(profileRoutes);
app.use(orderRoutes);
app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      loggedIn: true,
      username: req.user.username,
      role: req.user.role || 'user'
    });
  } else {
    res.json({ loggedIn: false });
  }
});
app.get('/me', (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (req.isAuthenticated()) {
    return res.json({
      loggedIn: true,
      user: {
        _id: req.user._id, // Ensure _id is included for frontend login detection
        username: req.user.username,
        role: req.user.role || 'user',
        email: req.user.email
      }
    });
  } else {
    return res.status(401).json({ loggedIn: false, message: 'Not authenticated' });
  }
});






app.get('/test-session', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`🔁 Session is working! Views: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send('✅ New session started. Refresh to test persistence.');
  }
});





app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// server.js or routes file
app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // default session cookie name
      res.sendStatus(200);
    });
  });
});

/*
Frontend note:
When calling protected routes from the frontend via fetch, add:
fetch('/some-route', {
  method: 'GET', // or POST
  credentials: 'include'  // Important: sends cookies to backend
});
*/

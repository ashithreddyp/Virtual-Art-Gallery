const mongoose = require('mongoose');
const Painting = require('./models/painting'); // Ensure this path is correct

// Updated MongoDB connection (remove deprecated options)
mongoose.connect('mongodb://localhost:27017/virtual-art-gallery')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

const samplePaintings = [
  { id: "painting1", title: "MONO LISA", price: 300, image: "/images/lisa.jpg", description: "A modern twist on the classic Mona Lisa, blending realism and surrealism." },
  { id: "painting2", title: "SUNRISE", price: 400, image: "/images/1.jpg", description: "A serene depiction of the sunrise over a calm lake with vibrant hues." },
  { id: "painting3", title: "GIRL WITH PEARL", price: 320, image: "/images/perl.jpg", description: "A modern rendering of Vermeer’s 'Girl with a Pearl Earring' with soft lighting." },
  { id: "painting4", title: "ARTISTIC CARD", price: 350, image: "/images/card.jpg", description: "A creative representation resembling an abstract greeting card with artistic flair." },
  { id: "painting5", title: "THE THREE MUSICIANS", price: 410, image: "/images/three.jpg", description: "Picasso's cubist masterpiece portraying three musicians in bold geometric form." },
  { id: "painting6", title: "ABSTRACT 1948", price: 450, image: "/images/1948.jpg", description: "A bold and chaotic arrangement of color and form representing post-war emotion." },
  { id: "painting7", title: "STARRY NIGHT", price: 500, image: "/images/starry.jpg", description: "Van Gogh’s iconic night sky swirls brought to life in vibrant color and energy." },
  { id: "painting8", title: "THE LAST SUPPER", price: 520, image: "/images/supper.jpg", description: "Leonardo da Vinci’s legendary depiction of Jesus’ final meal with his disciples." },
  { id: "painting9", title: "INTERCHANGE", price: 380, image: "/images/interchange.jpg", description: "A famous abstract expressionist piece by Willem de Kooning, dynamic and layered." }
];

async function seed() {
  try {
    await Painting.deleteMany({});
    await Painting.insertMany(samplePaintings);
    console.log('✅ Database seeded!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed error:', err);
  }
}

seed();

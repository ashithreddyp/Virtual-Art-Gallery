const express = require('express');
const router = express.Router();

router.get('/logout', (req, res, next) => {
  // Clear the buyNowItem from session
  req.session.buyNowItem = null;

  req.logout(err => {
    if (err) return next(err);
    res.redirect('/'); // Redirect to homepage or login page
  });
});

module.exports = router;

const express = require('express');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Маршрут, доступний лише для адміністраторів
router.get('/admin-only', roleMiddleware('admin'), (req, res) => {
  res.json({ message: 'Welcome admin!' });
});

module.exports = router;

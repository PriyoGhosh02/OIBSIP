const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizzaController');

router.get('/pizza-options', pizzaController.getPizzaOptions);
router.get('/pizzas', pizzaController.getCuratedPizzas);

module.exports = router;

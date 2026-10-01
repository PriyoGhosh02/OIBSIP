import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PizzaContext = createContext();

const initialPizzaState = {
  base: 'Thin Crust',
  sauce: 'Classic Tomato',
  cheese: 'Mozzarella',
  vegetables: ['Mushroom', 'Onion', 'Bell Pepper'],
  pizzaName: 'Custom Pizza',
};

export const PizzaProvider = ({ children }) => {
  const [pizza, setPizza] = useState(() => {
    const saved = localStorage.getItem('pizzahub_current_builder');
    return saved ? JSON.parse(saved) : initialPizzaState;
  });

  const [options, setOptions] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    vegetables: [],
  });

  const [loadingOptions, setLoadingOptions] = useState(true);

  // Fetch pizza options from backend inventory
  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const res = await api.get('/pizza-options');
      if (res.data.success && res.data.options) {
        setOptions(res.data.options);
      }
    } catch (err) {
      console.error('Failed to load pizza options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  // Sync builder to localStorage
  useEffect(() => {
    localStorage.setItem('pizzahub_current_builder', JSON.stringify(pizza));
  }, [pizza]);

  // Setters
  const setBase = (baseName) => {
    setPizza((prev) => ({ ...prev, base: baseName }));
  };

  const setSauce = (sauceName) => {
    setPizza((prev) => ({ ...prev, sauce: sauceName }));
  };

  const setCheese = (cheeseName) => {
    setPizza((prev) => ({ ...prev, cheese: cheeseName }));
  };

  const toggleVegetable = (vegName) => {
    setPizza((prev) => {
      const exists = prev.vegetables.includes(vegName);
      return {
        ...prev,
        vegetables: exists
          ? prev.vegetables.filter((v) => v !== vegName)
          : [...prev.vegetables, vegName],
      };
    });
  };

  const loadPreset = (preset) => {
    setPizza({
      base: preset.configuration.base,
      sauce: preset.configuration.sauce,
      cheese: preset.configuration.cheese,
      vegetables: preset.configuration.vegetables,
      pizzaName: preset.name,
    });
  };

  const resetPizza = () => {
    setPizza(initialPizzaState);
  };

  // Price calculations
  const calculatePricing = () => {
    let subtotal = 0;

    const baseObj = options.bases.find((b) => b.name === pizza.base);
    const sauceObj = options.sauces.find((s) => s.name === pizza.sauce);
    const cheeseObj = options.cheeses.find((c) => c.name === pizza.cheese);

    if (baseObj) subtotal += baseObj.price;
    if (sauceObj) subtotal += sauceObj.price;
    if (cheeseObj) subtotal += cheeseObj.price;

    pizza.vegetables.forEach((vName) => {
      const vegObj = options.vegetables.find((v) => v.name === vName);
      if (vegObj) subtotal += vegObj.price;
    });

    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    return {
      subtotal,
      deliveryFee,
      total,
    };
  };

  const value = {
    pizza,
    options,
    loadingOptions,
    fetchOptions,
    setBase,
    setSauce,
    setCheese,
    toggleVegetable,
    loadPreset,
    resetPizza,
    calculatePricing,
  };

  return <PizzaContext.Provider value={value}>{children}</PizzaContext.Provider>;
};

export const usePizza = () => useContext(PizzaContext);

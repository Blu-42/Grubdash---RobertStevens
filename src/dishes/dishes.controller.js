const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");
const { validateDish } = require("../utils/validation");

// Create a new dish
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  const errors = validateDish({ name, description, price, image_url });

  if (errors) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// Read a dish by ID
function read(req, res) {
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);

  if (dish) {
    res.json({ data: dish });
  } else {
    res.status(404).json({ error: `Dish with id ${dishId} not found` });
  }
}

// Update a dish by ID
function update(req, res) {
  const { dishId } = req.params;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  const dish = dishes.find((dish) => dish.id === dishId);

  if (!dish) {
    return res.status(404).json({ error: `Dish with id ${dishId} not found` });
  }

  if (id && id !== dishId) {
    return res.status(400).json({ error: `Mismatched id: ${id}` });
  }

  const errors = validateDish({ name, description, price, image_url });

  if (errors) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  dish.name = name || dish.name;
  dish.description = description || dish.description;
  dish.price = price !== undefined ? price : dish.price;
  dish.image_url = image_url || dish.image_url;

  res.json({ data: dish });
}

// List all dishes
function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create,
  read,
  update,
  list,
};

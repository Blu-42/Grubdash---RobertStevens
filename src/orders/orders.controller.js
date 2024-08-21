// src/orders/orders.controller.js

const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");
const { validateOrder } = require("../utils/validation");

// Create a new order
function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;

  const errors = validateOrder({ deliverTo, mobileNumber, dishes });
  if (errors) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status: "pending",
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// Read an order by ID
function read(req, res) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);

  if (order) {
    res.json({ data: order });
  } else {
    res.status(404).json({ error: `Order with id ${orderId} not found` });
  }
}

// Update an order by ID
function update(req, res) {
  const { orderId } = req.params;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  const order = orders.find((order) => order.id === orderId);

  if (!order ) {
    return res.status(404).json({ error: `Order with id ${orderId} cannot be found.` });
  }

  if (id && id !== orderId) {
    return res.status(400).json({ error: `Mismatched id: ${id}` });
  }
  
  if (!status) {
    return res.status(400).json({ error: `The status of order id: ${id} cannot be found.`})
  }
  
  const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "status"});
  }

  const errors = validateOrder({ deliverTo, mobileNumber, dishes });
  if (errors) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  order.deliverTo = deliverTo || order.deliverTo;
  order.mobileNumber = mobileNumber || order.mobileNumber;
  order.status = status || order.status;
  order.dishes = dishes || order.dishes;

  res.json({ data: order });
}

// Delete an order by ID
function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);

  if (index !== -1) {
    const order = orders[index];
    if (order.status !== "pending") {
      return res.status(400).json({ error: "Order status must be 'pending' to delete." });
    }

    orders.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: `Order with id ${orderId} not found` });
  }
}

// List all orders
function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  create,
  read,
  update,
  destroy,
  list,
};

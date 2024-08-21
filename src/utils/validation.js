function validateDish({ name, description, price, image_url }) {
  const errors = [];
  
  if (!name) errors.push("name is required.");
  if (name === "") errors.push("name cannot be empty.");
  if (!description) errors.push("description is required.");
  if (description === "") errors.push("description cannot be empty.");
  if (!image_url) errors.push("image_url is required.");
  if (image_url === "") errors.push("image_url cannot be empty.");
  if (price === undefined) errors.push("price is required.");
  if (typeof price !== "number") errors.push("price must be a number.");
  if (price <= 0) errors.push("price must be greater than 0.");

  return errors.length ? errors : null;
}

function validateOrder({ deliverTo, mobileNumber, dishes, status }) {
  const errors = [];
  
  if (!deliverTo) errors.push("deliverTo is required.");
  if (deliverTo === "") errors.push("deliverTo cannot be empty.");
  if (!mobileNumber) errors.push("mobileNumber is required.");
  if (mobileNumber === "") errors.push("mobileNumber cannot be empty.");
  
  // Check if 'dishes' is missing
  if (dishes === undefined || dishes === null) {
    errors.push("dishes is required.");
  } else if (!Array.isArray(dishes)) {
    errors.push("dishes must be an array.");
  } else if (dishes.length === 0) {
    errors.push("dishes cannot be an empty array.");
  } else {
    dishes.forEach((dish, index) => {
      if (typeof dish.id !== "string") {
        errors.push(`Dish at index ${index} must have a valid id.`);
      }
      if (typeof dish.quantity !== "number" || dish.quantity <= 0) {
        errors.push(`Dish at index ${index} must have a quantity greater than 0.`);
      }
    });
  }



  return errors.length ? errors : null;
}

module.exports = {
  validateDish,
  validateOrder,
};

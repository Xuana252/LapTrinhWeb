const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const getUserCart = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "cart.product_id",
      populate: {
        path: "category_id",
      },
    });


    if (!user) {
      res.status(404).json({ message: `Could not find any user with ID ${id}` });
      return 
    }

     const transformedCart = user.cart.map((item) => {
      const product = item.product_id;
      return {
        ...item.toObject(), // Convert Mongoose doc to plain object
        product_id: {
          ...product.toObject(),
          category: product.category_id, // Copy category_id to category
        },
      };
    });

    res.status(200).json(transformedCart);

  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const addProductToCart = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { product_id, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: `Could not find any user with ID ${id}` });
      return 
    }

    const existingItem = user.cart.find(
      (item) => item.product_id.toString() === product_id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product_id, quantity });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateCartItem = asyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: `Could not find any user with ID ${id}` });
      return 
    }

    const item = user.cart.find(
      (item) => item.product_id.toString() === productId
    );

    if (!item) {
      res.status(404).json({ message: `Could not find product in user cart` });
      return 
    }

    item.quantity = quantity>=1?quantity:1;

    await user.save();

    res.status(200).json({ message: "Cart item updated", cart: user.cart });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteCart = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: `Could not find any user with ID ${id}` });
      return 
    }

    user.cart = [];

    await user.save();

    res.status(200).json({ message: "Cart cleared", cart: user.cart });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const deleteCartItem = asyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: `Could not find any user with ID ${id}` });
      return 
    }

    user.cart = user.cart.filter(
      (item) => item.product_id.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: "Cart item removed", cart: user.cart });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getUserCart,
  addProductToCart,
  updateCartItem,
  deleteCart,
  deleteCartItem,
};

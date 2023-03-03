const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
var moment = require("moment");

// GET: display all products
router.get("/", async (req, res) => {
  const perPage = 8;
  let page = parseInt(req.query.page) || 1;
  try {
    const products = await Product.find({})
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count();

    console.log("In the products API :",products);
    return res.status(200).json({
      pageName: "All Products",
      products,
      current: page,
      breadcrumbs: null,
      home: "/products/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    });
  }
});

// GET: search box
router.get("/search", async (req, res) => {
  const perPage = 8;
  let page = parseInt(req.query.page) || 1;
  console.log('In the search results product search string value is : ', req.query.search);
  try {
    const products = await Product.find({
      title: { $regex: req.query.search, $options: "i" },
    })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category")
      .exec();
    const count = await Product.count({
      title: { $regex: req.query.search, $options: "i" },
    });
    console.log('In the search results product count is : ', count, products);
    return res.status(200).json({
      pageName: "Search Results",
      products,
      current: page,
      breadcrumbs: null,
      home: "/products/search?search=" + req.query.search + "&",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    });
  }
});

//GET: get a certain category by its slug (this is used for the categories navbar)
router.get("/:slug", async (req, res) => {
  const perPage = 8;
  let page = parseInt(req.query.page) || 1;
  console.log('In the slug search string value is : ', req.params.slug);
  try {
    const foundCategory = await Category.findOne({ slug: req.params.slug });
    const allProducts = await Product.find({ category: foundCategory.id })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count({ category: foundCategory.id });

    console.log('In the slug search string value is : ', count, allProducts);
    return res.status(200).json({
      pageName: foundCategory.title,
      currentCategory: foundCategory,
      products: allProducts,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: "/products/" + req.params.slug.toString() + "/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    });
  }
});

// GET: display a certain product by its id
router.get("/:slug/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    return res.status(200).json({
      pageName: product.title,
      product,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error
    });
  }
});

module.exports = router;

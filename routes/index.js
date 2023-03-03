var express = require("express");
var router = express.Router();
const mod = require("../module").module;

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render("index", { title: "Express" });
  return res.status(200).json({ title: "Express" });
});

module.exports = router;

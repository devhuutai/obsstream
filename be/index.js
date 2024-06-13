const express = require("express");
const { resolve } = require("path");
const router = express.Router();
const auth = require(resolve("./configs/auth"));
const checkPermission = (req, res, next) => {
    let { role } = req.data;
    if (role === "admin") {
      next();
    } else {
      res.render(`${resolve("./fe/auth")}`);
    }
  };

router.use("/auth", require(resolve("./be/home/auth")));
router.use("/erp", auth.protect, checkPermission, require(resolve("./be/home/erp")));
router.use("/", require(resolve("./be/home/index")));


module.exports = router;
 
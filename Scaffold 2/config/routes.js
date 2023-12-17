const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const itemController = require("../controllers/itemController");


module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/item", itemController);

  app.get("/*", (req, res) => {
    res.render("404");
  });
};

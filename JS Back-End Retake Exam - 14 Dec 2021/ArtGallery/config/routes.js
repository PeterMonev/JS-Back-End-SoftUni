const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const artController = require("../controllers/artController");


module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/art", artController);

  app.get("/*", (req, res) => {
    res.render("404");
  });
};

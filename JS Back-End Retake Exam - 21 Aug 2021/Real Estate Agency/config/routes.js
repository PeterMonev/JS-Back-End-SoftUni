const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const rentController = require("../controllers/rentController");


module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/rent", rentController);

  app.get("/*", (req, res) => {
    res.render("404");
  });
};

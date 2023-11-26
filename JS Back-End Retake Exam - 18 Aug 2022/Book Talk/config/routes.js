const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const bookController = require("../controllers/bookController");
const profileController = require("../controllers/profileController");
const { hasUser } = require("../middlewares/guards");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/books", bookController);
  app.use('/profile', profileController);
  app.get("/*", (req, res) => {
    res.render("404");
  });
};

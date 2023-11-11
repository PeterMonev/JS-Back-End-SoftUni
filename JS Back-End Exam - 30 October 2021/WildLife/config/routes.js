const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const postController = require("../controllers/postController");


module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/post", postController);

  app.get("/*", (req, res) => {
    res.render("404");
  });
};

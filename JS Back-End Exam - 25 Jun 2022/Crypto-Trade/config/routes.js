const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const cryptoController = require("../controllers/cryptoController");


module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/crypto", cryptoController);

  app.get("/*", (req, res) => {
    res.render("404");
  });
};

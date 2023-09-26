const authController = require("../controllers/authController");
const courseController = require("../controllers/courseController");
const homeController = require("../controllers/homeController");
const { hasUser, isGuest } = require("../middlewares/guards");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth",authController);
  app.use("/course",hasUser() ,courseController);

  app.get("/error", (req, res, next) => {
    next(new Error("propagationg error"));
  });

  app.use((err, req, res, next) => {
    console.log("Global error handling");
    console.log(err.message);
    res.redirect("/");
  });
};

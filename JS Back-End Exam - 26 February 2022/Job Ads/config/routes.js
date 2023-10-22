const adController = require("../controllers/adController");
const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/ad", adController);

  app.get('/*', (req, res) => {
    res.render('404',{
      title: '404'
    })
  })

  app.get('/error', (req, res, next) => {
    next(new Error('propagationg error'))
  })

  app.use((err, req, res, next) => {
    console.log("Global error handling");
    console.log(err.message);
    res.redirect("/");
  });
};

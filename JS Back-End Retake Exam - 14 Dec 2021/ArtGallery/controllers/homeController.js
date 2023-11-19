const { getAll } = require("../services/artService");

const homeController = require("express").Router();

homeController.get("/", async (req, res) => {
  const art = await getAll([]);

  res.render("home", {
    title: "Home Page",
    user: req.user,
    art
  });
});

module.exports = homeController;

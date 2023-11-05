const { getAll, getThreeByCount, getAllByLikes, getAllByDate } = require("../services/playService");

const homeController = require("express").Router();

homeController.get("/", async (req, res) => {

  if(req.user){
    const plays = await getAll();
    res.render("user-home", {
      title: "Home Page",
      user: req.user,
      plays
    });
  } else {
    const plays = await getThreeByCount();

    console.log(plays);
    res.render("guest-home", {
      title: "Home Page",
      user: req.user,
      plays
    });
  }

});

homeController.get('/sortByLikes', async (req, res) => {
  const plays = await getAllByLikes();

  res.render('user-home',{
      title: 'Home Page',
      plays
  })
});

homeController.get('/sortByDate', async (req, res) => {
  const plays = await getAllByDate();

  res.render('user-home',{
    title: 'Home Page',
    plays
})
})

module.exports = homeController;

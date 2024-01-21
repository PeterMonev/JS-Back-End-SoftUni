const { getAll, getById } = require("../services/accomodationService");

const router = require("express").Router();

router.get("/", (req, res) => {
  const search = req.query.search || '';
  const rooms = getAll(search);
  res.render("catalog", {
    title: "All Accomodation",
    rooms,
    search
  });
});

router.get("/:id", (req, res) => {
  const roomId = req.params.id;
  const room = getById(roomId);

  if (room) {
    res.render("details", {
      title: "Accomodation Details",
      room,
    });
  } else {
    res.render("roomNotFound", {
      title: "Accomodation Details",
      roomId,
    });
  }
});

module.exports = router;

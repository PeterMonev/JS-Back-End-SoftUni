const { hasUser } = require("../middlewares/guards");
const { getByUserWishing } = require("../services/bookService");




const profileController = require("express").Router();

profileController.get('/',hasUser(), async (req, res) => {
    const wishing = await getByUserWishing(req.user._id);

    res.render('profile', {
        title: 'Profile Page',
        user: Object.assign({wishing}, req.user),
    })
});

module.exports = profileController;

const { getAll,create, getById, liked, deleteById, update } = require('../services/playService');
const { getUserById, userLike } = require('../services/userService');
const { parseError } = require("../util/parser");
const { hasUser } = require("../middlewares/guards");

const playController = require('express').Router();

playController.get('/catalog', async (req, res) => {
    const item = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        item
    })
})

playController.get('/create',hasUser(), (req, res)=>{
    res.render('create', {
        title: 'Create Page',
    })
})

playController.post('/create',hasUser(), async (req, res)=>{
    const play = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        public: Boolean(req.body.public),
        date: new Date(),
        owner: req.user._id,
    };

    try {
      if(play.title === '' || play.description === '' || play.imageUrl === ''){
        throw new Error('All fields are required');
      }

      await create(play);
      res.redirect('/');

    } catch (error){

        res.render('create', {
            title: 'Create Play',
            body: play,
            errors: parseError(error)
        })
    }
})

playController.get('/:id/details', async function (req, res) {
    const play = await getById(req.params.id);
    let user = undefined;

    if(req.user){
        user = await getUserById(req.user._id);

        if(play.owner == req.user._id){
            play.isOwner = true;
        }

        if(play.usersLiked.map(c => c.toString()).includes(req.user._id.toString()) && !play.isOwner){
            play.isLiked = true;
        }
    }  

    res.render('details', {
        title: 'Details Page',
        play
    })

})

playController.get('/:id/edit',hasUser(), async (req, res) => {
    const play = await getById(req.params.id);

    if(play.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        play
    })
})

playController.post('/:id/edit',hasUser(),  async (req, res) => {
    const play = await getById(req.params.id);

    if(play.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    const edited = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        public: Boolean(req.body.public),
    };

    try {
        if(Object.values(edited).some(e => !e)){
            throw new Error("All fields are required");
        }

       await update(req.params.id,edited);
       res.redirect(`/play/${req.params.id}/details`);

    } catch (error){
   
        res.render('edit',{
            title: 'Edit Page',
            play: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error),
        })
    }
})

playController.get('/:id/delete',hasUser(),  async (req, res) => {
    const play = await getById(req.params.id);
  
    if(play.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/');
})

playController.get('/:id/liked',hasUser(), async (req, res) => {
    const play = await getById(req.params.id);

    try {
      if(play.owner == req.user._id){
        play.isOwner = true;
       throw new Error('Cannot like your own play');
      }

      if(play.usersLiked.map(c => c.toString()).includes(req.user._id.toString())){
        play.isLiked = true;
       throw new Error('Cannot like this play twice');
      }
 
      await userLike(req.user._id, req.params.id)
      await liked(req.params.id, req.user._id);
      res.redirect(`/play/${req.params.id}/details`);

    } catch (error){
 
       res.render('details', {
           title: 'Details Page',
           play,
           errors: parseError(error)
       })
    }
})  



module.exports = playController;
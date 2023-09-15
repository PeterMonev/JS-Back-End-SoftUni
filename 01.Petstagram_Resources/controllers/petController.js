const { getAll,create, getById, commentPhoto, deleteById, update, } = require('../services/photoService');
const { getUserById } = require('../services/userService');
const { parseError } = require("../util/parser");
const { hasUser } = require("../middlewares/guards");

const petController = require('express').Router();

petController.get('/catalog', async (req, res) => {
    const photo = await getAll();

    for(let id of photo){
       let user = await getUserById(id.owner._id.toString());
       id.userName = user.username;
    }


    res.render('catalog', {
        title: 'Catalog Page',
        photo
    })
})

petController.get('/create',hasUser(), (req, res)=>{
    res.render('create', {
        title: 'Create Page',
    })
})

petController.post('/create',hasUser(), async (req, res)=>{
    const photo = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        age: Number(req.body.age),
        description: req.body.description,
        location: req.body.location,
        owner: req.user._id
    };

    try {
      if(Object.values(photo).some(c => !c)){
        throw new Error('All fields are required');
      }

      await create(photo);
      res.redirect('/pet/catalog');

    } catch (error){
  
        res.render('create', {
            title: 'Create Photo',
            body: photo,
            errors: parseError(error)
        })
    }
})

petController.get('/:id/details', async function (req, res) {
    const photo = await getById(req.params.id);
    let user = undefined;
    const owner = await getUserById(photo.owner._id.toString())

    if(req.user){
        user = await getUserById(req.user._id);

        if(photo.owner == req.user._id){
            photo.isOwner = true;
        }

    }

  if(photo.commentList.length > 0){

    for(let comment of photo.commentList){
        let user = await getUserById(comment.userID.toString());
        comment.userName = user.username;
        console.log(comment);
        
    }
  }

    res.render('details', {
        title: 'Details Page',
        photo,
        owner
    })

})

petController.post('/:id/comment',hasUser(),  async (req, res) => {
      let photo = await getById(req.params.id);
      const owner = await getUserById(photo.owner._id.toString())
      let user = await getUserById(req.user._id);
      let comment = req.body.comment;
     
      await  commentPhoto(req.params.id,req.user._id.toString(),comment)

      res.redirect(`/pet/${req.params.id}/details`);
})

petController.get('/:id/edit',hasUser(), async (req, res) => {
    const photo = await getById(req.params.id);

    if(photo.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        photo
    })
})

petController.post('/:id/edit',hasUser(),  async (req, res) => {
    const photo = await getById(req.params.id);

    if(photo.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    const edited = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        age: Number(req.body.age),
        description: req.body.description,
        location: req.body.location
    };

    try {
        if(Object.values(edited).some(e => !e)){
            throw new Error("All fields are required");
        }

       await update(req.params.id,edited);
       res.redirect(`/pet/${req.params.id}/details`);

    } catch (error){
   
        res.render('edit',{
            title: 'Edit Page',
            photo: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error),
        })
    }
})

petController.get('/:id/delete',hasUser(),  async (req, res) => {
    const photo = await getById(req.params.id);

    if(photo.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/pet/catalog');
})


petController.get('/profile',hasUser(), async (req, res) => {
    const owner = await getUserById(req.user._id);
    const photos = [];
    let allPhotos = await getAll();
    let userPhotos = allPhotos.filter(photo => photo.owner._id.toString() === owner._id.toString());

    res.render('profile', {
        title: 'Profile Page',
        owner,
        userPhotos
         
    })
})


module.exports = petController;
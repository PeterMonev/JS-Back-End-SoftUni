const { getAll,create, getById,  deleteById, update, getShare,  } = require('../services/artService');
const { getUserById, updateUser } = require('../services/userService');
const { parseError } = require("../util/parser");
const { hasUser } = require("../middlewares/guards");

const artController = require('express').Router();

artController.get('/catalog', async (req, res) => {
    const art = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        art
    })
})

artController.get('/create',hasUser(), (req, res)=>{
    res.render('create', {
        title: 'Create Page',
    })
})

artController.post('/create',hasUser(), async (req, res)=>{
    const art = {
        title: req.body.title,
        technique: req.body.technique,
        imageUrl: req.body.imageUrl,
        certificate: req.body.certificate,
        owner: req.user._id
    };

    try {
      if(Object.values(art).some(c => !c)){
        throw new Error('All fields are required');
      }

     const owner = await getUserById(req.user._id);
     let artId = await create(art);

     let ownerPublications = owner.myPublicataion;
     ownerPublications.push(artId);
     
     await updateUser(owner._id, ownerPublications);
      res.redirect('/art/catalog');

    } catch (error){
     console.log(error);
        res.render('create', {
            title: 'Create Art',
            body: art,
            errors: parseError(error)
        })
    }
})

artController.get('/:id/details', async function (req, res) {
    const art = await getById(req.params.id);
    let user = undefined;

    if(req.user){
        user = await getUserById(req.user._id);

        if(art.owner == req.user._id){
            art.isOwner = true;
        }

        if(art.shared.map(c => c.toString()).includes(req.user._id.toString()) && !art.isOwner){
            art.isShared = true;
        }
    }  

    const owner = await getUserById(art.owner.toString());

    res.render('details', {
        title: 'Details Page',
        art,
        owner
    })

})

artController.get('/:id/edit',hasUser(), async (req, res) => {
    const art = await getById(req.params.id);

    if(art.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        art
    })
})

artController.post('/:id/edit',hasUser(),  async (req, res) => {
    const art = await getById(req.params.id);

    if(art.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    const edited = {
        title: req.body.title,
        technique: req.body.technique,
        imageUrl: req.body.imageUrl,
        certificate: req.body.certificate,
    };

    try {
        if(Object.values(edited).some(e => !e)){
            throw new Error("All fields are required");
        }

       await update(req.params.id,edited);
       res.redirect(`/art/${req.params.id}/details`);

    } catch (error){
   
        res.render('edit',{
            title: 'Edit Page',
            art: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error),
        })
    }
})

artController.get('/:id/delete',hasUser(),  async (req, res) => {
    const art = await getById(req.params.id);

    if(art.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/');
})

artController.get('/:id/share',hasUser(), async (req, res) => {
    const art = await getById(req.params.id);

    try {
      if(art.owner == req.user._id){
        art.isOwner = true;
       throw new Error('Cannot share your own art');
      }

      if(art.shared.map(c => c.toString()).includes(req.user._id.toString())){
        art.isShared = true;
       throw new Error('Cannot shared this art twice');
      }

      await getShare(req.params.id, req.user._id);
      res.redirect(`/art/${req.params.id}/details`);

    } catch (error){
    
       res.render('details', {
           title: 'Details Page',
           art,
           errors: parseError(error)
       })
    }
})  

artController.get('/profile', async (req, res) => {
    const owner = await getUserById(req.user._id);
    const arts = [];

    if(owner.myPublicataion.length > 0){
       for(id of owner.myPublicataion.toString().split(',')){
           const art = await getById(id);
   
           if( art !== null){
            arts.push(art.title)      
           }
        
       }
       owner.post = arts.join(', ');
    }

   const publications = await getAll();
   const myShare = [];

   for(pub of publications){

    if(pub.shared.toString().split(',').includes(owner._id.toString())){
       myShare.push(pub.title);
    }

   }
   owner.myShare = myShare.join(', ')
   console.log(owner)
    res.render('profile', {
        title: 'Profile Page',
        owner
         
    })
})


module.exports = artController;
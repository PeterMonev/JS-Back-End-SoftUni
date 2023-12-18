const { getAll,create, getById, buyCryptos, deleteById, update, getAllSearch } = require('../services/itemService');
const { getUserById } = require('../services/userService');
const { parseError } = require("../util/parser");
const { hasUser } = require("../middlewares/guards");

const itemController = require('express').Router();

itemController.get('/catalog', async (req, res) => {
    const item = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        item
    })
})

itemController.get('/create',hasUser(), (req, res)=>{
    res.render('create', {
        title: 'Create Page',
    })
})

itemController.post('/create',hasUser(), async (req, res)=>{
    const crypto = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price),
        description: req.body.description,
        payment: req.body.payment,
        owner: req.user._id
    };

    try {
      if(Object.values(crypto).some(c => !c)){
        throw new Error('All fields are required');
      }

      await create(crypto);
      res.redirect('/crypto/catalog');

    } catch (error){
  
        res.render('create', {
            title: 'Create Crypto',
            body: crypto,
            errors: parseError(error)
        })
    }
})

itemController.get('/:id/details', async function (req, res) {
    const crypto = await getById(req.params.id);
    let user = undefined;

    if(req.user){
        user = await getUserById(req.user._id);

        if(crypto.owner == req.user._id){
           crypto.isOwner = true;
        }

        if(crypto.buyCrypto.map(c => c.toString()).includes(req.user._id.toString()) && !crypto.isOwner){
            crypto.isCrypto = true;
        }
    }  

    res.render('details', {
        title: 'Details Page',
        crypto
    })

})

itemController.get('/:id/edit',hasUser(), async (req, res) => {
    const crypto = await getById(req.params.id);

    if(crypto.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        crypto
    })
})

itemController.post('/:id/edit',hasUser(),  async (req, res) => {
    const crypto = await getById(req.params.id);

    if(crypto.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    const edited = {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        payment: req.body.payment
    };

    try {
        if(Object.values(edited).some(e => !e)){
            throw new Error("All fields are required");
        }

       await update(req.params.id,edited);
       res.redirect(`/crypto/${req.params.id}/details`);

    } catch (error){
   
        res.render('edit',{
            title: 'Edit Page',
            crypto: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error),
        })
    }
})

itemController.get('/:id/delete',hasUser(),  async (req, res) => {
    const crypto = await getById(req.params.id);

    if(crypto.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/item/catalog');
})

itemController.get('/:id/buycrypto',hasUser(), async (req, res) => {
    const crypto = await getById(req.params.id);

    try {
      if(crypto.owner == req.user._id){
       crypto.isOwner = true;
       throw new Error('Cannot buy your own crypto');
      }

      if(crypto.buyCrypto.map(c => c.toString()).includes(req.user._id.toString())){
        crypto.isCrypto = true;
       throw new Error('Cannot buy this crypto twice');
      }

      await buyCryptos(req.params.id, req.user._id);
      res.redirect(`/crypto/${req.params.id}/details`);

    } catch (error){
        console.log(error);
       res.render('details', {
           title: 'Details Page',
           crypto,
           errors: parseError(error)
       })
    }
})  

itemController.get('/search', async (req, res) => {
    const cryptoText = req.query.text;
    const cryptoPayment = req.query.payment;

    let crypto = await getAllSearch(cryptoText,cryptoPayment);

    if(crypto == undefined){
        crypto = await getAll();
    } 

    res.render('search', {
        title: 'Search Page',
        crypto 
    })
})


module.exports = itemController;
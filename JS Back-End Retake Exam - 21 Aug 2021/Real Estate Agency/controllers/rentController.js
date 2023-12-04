const { getAll,create, getById, deleteById, update, search,takeRents } = require('../services/rentService');
const { getUserById } = require('../services/userService');
const { parseError } = require("../util/parser");
const { hasUser } = require("../middlewares/guards");

const rentController = require('express').Router();

rentController.get('/catalog', async (req, res) => {
    let rent = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        rent
    })
})

rentController.get('/create',hasUser(), (req, res)=>{
    res.render('create', {
        title: 'Create Page',
    })
})

rentController.post('/create',hasUser(), async (req, res)=>{
    const rent = {
        name: req.body.name,
        type: req.body.type,
        year: Number(req.body.year),
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        pieces: Number(req.body.pieces),
        owner: req.user._id
    };

    try {
      if(Object.values(rent).some(c => !c)){
        throw new Error('All fields are required');
      }

      await create(rent);
      res.redirect('/rent/catalog');

    } catch (error){
        console.log(error);
        res.render('create', {
            title: 'Create Rent',
            body: rent,
            errors: parseError(error)
        })
    }
})

rentController.get('/:id/details', async function (req, res) {
    const rent = await getById(req.params.id);
    let user = undefined;

    if(req.user){
        user = await getUserById(req.user._id);

        if(rent.owner == req.user._id){
            rent.isOwner = true;
        }
  
        if(rent.pieces === 0){
            rent.isFull = true;
        }

        if(rent.rentHouse.map(c => c.toString()).includes(req.user._id.toString()) && !rent.isOwner){
            rent.isRent = true;
        }
    }  

    if(rent.rentHouse.length > 0){
        const peoples = [];
        for(id of rent.rentHouse.toString().split(',') ){
           const people = await getUserById(id)
           peoples.push(people.name)
        }
         rent.allRented = peoples.join(', ')
    } 

    res.render('details', {
        title: 'Details Page',
        rent,
        
    })

})

rentController.get('/:id/edit',hasUser(), async (req, res) => {
    const rent = await getById(req.params.id);

    if(rent.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        rent
    })
})

rentController.post('/:id/edit',hasUser(),  async (req, res) => {
    const edit = await getById(req.params.id);

    if(edit.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    const edited = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        pieces: Number(req.body.pieces),
    };

    try {
        if(Object.values(edited).some(e => !e)){
            throw new Error("All fields are required");
        }

       await update(req.params.id,edited);
       res.redirect(`/rent/${req.params.id}/details`);

    } catch (error){
   
        res.render('edit',{
            title: 'Edit Page',
            edit: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error),
        })
    }
})

rentController.get('/:id/delete',hasUser(),  async (req, res) => {
    const rent = await getById(req.params.id);

    if(rent.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/rent/catalog');
})

rentController.get('/:id/takerent',hasUser(), async (req, res) => {
    const rent = await getById(req.params.id);

    try {
      if(rent.owner == req.user._id){
        rent.isOwner = true;
       throw new Error('Cannot buy your own rent');
      }

      if(rent.rentHouse.map(c => c.toString()).includes(req.user._id.toString())){
        rent.isRent = true;
       throw new Error('Cannot buy this rent twice');
      }

      await takeRents(req.params.id, req.user._id);
      res.redirect(`/rent/${req.params.id}/details`);

    } catch (error){
       
       res.render('details', {
           title: 'Details Page',
           rent,
           errors: parseError(error)
       })
    }
})  

rentController.get('/search', async (req, res) => {
 
    if(req.query.search === undefined){
      res.render('search', {
        title: 'Search Page',
      })
  
    } else {
      const searchText = req.query.search;
      const rent = await search(searchText)
   
      res.render('search', {
        title: 'Search Page',
        rent,
     
      })
    }
  
  
  })


module.exports = rentController;
const { getAll, create, getById, applied,deleteById, update, search} = require('../services/adService');
const { getUserById, updateUser, findByEmail } = require('../services/userService');
const { parseError } = require('../util/parser');

const adController = require('express').Router();

adController.get('/catalog', async (req,res) => {
   const ads = await getAll();

   res.render('catalog', {
    title: 'Catalog Page',
    ads
   })
});

adController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Page',
    })
});

adController.post('/create', async (req, res) => {
   const ad = {
     headline: req.body.headline,
     location: req.body.location,
     name: req.body.name,
     description: req.body.description,
     owner: req.user._id
   };
   const owner = await getUserById(req.user._id.toString());

   try {

    if(Object.values(ad).some(a => !a)){
        throw new Error(`All fields need required`);
    }

    let adId= await create(ad);

    let list = owner.myAd;
    
    list.push(adId);
    await updateUser(owner._id, list);
    
    res.redirect('/ad/catalog');

   } catch (error){
     res.render('create', {
        title: 'Create Page',
        body: ad,
        errors: parseError(error),
     })
   }
});

adController.get('/:id/details', async (req, res) => {
    const ad = await getById(req.params.id);
    const owner = await getUserById(ad.owner.toString());
    let userApp = [];

    if(req.user){
     
    if(ad.owner == req.user._id){
          ad.isOwner = true; 
          
          const users = ad.userApplied.toString().split(',')
  
          for(id of users){
              userApp.push(await getUserById(id));
          }
    }

    if(ad.userApplied.map(a => a.toString()).includes(req.user._id.toString()) && !ad.isOwner){
          ad.isApplied = true; 
    }

   

   }
    res.render('details', {
      title: 'Details Page',
      ad,
      owner,
      userApp
    })
});

adController.get('/:id/applied', async (req, res) => {
    const ad = await getById(req.params.id);

    try{
      if(ad.owner == req.user._id){
        throw new Error("You cannot applied your own ad");
      }

      if(ad.userApplied.map(a => a.toString()).includes(req.user._id.toString())){
         ad.isApplied = true;
         throw new Error("You cannot applied twice");
      }

      await applied(req.params.id,req.user);
      res.redirect(`/ad/${req.params.id}/details`);

    }catch (error){
      res.render('details', {
        title: 'Details Page',
        ad,
        errors: parseError(error),
      })
    }
});

adController.get('/:id/delete', async (req, res) => {
   const ad = await getById(req.params.id);
  
   if(ad.owner.toString() !== req.user._id){
      return res.redirect('/auth/login');
   }

   await deleteById(req.params.id);
   res.render('/catalog');
});

adController.get('/:id/edit', async (req, res) => {
  const ad = await getById(req.params.id);

  if(ad.owner != req.user._id){
    return res.redirect('/auth/login');
}

  res.render('edit', {
    title: 'Edit Page',
    ad
  })
})

adController.post('/:id/edit', async (req, res) => {
    const ad = await getById(req.params.id);

    if(ad.owner != req.user._id){
      return res.redirect('/auth/login');
  }

  const edited = {
    headline: req.body.headline,
    location: req.body.location,
    name: req.body.name,
    description: req.body.description,
  }

  try {
    if(Object.values(edited).some(e => !e)){
      throw new Error("All fields are required");
  }

  await update(req.params.id, edited);
  res.redirect(`/ad/${req.params.id}/details`);
    
  } catch (error) {
    res.render('edit', {
      title: 'Error Page',
      ad: Object.assign(edited, {_id : req.params.id}),
      errors: parseError(error)
    })
  }
});

adController.get('/search', async (req, res) => {
 
 
  if(req.query.search === undefined){
    res.render('search', {
      title: 'Search Page',
    })

  } else {
    const searchText = req.query.search;
    const owner = await findByEmail(searchText);
    const ad = await search(owner._id.toString())
  
    res.render('search', {
      title: 'Search Page',
      ad,
      searchText
    })
  }


})


module.exports = adController;

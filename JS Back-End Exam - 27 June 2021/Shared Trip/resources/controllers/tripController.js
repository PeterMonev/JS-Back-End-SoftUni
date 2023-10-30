const { hasUser } = require("../middlewares/guards");
const { getAll, create, getById, join, deleteById, update } = require("../services/tripService");
const { getUserById, updateUser } = require("../services/userService");
const { parseError } = require("../util/parser");

const tripController = require("express").Router();

tripController.get('/catalog', async (req, res) => {
    const trip = await getAll();

    res.render('shared-trips', {
        title: 'Catalog Page',
        trip
    })
});

tripController.get('/create',hasUser(), (req, res) => {
    res.render('trip-create',{
        title: 'Create Page'
    })
});

tripController.post('/create',hasUser(), async (req, res) => {
    const trip = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        imageUrl: req.body.imageUrl,
        car: req.body.car,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
        owner: req.user._id
    }

    const owner = await getUserById(req.user._id.toString());

    try {
        if(Object.values(trip).some(t => !t)){
            throw new Error('All fields need required');
        }

        let tripId = await create(trip);
        let list = owner.history;    
        list.push(tripId);
        
        await updateUser(owner._id, list);
        res.redirect('/trip/catalog')
        
    } catch (error) {
        res.render('trip-create',{
            title: 'Create Page',
            body: trip,
            errors: parseError(error)
        });
    }
});

tripController.get('/:id/details', async (req, res) => {
   const trip = await getById(req.params.id);
   let owner = await getUserById(trip.owner.toString());
   let allPassengers = [];

   if(req.user){
    
    if(trip.owner.toString( ) === req.user._id.toString()){
        trip.isOwner = true;

    }
   
    if(trip.buddies.map(a => a.toString()).includes(req.user._id.toString()) && !trip.isOwner){
        trip.isJoin = true; 
   }

   if(trip.seats === 0){
      trip.isFull = true;
   }

   }

   const passengers = trip.buddies.toString().split(',');
   let textPassengers;

   if(trip.buddies.length > 0){
    for(id of passengers){
        let emailPassengers = await getUserById(id);
        allPassengers.push(emailPassengers.email)
     }
  
     textPassengers = allPassengers.join(', ');
   }


    res.render('trip-details',{
        title: 'Details Page',
        trip,
        owner,
        textPassengers
    })
});

tripController.get('/:id/join',hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);

    

    try{
        if(trip.owner == req.user._id){
            throw new Error('You cannot join on your own trip');
        }

        if(trip.buddies.map(a => a.toString()).includes(req.user._id.toString()) && !trip.isOwner){
            trip.isJoin = true; 
            throw new Error('You cannot join twice');
       }

       if(trip.seats === 0){
          throw new Error('The car is full with passaengers')
       }
       
       await join(req.params.id,req.user);
       res.redirect(`/trip/${req.params.id}/details`)


    } catch (error) {
        res.render('trip-details', {
            title: 'Details Page',
            trip,
            errors: parseError(error)
        })
    }
});

tripController.get('/:id/delete',hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);

    if(trip.owner != req.user._id){
        return res.redirect('auth/login')
    }

    await deleteById(req.params.id);
    res.redirect('/trip/catalog');
})

tripController.get('/:id/edit',hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);

    if(trip.owner != req.user._id){
        return res.redirect('auth/login')
    }

    res.render('trip-edit',{
        title: 'Edit Page',
        trip
    })

})

tripController.post('/:id/edit',hasUser(), async (req, res) => {
    const trip = await getById(req.params.id);

    if(trip.owner != req.user._id){
        return res.redirect('auth/login')
    }

    const edited = {
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        time: req.body.time,
        imageUrl: req.body.imageUrl,
        car: req.body.car,
        seats: Number(req.body.seats),    
        price: Number(req.body.price),
        description: req.body.description,
    }

    try{
        if(Object.values(edited).some(a => !a)){
            throw new Error('All fields are required')
        }

        await update(req.params.id,edited);
        res.redirect(`/trip/${req.params.id}/details`)


    } catch(error){
        res.render('trip-edit',{
            title: 'Edit Page',
            trip: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error)
        })
    }
})

tripController.get('/profile',hasUser(), async (req,res)=>{
    const user = await getUserById(req.user._id);
    let trips = [];
    let list = [];

    for(id of user.history.toString().split(',')){
     
        list = await getById(id);
        console.log(list)
       if(list !== null){
        trips.push(list)
        user.history = user.history.length
      } else {
        user.history = 0;
    
      }
   
    }

    res.render('profile', {
        title: 'Profile Page',
        user,
        trips
    })
})

module.exports = tripController;
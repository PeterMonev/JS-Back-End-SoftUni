const { hasUser } = require('../middlewares/guards');
const { create, getAll, getById, auctionBid, deleteById, update, getClosedByUser, closeAuction } = require('../services/auctionService');
const { getUserById } = require('../services/userService');
const { parseError } = require('../util/parser');

const auctionController = require('express').Router();

auctionController.get('/catalog', async(req, res) => {
    const auction = await getAll();

    res.render('browser', {
        title: 'Catalog Page',
        auction
    })
})

auctionController.get('/create',hasUser(), (req, res)=> {
    res.render('create', {
        title: 'Create Page',
    })
});

auctionController.post('/create',hasUser(),  async (req, res)=> {
    const auction = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price),
        owner: req.user._id,
    }

    try {
    if(Object.values(auction).some(a => !a)){
        throw new Error('All fields need required');
    }

     await create(auction);
     res.redirect('/auction/catalog');

    } catch (error) {

       res.render('create',{
         title: 'Create Page',
         body: auction,
         errors: parseError(error),
       })
    }
});

auctionController.get('/:id/details', async function (req, res) {
    const auction = await getById(req.params.id);
    let user = undefined;
    let owner = await getUserById(auction.owner.toString());     
  
    
    if(auction.bidder != undefined){
        let bidderUser = await getUserById(auction.bidder.toString());
        auction.bidderFisrtName= bidderUser.firstName;
        auction.bidderLastName= bidderUser.lastName;
    }

    if(req.user){
        user = await getUserById(req.user._id);
        
        if(auction.owner == req.user._id){
            auction.isOwner = true;
        }
        
        if(auction.bidder && !auction.isOwner){

            if(auction.bidder._id.toString() == req.user._id){
                auction.isBidder = true;
            }
        }
    }  

    res.render('details', {
        title: 'Details Page',
        auction,
        owner
    })

});

auctionController.post('/:id/bid', async (req, res) => {
    const user = await getUserById(req.user._id)
    const auction = await getById(req.params.id);
    let currPrice = Number(req.body.price);
    let owner = await getUserById(auction.owner.toString());      
    auction.isBidderOwner = false;
    let bidder = await getUserById(auction.bidder.toString());

    
    if(owner._id.toString() !== user._id.toString() && !auction.isBidderOwner){
        if(auction.price < currPrice){
            auction.bidder = user;
            auction.isBidder = true;
            await auctionBid(req.params.id,auction,currPrice);
            auction.isBidderOwner = true;
         } else {
      
         }

    } 
 
     res.render('details', {
        title: 'Details Page',
        auction,
        owner,
        bidder
    })
      
});

auctionController.get('/:id/delete', async (req, res) => {
    const auction = await getById(req.params.id);

    if(auction.owner != req.user._id){
        res.redirect('/auth/login')
    }

    await deleteById(req.params.id);
    res.redirect('/auction/catalog')
})

auctionController.get('/:id/edit',hasUser(), async (req, res) => {
    const auction = await getById(req.params.id);

    if(auction.owner != req.user._id){
       return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        auction
    })
});

auctionController.post('/:id/edit',hasUser(), async (req, res) => {
    const auction = await getById(req.params.id);


    if(auction.owner != req.user._id){
       return res.redirect('/auth/login');
    }
    let edited = {};

    if(req.body.price == undefined){
         edited = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            imageUrl: req.body.imageUrl,
            price: auction.price
        };
    } else {
        edited = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
        };
    }


    try{
        if(Object.values(edited).some(a => !a)){
            throw new Error("All fields are required");
        }

        await update(req.params.id,edited);
        res.redirect(`/auction/${req.params.id}/details`)
       
    } catch (error) {
     
        res.render('edit', {
            title: 'Edit page',
            auction: Object.assign(edited,{_id: req.params.id}) ,
            errors: parseError(error)
        })
    }
});

auctionController.get('/closed', async (req, res) => {
    const user = await getUserById(req.user._id);
    const auction = await getClosedByUser(req.user._id);
    
    res.render('closed', {
        title: 'Closed Page',
        auction,
        user
    })
});

auctionController.get('/:id/closed', async (req, res) => {
    const id = req.params.id;
    const auction = await getById(req.params.id);

    try{
      await closeAuction(id);
      res.redirect('/auciton/closed');
    } catch (error){
        console.log(error);
        res.render('details', {
            title: 'Details page',
            auction,
            errors: parseError(error)
        })
    }
    

});





module.exports = auctionController;
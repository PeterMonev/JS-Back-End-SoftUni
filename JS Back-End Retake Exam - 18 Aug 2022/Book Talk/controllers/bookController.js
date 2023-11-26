const { create,getAll, getById, bookWish ,deleteById,update } = require("../services/bookService");
const {  getUserById} = require("../services/userService");
const { parseError } = require("../util/parser");
const bookController = require("express").Router();

bookController.get('/catalog', async (req, res) => {
   let book = await getAll();
   res.render('catalog',{
     title: 'Book Catalog',
     book
   })
})

bookController.get("/create", (req, res) => {
  res.render("create", {
    title: "Create Book",
  });
});

bookController.post('/create', async (req, res) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        stars: Number(req.body.stars),
        imageUrl: req.body.imageUrl,
        review: req.body.review,
        owner: req.user._id,
    };

    try {
        if(Object.values(book).some(b => !b)){
            throw new Error('All fields neeed required');
        }

        await create(book);
        res.redirect('/books/catalog');

    } catch (error) {
       res.render('create', {
        title: 'Create Book',
        body: book,
        errors: parseError(error)
       })
    }
});

bookController.get('/:id/edit', async (req, res) => {
  const book = await getById(req.params.id);

  if (book.owner != req.user._id) {
    return res.redirect("/auth/login");
  }

  res.render('edit',{
    title: 'Edit Book',
    book
  })
});

bookController.post('/:id/edit', async (req, res) => {
  const book = await getById(req.params.id);

  if (book.owner != req.user._id) {
    return res.redirect("/auth/login");
  }

  const edited = {
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    review: req.body.review,
    genre: req.body.genre,
    stars: req.body.stars
  }

  try {
    if (Object.values(edited).some((v) => !v)) {
      throw new Error("All fields are required");
    }

    await update(req.params.id, edited);
    res.redirect(`/books/${req.params.id}/details`);
  } catch (error) {
    res.render('edit', {
      tittle: "Edit Book",
      book: Object.assign(edited, { _id: req.params.id }),
      errors: parseError(error),
    })
  }
})

bookController.get('/:id/details', async (req, res) => {
   const book = await getById(req.params.id);
   let user =undefined
   if(req.user){
    user = await getUserById(req.user._id);

   if(book.owner == req.user._id){
    book.isOwner = true;
  
   }
   if(book.wishingList.map(b => b.toString()).includes(req.user._id.toString()) && !book.isOwner){
       book.isWished = true;
    }
   } 

   res.render('details',{
    title: 'Book Details',
    book,
   })
});

bookController.get('/:id/delete', async (req, res) => {
   const book = await getById(req.params.id);
 
   if(book.owner != req.user._id){
    return res.redirect('/auth/login');
   }

   await deleteById(req.params.id);
   res.redirect("/");
})

bookController.get('/:id/wish', async (req, res) => {
   const book = await getById(req.params.id);

   try {
      if(book.owner == req.user._id){
        book.isOwner = true;
        throw new Error("Cannot wish your own book");
      }
      if (book.wishingList.map(b => b.toString()).includes(req.user._id.toString())) {
        book.isWished == true;
        throw new Error("Cannot wish twice");
      }
  
      await bookWish(req.params.id, req.user._id);
      res.redirect(`/books/${req.params.id}/details`);
   } catch (error) {
      res.render('details', {
        title: 'Book Details',
        book,
        errors: parseError(error)
      })
   }
})


module.exports = bookController;

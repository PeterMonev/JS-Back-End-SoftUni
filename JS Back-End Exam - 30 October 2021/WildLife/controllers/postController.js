const { getAll,create, getById, voteUp, deleteById, update, voteDown } = require('../services/postService');
const { getUserById, updateUser } = require('../services/userService');
const { parseError } = require("../util/parser");
const { hasUser } = require("../middlewares/guards");

const postController = require('express').Router();

postController.get('/catalog', async (req, res) => {
    const post = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        post
    })
})

postController.get('/create',hasUser(), (req, res)=>{
    res.render('create', {
        title: 'Create Page',
    })
})

postController.post('/create',hasUser(), async (req, res)=>{
    const post = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        date: req.body.date,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        owner: req.user._id,
    };

    try {
      if(Object.values(post).some(c => !c)){
        throw new Error('All fields are required');
      }
      const owner = await getUserById(req.user._id);
      let postId = await create(post);

      let list = owner.myPost;
      list.push(postId);
      
      await updateUser(owner._id,list);
      res.redirect('/post/catalog');

    } catch (error){
    console.log(error);
        res.render('create', {
            title: 'Create Post',
            body: post,
            errors: parseError(error)
        })
    }
})

postController.get('/:id/details', async function (req, res) {
    const post = await getById(req.params.id);
    const author = await getUserById(post.owner.toString());
    let user = undefined;
    
    if(req.user){
        user = await getUserById(req.user._id);

        if(post.owner == req.user._id){
            post.isOwner = true;
        }

        if(post.vote.map(v => v.toString()).includes(req.user._id.toString()) && !post.isOwner){
            post.isVote = true;
        }
    }  

    if(post.vote.length > 0){
        const votedEmail = [];

        for(id of post.vote){
          const votedUser = await getUserById(id.toString());
          votedEmail.push(votedUser.email);
        }
        
        post.votedUsers = votedEmail.join(', ')
    }
   
    res.render('details', {
        title: 'Details Page',
        post,
        author
    })

})

postController.get('/:id/edit',hasUser(), async (req, res) => {
    const post = await getById(req.params.id);

    if(post.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit Page',
        post
    })
})

postController.post('/:id/edit',hasUser(),  async (req, res) => {
    const post = await getById(req.params.id);

    if(post.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    const edited = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        date: req.body.date,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
    };

    try {
        if(Object.values(edited).some(e => !e)){
            throw new Error("All fields are required");
        }

       await update(req.params.id,edited);
       res.redirect(`/post/${req.params.id}/details`);

    } catch (error){
   
        res.render('edit',{
            title: 'Edit Page',
            post: Object.assign(edited,{ _id: req.params.id}),
            errors: parseError(error),
        })
    }
})

postController.get('/:id/delete',hasUser(),  async (req, res) => {
    const post = await getById(req.params.id);

    if(post.owner != req.user._id){
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/post/catalog');
})

postController.get('/:id/voteUp',hasUser(), async (req, res) => {
    const post = await getById(req.params.id);

    try {
      if(post.owner == req.user._id){
        post.isOwner = true;
       throw new Error('Cannot vote your own post');
      }

      if(post.vote.map(c => c.toString()).includes(req.user._id.toString())){
        post.isVote = true;
       throw new Error('Cannot vote this post twice');
      }

      await voteUp(req.params.id, req.user._id);
      res.redirect(`/post/${req.params.id}/details`);

    } catch (error){
   
       res.render('details', {
           title: 'Details Page',
           post,
           errors: parseError(error)
       })
    }
});

postController.get('/:id/voteDown',hasUser(), async (req, res) => {
    const post = await getById(req.params.id);

    try {
      if(post.owner == req.user._id){
        post.isOwner = true;
       throw new Error('Cannot vote your own post');
      }

      if(post.vote.map(c => c.toString()).includes(req.user._id.toString())){
        post.isVote = true;
       throw new Error('Cannot vote this post twice');
      }

      await voteDown(req.params.id, req.user._id);
      res.redirect(`/post/${req.params.id}/details`);

    } catch (error){
   
       res.render('details', {
           title: 'Details Page',
           post,
           errors: parseError(error)
       })
    }
});  

postController.get('/myPost',hasUser(), async (req, res) => {
    const post = [];
    const user = await getUserById(req.user._id);

    for(let i = 0; i < user.myPost.length; i++) {
         console.log(user.myPost[i].toString())
        if(await getById(user.myPost[i].toString()) !== null){
        post.push(await getById(user.myPost[i].toString()));
        post[0].author = user.firstName + ' ' + user.lastName;
        }
    
    }

   
    console.log(post)
    res.render('my-posts', {
        title: 'My posts',
        post,
        
    })
})


module.exports = postController;
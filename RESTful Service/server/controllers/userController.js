const router = require('express').Router();

router.post('/regsiter', async(req, res) => {
     const {username, email, password, repeatPassword } = req.body;

     const token = await authService.register(username, email, password, repeatPassword);

     res.cookie('auth', token);
   
});

router.post('/login', (req, res) => {

});

router.get('/logout', (req, res) => {

});

module.exports = router;
const express = require("express");
const session = require("express-session");
const { login } = require("./userService");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    cookie: { secret: false },
    resave: false,
    saveUninitialized: true,
    secret: "qwe",
  })
);

const homeTemplate = (user,users) => `<h1>Welcome, ${user || 'guest'}</h1>
<p>Hello, guest</p> <p>Please <a href="/login">login here</a></p>
<ul>
${users.map(u=> `<li>${u.username}</li>`).join('/n')}
</ul> `

app.get("/", (req, res) => {
  console.log(req.session);
  res.send(homeTemplate(req.session.user, users));
});

app.get("/login", (req, res) => {
  res.send(`<h1>Login</h1>
  <form action="/login" method="post">
   <label>Username: <input type="text" name="username"></label> 
   <label>Password: <input type="password" name="password"></label> 
   <input type="submit" value="Log in">
    </form>`);
});

const users = []

const registerTemplate = (error) =>`<h1>Register</h1>
${error ? `<p>${error}</p>` : ''}
<form action="/register" method="post">
<label>Username: <input type="text" name="username"></label> 
<label>Password: <input type="password" name="password"></label> 
<label>Repeat Password: <input type="password" name="repass"></label>  
<input type="submit" value="Sing up">
</form>`;

app.get("/register", (req, res) => {
  res.send(registerTemplate());
});

app.post('/register',async (req, res) => {
      try {
        if(req.body.username == '' || req.body.password == ''){
          throw new Error('All fields needs required')
        } else if (req.body.passwords != req.body.repass) {
          throw new Error('Password dont match')
         }
   
       await register(req.body.username, req.body.password)
       res.redirect('/')

      } catch (e) {
        res.send(registerTemplate(e.message))
      }
    
})

app.post("/login",async (req, res) => {
  
  if (await login(req.body.username, req.body.password)) {
    req.session.user = req.body.username;
    res.redirect("/");
  } else {
    res.status(401).send("Incorrect username or password!");
  }
});

app.listen(3000);

const app = require("express")();
const cookieParser = require("cookie-parser");
const jwt = require("jasonwebtoken");

const secret = "super duper secret";

app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const data = jwt.verify(token, secret);
      req.user = data;
    } catch (err) {
        res.cookies('token');
        res.redirect('/login');
    }
  }

  next()
});

app.get("/", (req, res) => {
   if(req.user){
    res.send('hello, ' + req.user.name )
   } else {
    res.send('Hello, guest')
   }
});

app.get("/jwt", (req, res) => {
  const payload = {
    username: "Peter",
    rolese: ["user", "admin"],
  };

  const token = jwt.sign(payload, secret);
  res.cookie("token", token);
  res.send("Token send");
});

app.listen(3000);

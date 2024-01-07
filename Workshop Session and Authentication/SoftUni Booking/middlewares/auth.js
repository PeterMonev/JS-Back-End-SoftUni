const jwt = require("jsonwebtoken");

module.exports = (jwtSecret) => (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const data = jwt.verify(token, jwtSecret);
      console.log(data);
      req.user = data;
    } catch (err) {
      res.clearCookie("jwt");
      return res.redirect("/login");
    }
  }

  req.signJwt = (data) =>
    jwt.sing(data, jwtSecret, {
      expiresIn: "4h",
    });

  next();
};

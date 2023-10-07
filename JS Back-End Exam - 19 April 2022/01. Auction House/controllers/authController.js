const express = require("express");
const { isGuest } = require("../middlewares/guards");
const { register,login } = require("../services/userService");
const { parseError } = require("../util/parser");

const authController = require("express").Router();

authController.get("/register",isGuest(), (req, res) => {
  res.render("register", {
    title: "Register Page",
  });
});

authController.post("/register",isGuest(),  async (req, res) => {

  try {
    if (req.body.email == "" || req.body.password == "" || req.body.firstName == "" || req.body.lastName == "") {
      throw new Error("All fields are required");
    }
    if (req.body.password != req.body.repass) {
      throw new Error("Passwords dont match");
    }

    if(req.body.password.length < 5){
      throw new Error("Password must be at least 5 characters");
    }

    const token = await register(req.body.email, req.body.password, req.body.firstName , req.body.lastName);

    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {
    const errors = parseError(error);

    res.render("register", {
      title: "Register Page",
      errors,
      body: {
        email: req.body.email,
      },
    });
  }
});

authController.get("/login",isGuest(),  (req, res) => {
  res.render("login", {
    title: "Login Page",
  });
});

authController.post("/login",isGuest(),  async (req, res) => {
  try { 
  const token = await login(req.body.email, req.body.password);

  res.cookie('token', token);
  res.redirect('/');
  } catch (error) {
    const errors = parseError(error);
    res.render("login", {
      title: "Login Page",
      errors,
      body: {
        email: req.body.email,
      },
    });
  }
});

authController.get('/logout',(req, res) => {
  res.clearCookie('token');
  res.redirect('/');
})

module.exports = authController;

const express = require('express')
const bodyParser = require('body-parser')
const Router = express.Router()
const userSchema = require('../models/userSchema')
const itemsSchema = require("../models/itemSchema")
const session = require('express-session')

Router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

let isAuthenticated = false

Router.get('/', (req, res) => {
  res.render('index')
})


Router.get('/logout', (req, res) => {
  isAuthenticated = false
  req.session.destroy()
  res.render('index')
})

Router.get('/home_page', (req, res) => {
  if (isAuthenticated) {
    res.render('home_page')
  } else {
    res.redirect('/')
  }
})

Router.get('/Update', (req, res) => {
    if(isAuthenticated)
    {
        res.render('Update');
    }
    else
    {
        res.redirect('/');
    }
  
})

Router.get('/Add_product', (req, res) => {
  res.render('Add_product')
})

Router.get('/displaytranscations', (req, res) => {
    if(isAuthenticated)
    {
        res.render('displaytranscations')
    }
    else{
        res.redirect('/')
    }
})

Router.post('/index', async (req, res) => {
  try {
    const {
      email,
      fullName,
      username,
      password
    } = req.body
    const newUser = new userSchema({
      email,
      fullName,
      username,
      password
    })
    await newUser.save()
    res.render('index')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

Router.post('/login', (req, res) => {
  const {
    username,
    password
  } = req.body
  userSchema.findOne({
      username: username
    })
    .then((result) => {
      if (result && result.password === password) {
        isAuthenticated = true
        req.session.isLoggedIn = isAuthenticated
        res.redirect('/home_page')
      } else {
        res.status(404).send('Login Failed')
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Internal Server Error')
    })
})

Router.post('/items', async (req, res) => {
  try {
    const {
      pname,
      source,
      destination,
      remark
    } = req.body
    const items = new itemsSchema({
      pname,
      source,
      destination,
      remark
    })
    await items.save()
    res.render('Add_product')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = Router

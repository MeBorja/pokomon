const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: ".env" });
const authRoutes = require("./routes/authRoutes")
const cookiePraser = require('cookie-parser');
const { requireAuth, checkUser, checkAdmin } = require('./middleware/authMiddleware');
const { collection } = require('./models/Pokomon');


const app = express();

(async () => {
  try {
    
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    app.listen(3000)
    let poko = (await collection.find().toArray())
    console.log('Connected to DB.');
    setInterval(async () => {
        poko = await collection.find().toArray()
    }, 5000)

    app.use(cookiePraser())
    
    app.use(express.static('public'));
    app.use(express.json())
    app.set('view engine', 'ejs');

    app.get('*',checkUser )
    app.get('/login',  (req, res) => res.render('login'))
    app.get('/signup',  (req, res) => res.render('signup'))
    app.get('/', (req, res) => res.render('home', {pokos: poko}));
    app.get('/404' ,(req, res) => res.render('404'))
    app.get('/pokomonReg', requireAuth, (req, res) => res.render('pokomonReg'))
    app.use(authRoutes)

   
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
// middleware;

// view engine


// database connection



// routes

const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Pokomon = require('../models/Pokomon')
const { requireAuth, checkUser, checkAdmin } = require('../middleware/authMiddleware');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', username: '',pokomonName: ''  };

  // duplicate email error
if (err.message === 'incorrect email') {
  errors.email = 'That email is not registered'
}
if (err.message === 'incorrect password') {
  errors.password = 'That password is incorrect'
}
if (err.message.includes('Please enter a pokomon name')) {
  errors.pokomonName = ' Please enter a pokomon name'
}
if (err.message.includes('Please enter a pokomon name')) {
  errors.pokomonName = ' Please enter a pokomon name'
}



  if (err.code === 11000) {
    if(err.message.includes('username_1 dup key:')) {
      errors.username = 'that user name is already taken'
    }
    if (err.message.includes('email_1 dup key')) {
      errors.email = 'that email is already registered';
    }
    

    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {

    Object.values(err.errors).forEach(({ properties }) => {

      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.create({ email, password, username });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, username: user.username });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id, username: user.username });
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
    
}



module.exports.pokomon_post =  [checkUser, async (req, res) => {
  const { pokomonName, username, ability1, ability2, ability3 } = req.body;
  try {
    const pokomon = await Pokomon.create({pokomonName, username, ability1, ability2, ability3})
    res.status(201).json(pokomon)
  } catch (error) {
    console.log(error);
  }
  
}]
module.exports.deletePokomon_post = [checkAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    const scorePlayer = await Pokomon.findByIdAndDelete({_id : id})
    res.status(201)
  } catch (error) {
    console.log(error);
  }
  
}]

module.exports.pokomonReg_get = (req, res) => {
  res.render('pokomonReg')
}

module.exports.pokomonReg_post = [requireAuth, async (req, res) => {
  const { pokomonName, username, ability1, ability2, ability3 } = req.body;
  try {
    const pokomon = await Pokomon.create({pokomonName, username, ability1, ability2, ability3})
    res.status(201).json(pokomon)
  }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
}]



module.exports.id_get = [checkUser, async (req,res) => {
  const id = req.params.id
  const pok = await Pokomon.find({username:id})
  const pokomons = () =>
            res.render('target', {pokomon: pok})
    pokomons()
        }]

module.exports.homeUser_get = [checkUser, async (req, res) => {
  const userId = req.params.id
  const pok = await Pokomon.find({username:userId})
  const pokomons = () =>
            res.render('userPage', {pokomon: pok, userId})
    pokomons()
  

}]



module.exports.updatePokomon_post = [requireAuth, async (req, res) => {
  const { pokomonName, ability1, ability2, ability3, id } = req.body;
  const updatedValue = {
    pokomonName, ability1, ability2, ability3
  };
  try {
    const updatedPokomon = await Pokomon.findByIdAndUpdate(id, updatedValue, { new: true });
    if (updatedPokomon) {
      console.log('Pokomon updated:', updatedPokomon);
      res.status(201).json(updatedPokomon);
    } else {
      console.log('Pokomon not found');
      res.status(404).json({ error: 'Pokomon not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'An error occurred' });
  }
}];
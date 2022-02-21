const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const { User } = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/apidb', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);




// Routes Here
// GET all users
app.get('/api/users', (req, res) => {
  User.find()
    .then(dbUserData => {
      res.json(dbUserData);
    })
    .catch(err => {
      res.json(err);
    });
});

// GET a single user by id
app.get('/api/users/:id', (req, res) => {
  User.findById({ _id: req.params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!"});
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST a new user


// PUT to update a user by id


//DELETE to remove a user by id




// Routes End Here


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
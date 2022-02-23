const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/apidb', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);



// User Routes START
// GET all users
app.get('/api/users', (req, res) => {
  db.User.find()
    .then(dbUserData => {
      res.json(dbUserData);
    })
    .catch(err => {
      res.json(err);
    });
});
// GET a single user by its _id and populated thought and friend data
app.get('/api/users/:id', (req, res) => {
  db.User.findById({ _id: req.params.id })
    .populate({
      path: 'thoughts',
      path: 'friends'
    })
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
app.post('/api/users', ({ body }, res) => {
  db.User.create(body)
    .then(dbUserData => {
      res.json(dbUserData);
    })
    .catch(err => {
      res.json(err);
    });
});
// PUT to update a user by its _id
app.post('/api/users/:id', ({ params, body }, res) => {
  db.User.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then(dbUser => {
      if (!dbUser) {
        res.json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});
// DELETE to remove user by its _id
app.delete('/api/users/:id', ({ params }, res) => {
  db.User.findOneAndDelete({ _id: params.id })
    .then(dbUser => {
      if (!dbUser) {
        res.json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});
// User Routes END



// Friend Routes START
// POST to add a new friend to a user's friend list
app.post('/api/users/:userId/friends/:friendId', (req, res) => {
  db.User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendsId } },
    { runValidators: true, new: true }
  )
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
// DELETE to remove a friend from a user's friend list
app.delete('/api/users/:userId/friends/:friendId', (req, res) => {
  db.User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: { friendId: req.params.friendId } } },
    { runValidators: true, new: true }
  )
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
// Friend Routes END



// Thought Routes START
// GET to get all thoughts

// GET to get a single thought by its _id

// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

// PUT to update a thought by its _id

// DELETE to remove a thought by its _id

// Thought Routes END



// Reaction Routes START
// POST to create a reaction stored in a single thought's reactions array field

// DELETE to pull and remove a reaction by the reaction's reactionId value

// Reaction Routes END



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
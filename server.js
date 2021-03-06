const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/apidb');

mongoose.set('debug', true);



// ----- User Routes START -----
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
app.get('/api/users/:userId', (req, res) => {
  db.User.findById({ _id: req.params.userId })
    .populate({
      path: 'thoughts',
      path: 'friends'
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id!"});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
// POST a new user
app.post('/api/users', (req, res) => {
  db.User.create(req.body)
    .then(dbUserData => {
      res.json(dbUserData);
    })
    .catch(err => {
      res.json(err);
    });
});
// PUT to update a user by its _id
app.put('/api/users/:userId', (req, res) => {
  db.User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true })
    .then(dbUser => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id!"});
        return;
      }
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});
// DELETE to remove user by its _id
app.delete('/api/users/:userId', (req, res) => {
  // BONUS: Remove a user's associated thoughts when deleted
  // db.User.findOneAndUpdate(
  //   { _id: req.params.userId },
  //   { $set: { thoughts: [] },
  //   { runValidators: true, new: true }
  // )
  //   .then(dbThoughtData => {
  //     res.json(dbThoughtData);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json(err);
  //   });
  db.User.findOneAndDelete({ _id: req.params.userId })
    .then(dbUser => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id!"});
        return;
      }
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});
// ----- User Routes END -----



// ----- Friend Routes START -----
// POST to add a new friend to a user's friend list
app.post('/api/users/:userId/friends/:friendId', (req, res) => {
  db.User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id!"});
        return;
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
    { $pull: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id!"});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
// ----- Friend Routes END -----



// ----- Thought Routes START -----
// GET to get all thoughts
app.get('/api/thoughts', (req, res) => {
  db.Thought.find()
    .then(dbThoughtData => {
      res.json(dbThoughtData);
    })
    .catch(err => {
      res.json(err);
    });
});
// GET to get a single thought by its _id
app.get('/api/thoughts/:thoughtId', (req, res) => {
  db.Thought.findById({ _id: req.params.thoughtId })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with this id!"});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
app.post('/api/thoughts/', (req, res) => {
  db.Thought.create(req.body)
    .then(({ _id }) => {
      return db.User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: _id } },
        { runValidators: true, new: true }
      )
    })
    .then(dbThoughtData => {
      res.json(dbThoughtData);
    })
    .catch(err => {
      res.json(err);
    });
});

// PUT to update a thought by its _id
app.put('/api/thoughts/:thoughtId', (req, res) => {
  db.Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with this id!"});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      res.json(err);
    });
});
// DELETE to remove a thought by its _id
app.delete('/api/thoughts/:thoughtId', (req, res) => {
  db.Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with this id!"});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      res.json(err);
    });
});
// ----- Thought Routes END -----



// ----- Reaction Routes START -----
// POST to create a reaction stored in a single thought's reactions array field
app.post('/api/thoughts/:thoughtId/reactions', (req, res) => {
  db.Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { new: true }
  )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with this id!"});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
// DELETE to pull and remove a reaction by the reaction's reactionId value
app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', (req, res) => {
  db.Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { _id: req.params.reactionId } } },
    { new: true }
  )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id!"});
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
// ----- Reaction Routes END -----



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
const express = require("express");
const db = require("./data/db");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send({ api: "up and running..." });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("error on GET /api/users", err);
      res
        .status(500)
        .json({ errorMessage: "error getting list of users from database" });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.log("error on GET /api/users/:id", err);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved" });
    });
});

server.post("/api/users", (req, res) => {
  const userData = req.body;

  if (!userData.name || !userData.bio) {
    res.status(400).json({ error: "Please provide name and bio for the user" });
  }

  db.insert(userData)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log("error on POST /api/users", err);
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      if (!removed) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json({ message: "User removed successfully", removed });
      }
    })
    .catch(err => {
      console.log("error on DELETE /api/users/:id", err);
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.update(id, userData)
    .then(updated => {
      if (!updated) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json({ message: "User updated successfully", updated });
      }
    })
    .catch(err => {
      console.log("error on PUT /api/users/:id", err);
      res.status(500).json({ errorMessage: "error updating user" });
    });
});

const port = 4000;
server.listen(port, () => console.log(`API running on port ${port}`));

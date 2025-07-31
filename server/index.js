const express = require('express');
const cors = require('cors');
let users = require('./sample.json');
const fs = require('fs');// file system package

const app = express();
app.use(express.json());
const port = 8000;
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://fabulous-cucurucho-89105e.netlify.app'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);


// Display all users
app.get('/users', (req, res) => {
  return res.json(users);
});
// Delete user detail 
app.delete('/users/:id', (req, res) =>{
    let id = Number(req.params.id);
    users = users.filter(user => user.id !== id);
    fs.writeFile(__dirname + '/sample.json', JSON.stringify(users, null, 2), (err) => { 
      if (err) {
        return res.status(500).json({ error: 'Failed to delete user' });   
      }
      return res.json(users);    
    });
});

///Add New User
app.post("/users", (req, res) => {
  let { actor, year, movies } = req.body; 
  if (!actor || !year || !movies) {
    return res.status(400).send({ message: "All fields are required" });  // ✅ add return
  }
  let id = Date.now();
  users.push({ id, actor, year, movies }); 
  fs.writeFile(__dirname + '/sample.json', JSON.stringify(users, null, 2), (err) => { 
    return res.json({ "message": "User Detail added success" });
  });
});

// update user details
app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let { actor, year, movies } = req.body;

  console.log("PATCH ID:", id);
  console.log("PATCH BODY:", req.body);

  if (!actor || !year || !movies) {
    return res.status(400).send({ message: "All fields are required" });
  }

  let index = users.findIndex((user) => user.id == id);

  if (index === -1) {
    return res.status(404).send({ message: "User not found" });
  }

  users.splice(index, 1, { id, actor, year, movies });

  fs.writeFile(
    __dirname + '/sample.json',
    JSON.stringify(users, null, 2),
    (err) => {
      if (err) {
        return res.status(500).send({ message: "Failed to save file" });
      }
      return res.json({ message: "User Detail updated successfully" });
    }
  );
});


app.listen(port,(err) => {
    console.log(`app is running in port ${port}`);
});
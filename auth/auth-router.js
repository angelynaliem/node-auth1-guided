const router = require("express").Router();

const users = require("../users/users-model.js");

const bcrypt = require("bcryptjs");

//Registration endpoint
router.post("/register", async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); //2 to the 10 power or factor of 10

  user.password = hash;

  try {
    const saved = await users.add(user);
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      res.session.user = user;
      res.status(200).json({ message: `Welcome ${user.username}` });
    } else {
      res.status(401).json({ message: "invalid creds" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/logout", (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("good bye");
      }
    });
  }
});

module.exports = router;

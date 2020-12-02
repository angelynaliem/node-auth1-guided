const express = require("express");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
  name: "alsession",
  secret: "keep it dark",
  cookie: {
    maxAge: 3600 * 1000, // 1000 milliseconds
    secure: false, //true in production
    httpOnly: true,
  },
  resave: false,
  saveUninitalized: false, //prompt to save cookies

  store: new KnexSessionStore({
    knex: require("../database/connection.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 3600 * 1000, //number of milliseconds in an hour
  }), //provide access to express-session to store data to database
};

server.use(session(sessionConfig));
server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;

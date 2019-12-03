// eslint-disable-next-line no-global-assign
Promise = require("bluebird");
const httpServer = require("http").createServer();
const { port, env, socketUrl, socketPort } = require("./config");

const server = require("./server");
// const fetchMatches = require('./api/v1/matches/fetch-matches');

const scheduler = require("./scheduler");
const { createAdmin, counter } = require("./bootstrap");

server.listen(port, () => {
  scheduler(server);
  console.info(`Server started on port ${port} (${env})`);

  createAdmin();
  counter();
});

// fetchMatches();

const src = server;

module.exports = src;

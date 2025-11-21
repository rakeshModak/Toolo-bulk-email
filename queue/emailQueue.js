const { Queue } = require("bullmq");
const connection = require("../config/redis");

const emailQueue = new Queue("community-emails", {
  connection
});

module.exports = emailQueue;

#!/usr/bin/node

const axios = require("axios");
const { exit } = require("process");

axios
  .get("https://cracers.herokuapp.com/api/race/checkRaces")
  .then((res) => {
    process.exit(0);
  })
  .catch((err) => {
    process.exit(1);
  });

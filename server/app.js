import express from 'express'; // Changed from const express = require("express");

const app = express();
app.use(express.json());

// define a port number and giving us console log messages
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
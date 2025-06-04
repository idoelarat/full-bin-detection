import express from 'express';
import db from './config/db.js';

const app = express();
app.use(express.json());

//connect to db
console.log('App started, DB should be connected.');

// define a port number and giving us console log messages
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//routes
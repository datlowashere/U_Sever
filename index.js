const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = require("./src/config/mongoosedb");
db.connect();
const route=require('./src/routes/index');


app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(express.json());


route(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

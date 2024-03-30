const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbConfig = require('./config/database');

const app = express();

/* configure body-parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Express Routes Import
const authroute = require("./authentication/routes");
const productroute = require("./products/routes");
const storeroute = require("./stores/routes");

app.use('/api', authroute)
app.use('/api/products', productroute)
app.use('/api/stores', storeroute)


/* connecting to the database */
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})                      
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

/* listen for requests */
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
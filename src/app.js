const express = require('express');
const bodyParser = require('body-parser');
const apicache = require('apicache');

const pingRoute = require('./api-routes/ping');
const postsRoute = require('./api-routes/posts');

const app = express();
const port = process.env.PORT || 3000;

let cache = apicache.middleware;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cache all routes
app.use(cache('5 minutes'));

app.use('/api', pingRoute, postsRoute);

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
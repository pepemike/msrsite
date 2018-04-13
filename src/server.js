'use strict';

const auth0Calls = require("./api/serverAuth");
const express = require('express');
const protect = require('@risingstack/protect');
const path = require('path');
const bodyparser = require('body-parser');
const gen = require('./api/generalActions');
const query = require('./api/queryActions');
const update = require('./api/updateActions');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');


// ========== Middleware ==========
const checkTableID = (req, res, next) => {
    let tableID = req.params['table'];

    if(!exports.ALLOWED_TABLES.includes(tableID.toUpperCase())) {
        let err = "Invalid table name/potential SQL injection: " + tableID;
        console.log(err);
        if(res) res.status(403).send(err);
        return;
    }
    next();
};

const validateUser = (req, res, next) => {
    auth0Calls.getSysToken().then(() => auth0Calls.getLevel(req.user['sub'])).then(() => {
        console.log("[Middleware] user level: " + auth0Calls.userLevelServerSide);
        if(auth0Calls.userLevelServerSide === 'user' || auth0Calls.userLevelServerSide === 'admin') {
            next();
        }else{
            console.log("Invalid User Level: "+ auth0Calls.userLevelServerSide);
            res.sendStatus(401);
        }
    });
};

const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://rwwittenberg.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://msrapitest/',
    issuer: "https://rwwittenberg.auth0.com/",
    algorithms: ['RS256']
});


// ========== Configuration ==========
const app = express(); // server app

app.use(authCheck);

app.use(bodyparser.json({
    type: 'application/json',
    extended: false
})); // use bodyparser for JSON

app.use(protect.express.sqlInjection({
    body: true,
    loggerFunction: console.error
})); // use protect for security

app.set("port", process.env.PORT || 3005); // select port based on heroku settings

app.get('/apitest/', authCheck, (req, res) => { // generic test

    res.send("hello from the api!");
    console.log(req.user);
});






// ========== General Actions ==========
app.get('/api/connect', validateUser, gen.connect); // connect to the database
app.get('/api/disconnect', gen.disconnect); // disconnect from the database



// ========== Querying Actions ==========
app.get('/api/select*/:table', validateUser, checkTableID, query.selectAll); // select all from a table or view
app.get('/api/colnames/:table', validateUser, checkTableID, query.getColumns); // get column names from a table or view
app.get('/api/tabnames', validateUser, query.getTables); // get all table names from the db
app.post('/api/query/:table', validateUser, checkTableID, query.advancedQuery); // advanced query



// ========== Update Actions ==========
app.post('/api/insert/:table', validateUser, checkTableID, update.insert); // insert on a table
app.patch('/api/update/:table', validateUser, checkTableID, update.update); // update a table row
app.delete('/api/delete/:table', validateUser, checkTableID, update.delete); // delete a table row



// ========== Launching Server ==========
if (process.env.NODE_ENV === "production") { // if production, also host static (client) assets
    app.use(express.static(path.join(__dirname, '..', 'build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
    });
}

gen.connect().then(() => {
    // connect to the database
    query.getTables().then(result => {
        exports.ALLOWED_TABLES = result['recordsets'][0].map(tab => tab.TABLE_NAME);
        console.log(exports.ALLOWED_TABLES);
    }).then(() => {
        app.listen(app.get("port"), () => { // listen on the port
            console.log('[general] Server is running...');
            app.on('close', () => { // on close, disconnect from db
                gen.disconnect().then(() => {
                    console.log('[general] Server is stopped.');
                });
            });
        });
    });
}).catch(err => {
    console.log("[general] your wifi probably sucks lol");
    console.log(err);
});


var express = require('express');
var app = express();

app.get('/api', function (req, res) {
    res.send("hello world");
    // var sql = require("mssql");
    //
    // // config for your database
    // var config = {
    //     user: 'msrtest',
    //     password: 'msr2018!',
    //     server: 'den1.mssql4.gear.host',
    //     database: 'msrtest'
    // };
    //
    // // connect to your database
    // sql.connect(config, function (err) {
    //
    //     if (err) console.log(err);
    //
    //     // create Request object
    //     var request = new sql.Request();
    //
    //     // query to the database and get the records
    //     request.query('select * from Member', function (err, recordset) {
    //
    //         if (err) console.log(err)
    //
    //         // send records as a response
    //         res.send(recordset);
    //
    //     });
    // });
});

// app.use('*', express.static(path.join(__dirname, 'dist')));

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
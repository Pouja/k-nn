var debug = require("debug")("app");
var Factory = require("../common/factory.js");
var NN = require("./knn.js");
var db = new require("../common/database.js")();
var config = require("config").DATABASE;
var jf = require("jsonfile");
var _ = require("underscore");

var args = process.argv.slice(2);

if (!args[0])
    throw new Error("Specify k.");
if (!args[1])
    throw new Error("Specify p.");

//create the factory for validation data
var validationFactory = new Factory({
    db: db,
    startId: config.testStartId,
    endId: config.testEndId,
    table: config.table,
    bulk: config.bulk
});

//create factory for training data.
var trainingFactory = new Factory({
    db: db,
    startId: config.createStartId,
    endId: config.createEndId,
    table: config.table,
    bulk: config.bulk
});

var filters = [];

if (args[3]) {
    var attributes = jf.readFileSync(args[0]);

    attributes = _.sortBy(attributes, function(attr) {
        return attr.gain;
    })

    for (var i = 0; i < 0; i++)
        filters.push(attributes[i].attr);
}

var nn = new NN(validationFactory, trainingFactory, args[0], args[1], filters);
db.connectDB().then(function() {
    nn.init();
    nn.run();
    console.log(nn.mismatch);
    return db.closeDB()
}).then(function() {}, function() {})
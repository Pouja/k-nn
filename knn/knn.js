var debug = require("debug")("nn");
var debugErr = require("debug")("nn:error");
var _ = require("underscore");

/**
 * Runs the k-NN algoritme on the given set.
 * @param {Factory} vFactory The factory that retrieves all the validation data.
 * @param {Factory} tFactory The factory that retrieves all the training data.
 * @param {Number} k The number of closest distances that should be kept.
 * @param {Number} p The value for the MD function.
 * @param {Array} extraFilters A list of attributes/features that should not be included in the distance function.
 * @class NN
 */
var NN = function(vFactory, tFactory, k, p, extraFilters) {
    var self = {};
    var memory = [];
    var filters = ["id", "class"].concat(extraFilters);
    self.mismatch = 0;

    /**
     * The Minoswki Distance function.
     * @param {Object} vector1 A object with properties that have number values.
     * @param {Object} vector2 A object with properties that have number values.
     * @return {Number} The result of the MD function.
     * @method MD
     * @private
     */
    self.MD = function(vector1, vector2) {
        var sum = 0;
        var keys = _.keys(vector1);
        for (var i = 0; i < keys.length; i++) {
            if (!contains(keys[i])) {
                sum += Math.pow(Math.abs(vector1[keys[i]] - vector2[keys[i]]), p);
            }
        }
        if (p == 1)
            return sum;
        else
            return Math.sqrt(sum);
    }

    /**
     * Checks if a given property name is in the filter list.
     * @param {String} name The property name.
     * @return {Boolean} True iff the name is in the list, false otherwise.
     * @method contains
     * @private
     */
    var contains = function(name) {
        for (var i = 0; i < filters.length; i++) {
            if (name === filters[i])
                return true;
        }
        return false;
    }

    /**
     * Starting point of the NN algoritme
     * @method run
     */
    self.run = function() {
        for (var vbatch = vFactory.getNextBatch(); vbatch.length > 0; vbatch = vFactory.getNextBatch()) {
            for (var vrow = vbatch.pop(); vrow !== undefined; vrow = vbatch.pop()) {
                self.classify(vrow);
            }
        }
    }

    /**
     * Classifies a vector.
     * @param {Number} vector.class The class in which it should be classified.
     * @param {Object} vector A object with properties that have a number value.
     * @method classify
     * @private
     */
    self.classify = function(vector) {
        var distances = [];
        for (var i = 0; i < memory.length; i++) {
            var distance = self.MD(vector, memory[i]);
            self.processDistance(distances, distance, memory[i].class);
        }
        self.processResult(distances, vector);
    }

    /**
     * Retaines all the training data in the memory.
     * Should be calle before Run.
     * @method init
     * @private
     */
    self.init = function() {
        for (var batch = tFactory.getNextBatch(); batch.length > 0; batch = tFactory.getNextBatch()) {
            for (var row = batch.pop(); row !== undefined; row = batch.pop()) {
                memory.push(row);
            }
        }
    }

    /**
     * Process the result of the classification for a vector.
     * If it's misclassified, self.mismatch will be incremented.
     * @param {Array} distances The k nearest distances.
     * @param {Object} vector The vector object.
     * @method processResult
     * @private
     */
    self.processResult = function(distances, vector) {
        var sum = 0;
        for (var i = 0; i < distances.length; i++) {
            sum += distances[i].classType;
        }
        var result = (sum > k / 2) ? 1 : 0;
        self.mismatch += (result === vector.class) ? 0 : 1
    }

    /**
     * Adds a distance the list of k-distances iff the newDistance is lower than any of the already stored distances.
     * @param {Array} distances The k shortest distances.
     * @param {Number} newDistance The new founded distance.
     * @param {Number} classType To wich class this new distance belongs.
     * @method processDistdance
     * @private
     */
    self.processDistance = function(distances, newDistance, classType) {
        if (distances.length === k) {
            for (var i = 0; i < distances.length; i++) {
                if (distances[i].distance > newDistance) {
                    distances[i] = {
                        distance: newDistance,
                        classType: classType
                    }
                    return;
                }
            }
        } else {
            distances.push({
                distance: newDistance,
                classType: classType
            })
        }
    }

    return self;
}

module.exports = NN
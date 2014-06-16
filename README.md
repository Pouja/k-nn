## Intro
This project is started as assignment of TU Delft to implement a data mining algoritme and use it on a real data set.
Reason for chosing Node as programming envorinmnent were:
 1. Most experienced with Node and JavaScript
 2. Quick prototyping and testing
 3. No one has made an id3 implementation with Node and published it

Unfortuantly as the adventure started with implementing id3 some problems were encountered.
 1. Hard memory limit of Node at 1.4gb
 2. Not fast enough

So for practical use, this solution will run perfectly and well for anything below 10000 records.
Otherwise you will have to run this for a long time (1hours +).

## Database
Under \common you will find the database class which can easily be replaced with mysql/postgresql solution. The current implementation uses ODBC bindings

## Config File
Under \config you will the config file with already a given connection string for using ODBC.
Furthermore you will find there other data that can be given.
 * table: the name of the table where all the data is stored
 * createStartId/createEndId: range of data that is allowed to be used for training the k-NN
 * testStartId/testEndId: range of data that is allowed to be used for testing the k-NN
 * bulk: maximum amount of records that is allowed to be fetched in 1 query.
 * stopCriteria: the amount of records that a node can have to become a leaf node.

## Debug
Debug module is used, see [link](https://github.com/visionmedia/debug) 

## Install
Run `npm install`

## Running
Run `DEUBG=* node knn/app.js k p`
Where k is the number of closest points that should be used to classify an entry. And p is the value for the Minoswki Distance function.
Only p=0,1,2 can be used.
In the console it will output the number of mismatches.

license
-------

Copyright (c) 2014 Pouja Nikray <p.nikray@student.tudelft.nl>

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

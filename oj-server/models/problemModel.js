const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    id: Number,
    name: String,
    desc: String,
    difficulty: String,
});

const ProblemModel = mongoose.model('ProblemModel', problemSchema);
/* todo:
var schema = new mongoose.Schema({ name: 'string', size: 'string' });
var Tank = mongoose.model('Tank', schema);
The first argument is the singular name of the collection your model is for.
Mongoose automatically looks for the plural version of your model name. Thus,
for the example above, the model Tank is for the tanks collection in the database.
因为我们在mongoDB里的colaction叫做problemmodels, 所以传进去ProblemModel 对应=> problemmodels
*/
module.exports = ProblemModel;
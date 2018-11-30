const {schema} = require('../lib').factory;
const path = require("path");
console.log(schema);
module.exports = function() {
    const foobar = new schema.PgModelSchema({
        connUrl: 'foobar'
    });

    foobar.models.import(path.join(__dirname, 'MyModel.js'));
    console.log('--->', foobar.models.cls);
}
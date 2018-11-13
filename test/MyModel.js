const {
    AbstractModel,
    fields,
} = require('../lib').model;
const { 
    DateField,
    BooleanField,
    DateTimeField,
    IntegerField,
    NumericField,
    StringField
 } = fields;
class MyModel extends AbstractModel {
    static tableName() {
        return 'tchumba'
    }
    def() {
        this.id = new IntegerField('id', {isPk: true})
        this.str = new StringField('str')
    }
    
}
module.exports = MyModel;
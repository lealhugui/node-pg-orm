const {
    AbstractModel,
    fields,
} = require('../lib').model;
const { 
    DateField,
    BooleanField,
    DateTimeField,
    SerialField,
    IntegerField,
    NumericField,
    StringField
 } = fields;

class ProxyConn {
    query(sql, params) {
        console.log('sql: ', sql, params);
        return {
            rows: [{id: 1, str: 'FooBarBaz'}],
            rowCount: 1
        }
    }
}

class MyModel extends AbstractModel {
    static tableName() {
        return 'tchumba'
    }
    def() {
        this.id = new SerialField('id', {isPk: true})
        this.idOld = new IntegerField('idOld', {isPk: true})
        this.str = new StringField('str');
        this.dt = new DateField('dt');
    }
    
}

module.exports = function() {
    const mdl = new MyModel(new ProxyConn());
    const valStr = 'My Value is Foobar';
    mdl.str.setValue(valStr);
    console.log("str.asStr", valStr === mdl.str.getValue())
    
    try {
        mdl.str.setValue(2)
    } catch(err) {
        console.log('str.asNum', false)
    }

    mdl.dt.setValue(new Date());
    
    MyModel.getByPk(new ProxyConn(), {id: 1}).then(otherMdlInstance => {
        otherMdlInstance.resetConnClient(new ProxyConn())
        otherMdlInstance.save();
        otherMdlInstance.create();
    }).catch(err => console.error(err));
    
}



import * as _ from 'lodash';

export default class PgModelSchema {
    constructor(options={}) {
        this._dbOptions = options;
        this._modelSet = null;
    }

    get models() {
        return this._modelSet;
    }

    _validateConnSettings(settings={}) {
        const toValidate = this._dbOptions || settings;
        if(!_.get(toValidate, 'connUrl', null)) {
            
            const result = [];

            if(!_.get(toValidate, 'server', null)) {
                result.append('Server');
            }
            if(!_.get(toValidate, 'database', null)) {
                result.append('Database');
            }
            if(!_.get(toValidate, 'user', null)) {
                result.append('User');
            }
            if(!_.get(toValidate, 'pass', null)) {
                result.append('Pass');
            }

            if(result.length > 0) {
                throw new Error(`Invalid ${result.join(', ')}`);
            }
        }
    }


}

class ModelSet {
    constructor() {
        this._modelSet = {}
    }

    import(path, attrInModule=null) {
        const mdl = require(path);
        if (attrInModule) {
            this._modelSet[attrInModule] = mdl[attrInModule];
        } else {
            const pathSplited = path.split('/');
            let modelName = pathSplited[pathSplited.length-1];
            modelName = modelName.replace('.js', '');
            modelName = modelName.replace('.ts', '');
            this._modelSet[modelName] = mdl;
        }
    }
}
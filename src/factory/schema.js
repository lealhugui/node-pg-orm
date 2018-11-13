
import * as _ from 'lodash';
import { Pool } from 'pg';

export class PgModelSchema {
    constructor(options={}) {
        this._dbOptions = options;
        this._modelSet = null;

        this._validateConnSettings();
    }

    get models() {
        if(!this._modelSet) {
            this._modelSet = new ModelSet();
        }
        return this._modelSet;
    }

    _validateConnSettings(settings=null) {
        const toValidate =  settings || this._dbOptions;
        if(!_.get(toValidate, 'connUrl', null)) {
            
            const result = [];

            if(!_.get(toValidate, 'host', null)) {
                result.push('Host');
            }
            if(!_.get(toValidate, 'database', null)) {
                result.push('Database');
            }
            if(!_.get(toValidate, 'user', null)) {
                result.push('User');
            }
            if(!_.get(toValidate, 'pass', null)) {
                result.push('Pass');
            }

            if(result.length > 0) {
                throw new Error(`Invalid ${result.join(', ')}`);
            }
        }
    }

    get dbOpt() {
        return this._dbOptions;
    }

    set dbOpt(obj) {
        if(this.conn) {
            throw new Exception('Conn already initialized');
        }
        
        this._dbOptions = {
            ...this._dbOptions,
            ...obj
        }
    }

    get conn() {
        if(!this._pg) {
            this._pg = new Pool(this._dbOptions);
        }
    }

}

class ModelSet {
    constructor() {
        this._classes = {}
    }

    import(path, attrInModule=null) {
        const mdl = require(path);
        let mdlName = null; 
        if (attrInModule) {
            mdlName = attrInModule;
            this._classes[mdlName] = mdl[attrInModule];
        } else {
            const pathSplited = path.split('/');
            mdlName = pathSplited[pathSplited.length-1];
            mdlName = mdlName.replace('.js', '');
            mdlName = mdlName.replace('.ts', '');
            this._classes[mdlName] = mdl;
        }

        return this._classes[mdlName];
    }

    get cls() {
        return this._classes;
    }

    
}
import {sep as pathSep} from 'path'
import * as _ from 'lodash';
import { Pool } from 'pg';
import { AbstractModel } from '../model';

export class PgModelSchema {
    _dbOptions: any
    _pg?: Pool | null
    _modelSet?: ModelSet | null

    constructor(options={}) {
        this._dbOptions = options
        this._modelSet = null

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
            throw new Error('Conn already initialized');
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
        return this._pg;
    }

}

class ModelSet {
    _classes: any
    constructor() {
        this._classes = {}
    }

    import(path: string, attrInModule: any=null) {
        const mdl = require(path);
        let modelCandidate = null;
        let mdlName = null; 
        if (attrInModule) {
            mdlName = attrInModule;
            modelCandidate = mdl[attrInModule];
        } else {
            const pathSplited = path.split(pathSep);
            mdlName = pathSplited[pathSplited.length-1];
            mdlName = mdlName.replace('.js', '');
            mdlName = mdlName.replace('.ts', '');
            modelCandidate = mdl;
        }
        if(modelCandidate && (modelCandidate.prototype instanceof AbstractModel)) {            

            this._classes[mdlName] = modelCandidate;
        } else {
            throw new Error("Module does not contain a model");
        }
        return this._classes[mdlName];
    }

    get cls() {
        return this._classes;
    }

    
}
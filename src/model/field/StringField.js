'use strict';
import { ValueError } from '../../errors'
import { AbstractField } from './AbstractField'

export class StringField extends AbstractField {
    
    /**
     * 
     * @param {colName:string, typeOptions?: Object} options 
     */
    constructor(colName, options={}) {
        super()
        if(Object.hasOwnProperty('colType')){
            delete options.colType;
        }
        if(Object.hasOwnProperty('colName')){
            delete options.colName;
        }
        this._init(Object.assign(
            {colName: colName, colType: 'varchar'}, options
        ))
    }

    getValue() {
        if(!super.getValue()) return null;
        return super.getValue().toString()
    }
    _beforeSetHook(v) {
        
        if (typeof(v) !== 'string') {
            throw new ValueError()
        }
        return v.toString()
    }

}
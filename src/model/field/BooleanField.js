'use strict';
import { ValueError } from '../../errors'
import { AbstractField } from './AbstractField'

export class BooleanField extends AbstractField {
    
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
            {colName: colName, colType: 'boolean'}, options
        ));
    }
    _beforeSetHook(v) {
        if (typeof(v) !== 'boolean') {
            throw new ValueError(`Err: ${this.colName}`)
        }
        return v;
    }

}
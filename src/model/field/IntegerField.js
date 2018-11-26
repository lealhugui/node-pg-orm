'use strict';
import { ValueError } from '../../errors'
import { AbstractField } from './AbstractField'

export class IntegerField extends AbstractField {
    
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
            {colName: colName, colType: 'int'}, options
        ));
    }
    _beforeSetHook(v) {
        console.log(v)
        if (typeof(v) !== 'number') {
            throw new ValueError(`Err: ${this.colName}`)
        }
        return v;
    }

}
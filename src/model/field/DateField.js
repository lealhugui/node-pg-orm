'use strict';
import { ValueError } from '../../errors'
import moment from 'moment'
import { AbstractField } from './AbstractField'

export class DateField extends AbstractField {
    
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
            {colName: colName, colType: 'date'}, options
        ));        
    }
    _beforeSetHook(v) {
        if(v) {
            if (!moment(v).isValid()) {
                throw new ValueError(`Err: ${this.colName}`)
            }
        }
        return v;
    }

}
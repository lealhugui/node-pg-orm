'use strict'
import * as _ from 'lodash'
import { debug, debugFields } from '../../util'
import { ValueError } from '../../errors'

export class AbstractField {

    /**
     * 
     * @param {colName:string, colType:string, typeOptions?: Object} options 
     */
    constructor(options={}) {
        if(_.isEmpty(options)) {
            return;
        }
        this._init(options)
    }

    _init(options) {
        if(!options.hasOwnProperty('colName')) {
            throw new ValueError('Invalid Column Name')
        }
        this._column = {}
        this._column.name = _.get(options, 'colName')


        if(!options.hasOwnProperty('colType')) {
            throw new ValueError('Invalid Column Type')
        }

        this._column.isPk = _.get(options, 'isPk', false);

        this._setColType(options.colType, options.typeOptions)
        debugFields(this._column);
    }

    _setColType(colType, options={}) {
        this._column.type = colType;
        this._column.typeOptions = options
    }

    get colName(){
        return _.get(this, '_column.name');
    }
    get innerType() {
        return Object.assign({}, {
            name: _.get(this, '_column.type'),
            options: _.get(this, '_column.typeOptions')
        });
    }
    get isPk() {
        return _.get(this._column, 'isPk', false);
    }
    
    getValue() {
        return this._val
    }
    
    _beforeSetHook(v) { return v }
    setValue(v) {
        v = this._beforeSetHook(v)
        this._val = v
        this._afterSetHook(this._val)
    }
    _afterSetHook(v) { }

    
}
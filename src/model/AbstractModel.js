'use strict'
import * as _ from 'lodash'
import { NotImplementedError } from '../errors';
import  * as dbFields from './field';
import { ValueError } from '../../lib/errors';

export class AbstractModel {

    constructor(connClient = null) {
        this._connOperator = connClient;
        this.def();
    }

    resertConnClient(cli) {
        this._connOperator = cli;
    }

    def() {
        throw new NotImplementedError();
    }

    static tableName() {
        throw new NotImplementedError();
    }

    get fields() {
        const result = []
        const props = Object.getOwnPropertyNames(this);
        for(const p of props) {
            if(this[p] instanceof dbFields.AbstractField) {
                result.push(this[p])
            }
        }
        return result;
    }

    get notPk() {
        return this.fields.filter(f => !f.isPk);
    }
    
    get pk() {
        return this.fields.filter(f => f.isPk);
    }

    get isNewRecord() {
        for(const f of this.pk) {
            if(!f.getValue()) {
                return true;
            }
        }
        return false;
    }

    _parseSqlOpt(ignoreWhere = false) {
        const fieldsThatUpdate = []
        const fieldsWhere = []
        const fieldNames = []
        const values = [] 
        let i = 1

        if(ignoreWhere) {
            for(const fld of this.fields) {
                fieldsThatUpdate.push(`${fld.colName} = $${i}`)
                fieldNames.push(fld.colName)
                values.push(fld.getValue())
                i++
            }
        } else {
            
            for(const fld of this.notPk) {
                fieldsThatUpdate.push(`${fld.colName} = $${i}`)
                values.push(fld.getValue())
                i++
            }
    
            for(const fld of this.pk) {
                fieldsWhere.push(`${fld.colName} = $${i}`)
                values.push(fld.getValue())
                i++
            }
        }

        return {
            fieldsThatUpdate: fieldsThatUpdate,
            fieldsWhere: fieldsWhere,
            fieldNames: fieldNames,
            values: values
        }

        
    }

    _genSqlUpdate() {
        const {
            fieldsThatUpdate,
            fieldsWhere,
            values
        } = this._parseSqlOpt();

        const sql =
            `update ${this.constructor.tableName()} set ${fieldsThatUpdate.join(', ')} ` +
            ` where ${fieldsWhere.join(' AND ')} returning * ;`;

        return {
            sql: sql,
            params: values
        }
    }
    _genSqlInsert() {
        const {
            fieldNames,
            values
        } = this._parseSqlOpt(true);
        
        const interpolations = []
        for(const f in fieldNames) {
            
            interpolations.push(`$${Number(f)+1}`)
        }
        console.log(fieldNames)
        console.log(interpolations)
        const sql =
            `insert into ${this.constructor.tableName()} (${fieldNames.join(', ')}) ` +
            ` values(${interpolations.join(', ')}) returning * ;`;

        return {
            sql: sql,
            params: values
        }
    }

    saveOrCreate() {
        if(this.isNewRecord) {
            return this.create()
        } else {
            return this.save()
        }
    }

    save() {
        const {sql, params} = this._genSqlUpdate()
        return this._connOperator.query(
            sql, params
        )
    }

    create() {
        const {sql, params} = this._genSqlInsert()
        return this._connOperator.query(
            sql, params
        )
    }

    hidrate(dataValues) {
        for(const f of this.fields) {
            f.setValue(
                _.get(dataValues, f.colName, null)
            )
        }
    }

    static getList(conn, sql, params=null, shouldHidrate=false) {
        const rows = conn.query(sql, params)
        if(rows && shouldHidrate) {
            const result = rows.map((r) => {
                const mdl = new this();
                mdl.hidrate(r);
                return mdl
            });
            return result
        } else {
            return rows;
        }
    }

    static getByPk(conn, wherePkObj) {
        if(_.isEmpty(wherePkObj)) {
            throw new ValueError()
        }
        const whereArr = [];
        const params = [];
        let i = 1;
        for(const prop of Object.getOwnPropertyNames(wherePkObj)) {
            whereArr.push(`${prop} = $${i}`)
            params.push(wherePkObj[prop])
            i++
        }
        const sql =
            `select * from ${this.tableName()} where ${whereArr.join(' AND ')}`
        const rows = conn.query(sql, params)
        
        if(rows && rows.length > 0) {
            const result = new this()
            result.hidrate(rows[0])
            return result
        } else {
            return null;
        }
    }

}
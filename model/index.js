'use strict'
import {AbstractFieild} from './field';

export default class AbstractModel {
    get fields() {
        const result = [];
        const props = Object.getOwnPropertyNames(this);
        for(const p of props) {
            if(this[p] instanceof AbstractFieild) {
                result.push(this[p]);
            }
        }
    }

}
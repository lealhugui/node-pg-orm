'use strict';
import { IntegerField } from './IntegerField'

export class SerialField extends IntegerField {
    constructor(colName: string, options: any={}) {
        super(colName, {...options, ignoreIfNull: true})
    }
}
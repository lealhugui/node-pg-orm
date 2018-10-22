import {NotImplementedError} from '../../errors'

export class AbstractField {
    get colName(){
        throw new NotImplementedError()
    }
    get innerType() {
        throw new NotImplementedError()
    }
    
    
    getValue() {
        return this._val;
    }
    _beforeSetHook(v) { return v; }
    setValue(v) {
        v = this._beforeSetHook(v);
        this._val = v;
        this._afterSetHook(this._val);
    }
    _afterSetHook(v) { }
}
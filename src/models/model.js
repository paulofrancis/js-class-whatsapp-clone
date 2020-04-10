import {
    ClassEvents
} from "../util/classEvents";

export class Model extends ClassEvents {

    constructor() {
        super();

        this._data = {};
    }

    fromJSON(json) {
        this._data = Object.assign(this._data, json);
        this.trigger('datachange', this.toJSON());
    }

    toJSON() {
        return this._data;
    }
}
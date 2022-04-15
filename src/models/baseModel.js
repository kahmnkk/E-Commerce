class BaseModel {
    constructor() {}

    merge(obj) {
        for (let k in obj) {
            if (this.hasOwnProperty(k) == true) {
                this[k] = obj[k];
            }
        }
        return this;
    }
}

module.exports = BaseModel;

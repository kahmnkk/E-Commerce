// Model
const BaseModel = require('@src/models/baseModel');

class CustomerModel extends BaseModel {
    constructor() {
        super();

        this.id = null;
        this.store = null;
        this.name = null;
        this.email = null;
        this.password = null;
        this.custom = null; // [ { key, value }, ... ]
    }
}

module.exports = CustomerModel;

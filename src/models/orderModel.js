// Model
const BaseModel = require('@src/models/baseModel');

class OrderModel extends BaseModel {
    constructor() {
        super();

        this.id = null;
        this.store = null;
        this.status = null;
        this.customer = null;
        this.products = null;
        this.price = null;
        this.custom = null; // [ { key, value }, ... ]
    }
}

module.exports = OrderModel;

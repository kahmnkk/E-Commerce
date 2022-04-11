// Model
const BaseModel = require('@src/models/baseModel');

class ProductModel extends BaseModel {
    constructor() {
        super();

        this.id = null;
        this.store = null;
        this.name = null;
        this.price = null;
        this.categories = null;
        this.custom = null; // [ { key: ${key}, value: ${value} }, ... ]
    }
}

module.exports = ProductModel;

// Model
const BaseModel = require('@src/models/baseModel');

class StoreModel extends BaseModel {
    constructor() {
        super();

        this.id = null;
        this.name = null;
    }
}

module.exports = StoreModel;

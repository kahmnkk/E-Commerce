// Model
const BaseModel = require('@src/models/baseModel');

class StoreModel extends BaseModel {
    constructor() {
        super();

        this.id = null;
        this.name = null;
        this.custom = null;
    }
}

module.exports = StoreModel;

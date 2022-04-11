// Model
const BaseModel = require('@src/models/baseModel');

class StoreModel extends BaseModel {
    constructor() {
        super();

        this.id = null;
        this.name = null;
        this.custom = null; // { ${ModelName}: Array<String>, ... } { CUSTOMER: ['전화번호', '성별'], PRODUCT: ['도서 발행일', '유통기한'], ... }
    }
}

module.exports = StoreModel;

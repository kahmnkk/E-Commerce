const query = {
    commerce: {
        // tb_commerce_store
        selectStore: 'SELECT id, name FROM tb_commerce_store WHERE id = ?',
        insertStore: 'INSERT INTO tb_commerce_store (id, name) VALUES (?, ?)',
        updateStore: 'UPDATE tb_commerce_store SET name = ? WHERE id = ?',

        // tb_commerce_customer
        selectCustomer: 'SELECT id, store, name, email, password, custom FROM tb_commerce_customer WHERE store = ? AND email = ?',
        insertCustomer: 'INSERT INTO tb_commerce_customer (id, store, name, email, password, custom) VALUES (?, ?, ?, ?, ?, ?)',

        // tb_commerce_product
        selectProduct: 'SELECT id, store, name, price, categories, custom FROM tb_commerce_product WHERE id = ?',
        selectProductByStore: 'SELECT id, store, name, price, categories, custom FROM tb_commerce_product WHERE store = ?',
        insertProduct: 'INSERT INTO tb_commerce_product (id, store, name, price, categories, custom) VALUES (?, ?, ?, ?, ?, ?)',
        updateProduct: 'UPDATE tb_commerce_product SET name = ?, price = ?, categories = ?, custom = ? WHERE id = ?',
    },
};

module.exports = query;

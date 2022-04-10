const query = {
    commerce: {
        // tb_commerce_customer
        selectCustomer: 'SELECT id, store, name, email, password FROM tb_commerce_customer WHERE store = ? AND email = ?',
        insertCustomer: 'INSERT INTO tb_commerce_customer (id, store, name, email, password) VALUES (?, ?, ?, ?, ?)',

        // tb_commerce_store
        selectStore: 'SELECT id, name, custom FROM tb_commerce_store WHERE id = ?',
        insertStore: 'INSERT INTO tb_commerce_store (id, name, custom) VALUES (?, ?, ?)',
    },
};

module.exports = query;

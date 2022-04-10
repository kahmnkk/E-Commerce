const query = {
    commerce: {
        // tb_commerce_customer
        selectCustomer: 'SELECT id, store, name, email, password FROM tb_commerce_customer WHERE store = ? AND email = ?',
        insertCustomer: 'INSERT INTO tb_commerce_customer (id, store, name, email, password) VALUES (?, ?, ?, ?, ?)',
    },
};

module.exports = query;

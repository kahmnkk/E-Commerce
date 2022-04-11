const query = {
    commerce: {
        // tb_commerce_store
        selectStore: 'SELECT id, name FROM tb_commerce_store WHERE id = ?',
        insertStore: 'INSERT INTO tb_commerce_store (id, name, custom) VALUES (?, ?, ?)',
        updateStore: 'UPDATE tb_commerce_store SET name = ?, custom = ? WHERE id = ?',

        // tb_commerce_customer
        selectCustomer: 'SELECT id, store, name, email, password, custom FROM tb_commerce_customer WHERE store = ? AND email = ?',
        selectCustomerById: 'SELECT id, store, name, email, password, custom FROM tb_commerce_customer WHERE id = ?',
        insertCustomer: 'INSERT INTO tb_commerce_customer (id, store, name, email, password, custom) VALUES (?, ?, ?, ?, ?, ?)',

        // tb_commerce_product
        selectProduct: 'SELECT id, store, name, price, categories, custom FROM tb_commerce_product WHERE id = ?',
        selectProducts: 'SELECT id, store, name, price, categories, custom FROM tb_commerce_product WHERE id IN (?)',
        selectProductByStore: 'SELECT id, store, name, price, categories, custom FROM tb_commerce_product WHERE store = ?',
        insertProduct: 'INSERT INTO tb_commerce_product (id, store, name, price, categories, custom) VALUES (?, ?, ?, ?, ?, ?)',
        updateProduct: 'UPDATE tb_commerce_product SET name = ?, price = ?, categories = ?, custom = ? WHERE id = ?',

        // tb_commerce_order
        selectOrder: 'SELECT id, store, status, customer, products, price, custom FROM tb_commerce_order WHERE id = ?',
        selectOrderByCustomer: 'SELECT id, store, status, customer, products, price, custom FROM tb_commerce_order WHERE customer = ?',
        insertOrder: 'INSERT INTO tb_commerce_order (id, store, status, customer, products, price, custom) VALUES (?, ?, ?, ?, ?, ?, ?)',
        updateOrderStatus: 'UPDATE tb_commerce_order SET status = ? WHERE id = ?',
    },
};

module.exports = query;

const config = {
    dev: true,
    baseUrl: '127.0.0.1',
    port: {
        express: 8080,
    },
    mysql: {
        commerce: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '1234',
            database: 'db_commerce',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true,
        },
    },
    redis: {
        sessionStore: {
            host: '127.0.0.1',
            port: 6379,
            db: 0,
        },
        gen: {
            host: '127.0.0.1',
            port: 6379,
            db: 0,
        },
        commerce: {
            host: '127.0.0.1',
            port: 6379,
            db: 0,
        },
    },
};

module.exports = config;

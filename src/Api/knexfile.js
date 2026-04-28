export const development = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'carserver',
    port: 3306,
    password: 'Car_dataServer2026!',
    database: 'carserverdb',
  }
};
export const staging = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'carserver',
    password: 'Car_dataServer2026!',
    database: 'carserverdb',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
export const production = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    database: 'carserverdb',
    user: 'carserver',
    password: 'Car_dataServer2026!'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};

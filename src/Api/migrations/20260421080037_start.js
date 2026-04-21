const user = 'user'
const car = 'car'
const profile = 'profile'
exports.up = async (knex) => {
    knex.schema.hasTable(user).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(user, function (t) {
                t.string(user + '_id', 15).primary().notNullable();
                t.string('email', 150).notNullable();
                t.string('userpassword', 100).notNullable();
                t.string('username', 100).notNullable();
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
                t.unique('email');
                t.unique('username');
                t.number('counter').defaultTo(1);
            }).then(() => console.log(user + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
    return knex.schema.hasTable(profile).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(profile, function (t) {
                t.increments('id').primary();
                t.string(user + '_id', 15).references(user + '_id').inTable(user).notNullable().onDelete('CASCADE').index();
                t.string('name', 150);
                t.string('avatar', 150);
            }).then(() => console.log(profile + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
};

exports.down = async (knex) => {
    return knex.schema
        .dropTableIfExists(profile)
        .dropTableIfExists(user);
};

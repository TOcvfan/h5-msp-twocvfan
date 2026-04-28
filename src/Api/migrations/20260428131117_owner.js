const owner = 'owner'
const car = 'car'
export function up(knex) {
    return knex.schema.hasTable(owner).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(owner, function (t) {
                t.string(owner + '_id', 36).primary().notNullable();
                t.string(car + '_id', 36).references(car + '_id').inTable(car).notNullable().onDelete('CASCADE').index();
                t.string('name', 100).notNullable();//ejerens navn
                t.string('phone', 20).notNullable();//ejerens telefonnummer
                t.string('email', 100).notNullable();//ejerens email
                t.string('address', 255).notNullable();//ejerens adresse
                t.integer('zipcode', 5).notNullable();//ejerens postnummer
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            }).then(() => console.log(owner + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
}

export function down(knex) {
    return knex.schema
        .dropTableIfExists(owner);
}

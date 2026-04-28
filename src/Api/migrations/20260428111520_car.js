const car = 'car'
const user = 'user'
const owner = 'owner'
export function up(knex) {
    return knex.schema.hasTable(car).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(car, function (t) {
                t.string(car + '_id', 36).primary().notNullable();
                t.string(user + '_id', 36).references(user + '_id').inTable(user).notNullable().onDelete('CASCADE').index();
                t.string(owner + '_id', 36).references(owner + '_id').inTable(owner).onDelete('CASCADE').index();
                t.string('brand', 100).notNullable();//mærke
                t.string('model', 100).notNullable();//model
                t.integer('year').notNullable();//årgang
                t.string('color', 50);//farve
                t.string('license_plate', 7).unique().notNullable();
                t.string('vin', 25).unique().notNullable();//stelnummer
                t.integer('mileage').notNullable();
                t.string('carnickname', 100);//bilens kælenavn
                t.string('image', 255);//billede af bilen
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            }).then(() => console.log(car + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
}

export function down(knex) {
    return knex.schema
        .dropTableIfExists(car);
}

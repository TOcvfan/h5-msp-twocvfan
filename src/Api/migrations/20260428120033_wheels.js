const wheels = 'wheels'
const car = 'car'
export function up(knex) {
    return knex.schema.hasTable(wheels).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(wheels, function (t) {
                t.string(wheels + '_id', 36).primary().notNullable();
                t.string(car + '_id', 36).references(car + '_id').inTable(car).notNullable().onDelete('CASCADE').index();
                t.string('type', 100).notNullable();//type (f.eks. stål, aluminium, legering)
                t.float('size').notNullable();//størrelse i tommer
                t.string('bolt_pattern', 50).notNullable();//bolt mønster (f.eks. 5x114.3)
                t.string('offset', 50).notNullable();//offset i mm (ET)
                t.string('center_bore', 50).notNullable();//center bore i mm
                t.string('load_rating', 50).notNullable();//load rating i kg
                t.string('tire_size', 50).notNullable();//dæk størrelse (f.eks. 225/45R17)
                t.string('tire_type', 50).notNullable();//dæk type (f.eks. sommer, vinter, helår)
                t.string('tire_brand', 50).notNullable();//dæk mærke
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            }).then(() => console.log(wheels + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
}

export function down(knex) {
    return knex.schema
        .dropTableIfExists(wheels);
}

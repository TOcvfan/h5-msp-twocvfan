const brakes = 'brakes'
const car = 'car'
export function up(knex) {
    return knex.schema.hasTable(brakes).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(brakes, function (t) {
                t.string(brakes + '_id', 36).primary().notNullable();
                t.string(car + '_id', 36).references(car + '_id').inTable(car).notNullable().onDelete('CASCADE').index();
                t.string('type', 100).notNullable();//type (f.eks. skivebremser, tromlebremser)
                t.string('material', 50).notNullable();//materiale (f.eks. keramiske, metal)
                t.float('diameter').notNullable();//diameter i mm
                t.string('position', 50).notNullable();//position (f.eks. for, bag)
                t.string('pad_thickness', 50).notNullable();//bremseklods tykkelse i mm
                t.string('rotor_thickness', 50).notNullable();//bremse skive tykkelse i mm
                t.string('caliper_type', 50).notNullable();//kaliber type (f.eks. fast, flydende)
                t.string('caliper_material', 50).notNullable();//kaliber materiale (f.eks. aluminium, stål)
                t.string('brake_fluid_type', 50).notNullable();//bremsevæske type (f.eks. DOT 3, DOT 4)
                t.string('brake_fluid_change_interval', 50).notNullable();//bremsevæske skift interval
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            }).then(() => console.log(brakes + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
}

export function down(knex) {
    return knex.schema
        .dropTableIfExists(brakes);
}

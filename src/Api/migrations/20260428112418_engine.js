const engine = 'engine'
const car = 'car'
export function up(knex) {
    return knex.schema.hasTable(engine).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(engine, function (t) {
                t.string(engine + '_id', 36).primary().notNullable();
                t.string(car + '_id', 36).references(car + '_id').inTable(car).notNullable().onDelete('CASCADE').index();
                t.string('type', 100).notNullable();//type (f.eks. benzin, diesel, el)
                t.integer('horsepower').notNullable();//hestekræfter
                t.string('fuel_type', 50).notNullable();//brændstoftype
                t.float('displacement').notNullable();//motorstørrelse i liter
                t.string('cylinders', 50).notNullable();//antal cylindre
                t.string('oil_type', 50).notNullable();//olietype (f.eks. syntetisk, mineral)
                t.string('coolant_type', 50).notNullable();//kølevæsketype (f.eks. ethylene glycol, propylene glycol)
                t.string('engine_code', 25).unique().notNullable();//motor kode
                t.string('oil_capacity', 50).notNullable();//olie kapacitet i liter
                t.string('coolant_capacity', 50).notNullable();//kølevæske kapacitet i liter
                t.string('spark_plug_type', 50).notNullable();//tændrørs type (f.eks. iridium, platinum)
                t.string('spark_plug_number', 10).notNullable();//tændrørs kode eller nummer
                t.string('air_filter_type', 50).notNullable();//luftfilter type (f.eks. papir, skum)
                t.string('oil_change_interval', 50).notNullable();//olie skift interval
                t.string('oil_filter_type', 50).notNullable();//oliefilter type (f.eks. indvendig, udvendig)
                // billede af remmene
                t.string('tandrembillede', 35);
                t.string('kile_riprembillede', 40);
                // billder af mærkerne
                t.string('maerkerknast', 33);
                t.string('maerkerkrumtap', 35);
                t.integer('timing_belt_teeth');//tænder på tandrem
                t.string('timing_belt_type', 50);//tandrem type (kæde, tandhjul, tandrem)
                t.float('head_gasket_thickness', 10, 2);//tykkelse af toppakning
                t.string('V_belt_type', 50);//kilerem type
                t.integer('V_belt_teeth');//tænder på kilerem
                t.integer('V_belt_length');//længde på kilerem
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            }).then(() => console.log(engine + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
}

export function down(knex) {
    return knex.schema
        .dropTableIfExists(engine);
}

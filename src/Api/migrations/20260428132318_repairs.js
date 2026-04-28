const repair = 'repair'
const car = 'car'
export function up(knex) {
    return knex.schema.hasTable(repair).then(function (exists) {
        if (!exists) {
            return knex.schema.createTable(repair, function (t) {
                t.string(repair + '_id', 36).primary().notNullable();
                t.string(car + '_id', 36).references(car + '_id').inTable(car).notNullable().onDelete('CASCADE').index();
                t.string('description', 255).notNullable();//beskrivelse af reparationen
                t.float('cost', 10, 2).notNullable();//omkostninger ved reparationen
                t.date('date').notNullable();//dato for reparationen
                t.string('garage', 100).notNullable();//værksted hvor reparationen blev udført
                t.integer('mileage').notNullable();//kilometerstand ved reparationen
                t.boolean('timing_belt_replacement').defaultTo(false);//om det var en tandrem eller ej
                t.boolean('brake_replacement').defaultTo(false);//om det var en bremseudskiftning eller ej
                t.boolean('oil_change').defaultTo(false);//om det var et olieskift eller ej
                t.boolean('tire_replacement').defaultTo(false);//om det var en dækudskiftning eller ej
                t.boolean('water_pump_replacement').defaultTo(false);//om det var en vandpumpeudskiftning eller ej
                t.boolean('clutch_replacement').defaultTo(false);//om det var en koblingsudskiftning eller ej
                t.boolean('suspension_repair').defaultTo(false);//om det var en affjedringsreparation eller ej
                t.boolean('battery_replacement').defaultTo(false);//om det var en batteriudskiftning eller ej
                t.boolean('syn_inspection').defaultTo(false);//om det var en synsinspektion eller ej
                t.string('other_parts', 255);//andre dele der blev udskiftet eller repareret
                t.timestamp('created_at').defaultTo(knex.fn.now());
                t.timestamp('updated_at').defaultTo(knex.fn.now());
            }).then(() => console.log(repair + ' tabel oprettet')).catch(err => console.log(err));
        }
    });
}

export function down(knex) {
    return knex.schema
        .dropTableIfExists(repair);
}

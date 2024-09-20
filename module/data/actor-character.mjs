import ironboundActorBase from "./base-actor.mjs";

export default class ironboundCharacter extends ironboundActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    schema.arcane = new fields.SchemaField({
      current: new fields.NumberField({...requiredInteger, initial: 2}),
      base: new fields.NumberField({...requiredInteger, initial: 2}),
      def: new fields.NumberField({initial: 0}),
    })

    schema.physical = new fields.SchemaField({
      current: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      base: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      def: new fields.NumberField({ initial: 0 }),
    });

    schema.mental = new fields.SchemaField({
      current: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      base: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      def: new fields.NumberField({  initial: 0 }),
    });

    schema.health = new fields.SchemaField({
      current: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      base: new fields.NumberField({ ...requiredInteger, initial: 2 })
    });    

    schema.actionPoints = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
    });

    schema.markofdoom = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
    });

    schema.powerDice =  new fields.SchemaField({
      "1D4": new fields.StringField({initial: "1D4"}),
      "1D6": new fields.StringField({initial: "1D6"}),
      "1D6+3": new fields.StringField({initial: "1D6+3"}),
      "1D8": new fields.StringField({initial: "1D8"}),
      "1D10": new fields.StringField({initial: "1D10"}),
      "1D12": new fields.StringField({initial: "1D12"}),
      "1D12+3": new fields.StringField({initial: "1D12+3"}),
      "1D12+6": new fields.StringField({initial: "1D12+6"}),
    })

    schema.healthDice = new fields.SchemaField({
      "1D4": new fields.StringField({ initial: "1D4" }),
      "1D6": new fields.StringField({ initial: "1D6" }),
      "1D6+3": new fields.StringField({ initial: "1D6+3" }),
      "1D8": new fields.StringField({ initial: "1D8" }),
      "1D10": new fields.StringField({ initial: "1D10" }),
      "1D12": new fields.StringField({ initial: "1D12" }),
      "1D12+3": new fields.StringField({ initial: "1D12+3" }),
      "1D12+6": new fields.StringField({ initial: "1D12+6" }),
    });

    schema.healthDie = new fields.StringField({ initial: "1D4" });

    schema.powerDie = new fields.StringField({initial: "1D4"})

    schema.damageBonus = new fields.NumberField({
      ...requiredInteger,
      initial: 2,
    });

    schema.actionPoints = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
    });

    schema.actionPointsBase = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
    });

    schema.destinyDie = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
    });

    schema.destinyDieBase = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
    });

    schema.movement = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
    });

    schema.toHit = new fields.NumberField({
      ...requiredInteger,
      initial: 9,
    });
    schema.level = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
    });

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    // for (const key in this.abilities) {
    //   // Calculate the modifier using d20 rules.
    //   this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
    //   // Handle ability label localization.
    //   this.abilities[key].label = game.i18n.localize(CONFIG.IRONBOUND.abilities[key]) ?? key;
    // }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    // if (this.abilities) {
    //   for (let [k,v] of Object.entries(this.abilities)) {
    //     data[k] = foundry.utils.deepClone(v);
    //   }
    // }

    // data.lvl = this.attributes.level.value;

    return data
  }
}
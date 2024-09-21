import ironboundActorBase from "./base-actor.mjs";

export default class ironboundNPC extends ironboundActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.cr = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 });
    schema.xp = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.weakness = new fields.StringField({ initial: "Weakness" });
    schema.resistance = new fields.StringField({ initial: "Resistance" });
    schema.health = new fields.SchemaField({
      current: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      base: new fields.NumberField({ ...requiredInteger, initial: 2 }),
    });

    schema.power = new fields.SchemaField({
      current: new fields.NumberField({ ...requiredInteger, initial: 2 }),
      base: new fields.NumberField({ ...requiredInteger, initial: 2 }),
    });

    schema.actionPoints = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
    });
    
    schema.damageBonus = new fields.NumberField({
      initial: 2,
    });

    schema.damageReduction = new fields.NumberField({
      initial: 2,
    });

    schema.powerDie = new fields.StringField({ initial: "1D4" });

    schema.powerDice = new fields.SchemaField({
      "1D4": new fields.StringField({ initial: "1D4" }),
      "1D6": new fields.StringField({ initial: "1D6" }),
      "1D6+3": new fields.StringField({ initial: "1D6+3" }),
      "1D8": new fields.StringField({ initial: "1D8" }),
      "1D10": new fields.StringField({ initial: "1D10" }),
      "1D12": new fields.StringField({ initial: "1D12" }),
      "1D12+3": new fields.StringField({ initial: "1D12+3" }),
      "1D12+6": new fields.StringField({ initial: "1D12+6" }),
    });

    schema.tn = new fields.NumberField({
      ...requiredInteger,
      initial: 9,
      min: 0,
    });

    schema.movement = new fields.NumberField({
      ...requiredInteger,
      initial: 3,
      min: 0,
    });

    
    return schema
  }

  prepareDerivedData() {
    this.xp = this.cr * this.cr * 100;
  }
}
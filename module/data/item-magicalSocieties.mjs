import ironboundItemBase from "./base-item.mjs";

export default class ironboundMagicalSocieties extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.actionPoints = new fields.NumberField({
      required: true,
      integer: true,
      initial: 0,
    });

     schema.poolPointCost = new fields.NumberField({
       required: true,
       integer: true,
       initial: 0,
     });

    schema.heal = new fields.BooleanField();

    schema.formula = new fields.StringField({
      blank: true,
    });

    schema.healFormula = new fields.StringField({
      blank: true,
    });

    return schema;
  }
}
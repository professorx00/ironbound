import ironboundItemBase from "./base-item.mjs";

export default class ironboundWeapons extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.heal = new fields.BooleanField();

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

    schema.formula = new fields.StringField({
      blank: true,
    });

    schema.healFormula = new fields.StringField({
      blank: true,
    });
    return schema;
  }
}

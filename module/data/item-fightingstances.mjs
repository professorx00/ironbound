import ironboundItemBase from "./base-item.mjs";

export default class ironboundFightingStances extends ironboundItemBase {
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

    schema.activated = new fields.BooleanField();

    return schema;
  }
}
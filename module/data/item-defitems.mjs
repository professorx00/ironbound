import ironboundItemBase from "./base-item.mjs";

export default class ironboundDefItems extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.bonus = new fields.NumberField({
      required: true,
      integer: true,
      min: 0,
      initial: 0,
    });

    schema.equipped = new fields.BooleanField();

    return schema;
  }
}
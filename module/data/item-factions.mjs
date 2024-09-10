import ironboundItemBase from "./base-item.mjs";

export default class ironboundFactions extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.relationship = new fields.NumberField({
      required: true,
      integer: true,
      initial: 0,
    });

    return schema;
  }
}
import ironboundItemBase from "./base-item.mjs";

export default class ironboundCharacterClass extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    return schema;
  }
}
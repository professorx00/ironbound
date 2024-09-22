import ironboundItemBase from "./base-item.mjs";

export default class ironboundVehicleEnhancements extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.heal = new fields.BooleanField();

    schema.healFormula = new fields.StringField({
      blank: true,
    });

    schema.equipped = new fields.BooleanField();

    schema.vehiclePoints = new fields.NumberField({
      required: true,
      integer: true,
      initial: 0,
    });

    schema.formula = new fields.StringField({
      blank: true,
    });

    return schema;
  }
}

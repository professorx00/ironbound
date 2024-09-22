import ironboundActorBase from "./base-actor.mjs";

export default class ironboundVehicle extends ironboundActorBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.vehiclePoints = new fields.NumberField({
      required: true,
      integer: true,
      initial: 0,
    });

    schema.armor = new fields.NumberField({
      required: true,
      integer: true,
      initial: 0,
    });

    schema.movement = new fields.NumberField({
      required: true,
      integer: true,
      initial: 0,
    });

    return schema;
  }

  prepareDerivedData() {}
}

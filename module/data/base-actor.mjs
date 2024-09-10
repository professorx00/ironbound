import ironboundDataModel from "./base-model.mjs";

export default class ironboundActorBase extends ironboundDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};
    
    schema.currentBoons = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
    });

    schema.rollBoost = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
    });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
    schema.gmnotes = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields

    return schema;
  }

}
import ironboundDataModel from "./base-model.mjs";

export default class ironboundItemBase extends ironboundDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });
    schema.pools = new fields.SchemaField({
      None: new fields.StringField({ initial: "None" }),
      Arcane: new fields.StringField({ initial: "Arcane" }),
      Physical: new fields.StringField({ initial: "Physical" }),
      Mental: new fields.StringField({ initial: "Mental" }),
    });
    schema.pool = new fields.StringField({ initial: "None" });
    schema.qty = new fields.NumberField({
      required: true,
      integer: true,
      min: 0,
      initial: 0,
    });
    schema.fav = new fields.BooleanField();
    schema.hasBoon = new fields.BooleanField();

    schema.weaponTypes = new fields.SchemaField({
      Slashing: new fields.StringField({ initial: "Slashing" }),
      Bludgeoning: new fields.StringField({ initial: "Bludgeoning" }),
      Piercing: new fields.StringField({ initial: "Piercing" }),
      "Single Action": new fields.StringField({ initial: "Single Action" }),
      Automatics: new fields.StringField({ initial: "Automatics" }),
    });

    schema.wtype = new fields.StringField({ initial: "Slashing" });
    return schema;
  }

}
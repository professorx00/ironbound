import ironboundItemBase from "./base-item.mjs";

export default class ironboundWeapons extends ironboundItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.heal = new fields.BooleanField();

    schema.equipped = new fields.BooleanField();

    schema.activated = new fields.BooleanField();
    
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

     schema.weaponGrades = new fields.SchemaField({
       Light: new fields.StringField({ initial: "Light" }),
       Medium: new fields.StringField({ initial: "Medium" }),
       Heavy: new fields.StringField({ initial: "Heavy" }),
     });

     schema.weaponTypes = new fields.SchemaField({
       Slashing: new fields.StringField({ initial: "Slashing" }),
       Bludgeoning: new fields.StringField({ initial: "Bludgeoning" }),
       Piercing: new fields.StringField({ initial: "Piercing" }),
       "Single Action": new fields.StringField({ initial: "Single Action" }),
       Automatics: new fields.StringField({ initial: "Automatics" })
     });

     schema.grade = new fields.StringField({initial: "Light" })

     schema.wtype = new fields.StringField({initial: "Slashing"})

     schema.ammo =  new fields.NumberField({min: 0, initial: 0})
0
    return schema;
  }
}
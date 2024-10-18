/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ironboundItem extends Item {
  static async create(data, options = {}) {
    let imgUrl = null;
    switch (data.type) {
      case "activeFeats":
        imgUrl = {
          img: "systems/ironbound/assets/icons/active.png",
        };
        break;
      case "passiveFeats":
        imgUrl = {
          img: "systems/ironbound/assets/icons/passive.png",
        };
        break;
      case "characterClass":
        imgUrl = {
          img: "systems/ironbound/assets/icons/characterClass.png",
        };
        break;
      case "flaws":
        imgUrl = {
          img: "systems/ironbound/assets/icons/flaws.png",
        };
        break;
      case "boons":
        imgUrl = {
          img: "systems/ironbound/assets/icons/boon.png",
        };
        break;
      case "banes":
        imgUrl = {
          img: "systems/ironbound/assets/icons/bane.png",
        };
        break;
      case "consumables":
        imgUrl = {
          img: "systems/ironbound/assets/icons/consumable.png",
        };
        break;
      case "defenseitems":
        imgUrl = {
          img: "systems/ironbound/assets/icons/defenseitems.png",
        };
        break;
      case "magicalSocieties":
        imgUrl = {
          img: "systems/ironbound/assets/icons/magicalSociety.png",
        };
        break;
      case "potions":
        imgUrl = {
          img: "systems/ironbound/assets/icons/potion.png",
        };
        break;
      case "wands":
        imgUrl = {
          img: "systems/ironbound/assets/icons/wand.png",
        };
        break;
      case "weapons":
        imgUrl = {
          img: "systems/ironbound/assets/icons/weapons.png",
        };
        break;
      case "fightingstances":
        imgUrl = {
          img: "systems/ironbound/assets/icons/fightingStance.png",
        };
        break;
      case "factions":
        imgUrl = {
          img: "systems/ironbound/assets/icons/factions.png",
        };
        break;
      case "species":
        imgUrl = {
          img: "systems/ironbound/assets/icons/species.png",
        };
        break;
      case "scrolls":
        imgUrl = {
          img: "systems/ironbound/assets/icons/scroll.png",
        };
        break;
      case "npcattack":
        imgUrl = {
          img: "systems/ironbound/assets/icons/npcAttack.png",
        };
        break;
      case "npcability":
        imgUrl = {
          img: "systems/ironbound/assets/icons/feat.png",
        };
        break;
      case "vehicleEnhancements":
        imgUrl = {
          img: "systems/ironbound/assets/icons/vehicleEnhancements.png",
        };
        break;
      case "classAbilities":
        imgUrl = {
          img: "systems/ironbound/assets/icons/classAbilities.png",
        };
        break;
      case "gear":
        imgUrl = {
          img: "systems/ironbound/assets/icons/gear.png",
        };
        break;
      default:
        imgUrl = {
          img: "systems/ironbound/assets/icons/basic-needs.png",
        };
    }

    mergeObject(data, imgUrl, {
      overwrite: false,
    });
    return super.create(data, options);
  }
  /**
   * Augment the basic Item data model with additional dynamic data.
   */

  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Convert the actor document to a plain object.
   *
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   *
   * @returns {object} Plain object either via deepClone or the spread operator.
   */
  toPlainObject() {
    const result = { ...this };

    // Simplify system data.
    result.system = this.system.toPlainObject();

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get("core", "rollMode");
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? "",
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.formula, rollData.actor);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ironboundActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data that isn't
   * handled by the actor's DataModel. Data calculated in this step should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const flags = actorData.flags.ironbound || {};
  }

  /**
   *
   * @override
   * Augment the actor's default getRollData() method by appending the data object
   * generated by the its DataModel's getRollData(), or null. This polymorphic
   * approach is useful when you have actors & items that share a parent Document,
   * but have slightly different data preparation needs.
   */
  getRollData() {
    return {
      ...super.getRollData(),
      ...(this.system.getRollData?.() ?? null),
      "@powerDie": this.system.powerDie,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async roll(type, pool) {
    const boons = this.system.currentBoons;
    const numberOfDice = Math.abs(boons) + 1;
    let criticalSuccess = false;
    let criticalFailure = false;
    let keepDice = "d12kh";
    if (boons < 0) {
      keepDice = "d12kl";
    }
    if (boons == 0) {
      keepDice = "d12";
    }
    const formula = numberOfDice + keepDice;
    const destinyDice = this.system.destinyDie;
    let roll = await new Roll(formula).evaluate();
    if (roll._total == 12) {
      criticalSuccess = true;
    }
    if (roll._total == 1) {
      criticalFailure = true;
    }
    let rollResults = "";
    const rollData = {
      rollHTML: await roll.render(),
      rollResults: rollResults,
      roll: roll._total,
      roll_type: type,
      actor: this._id,
      pool: pool,
      criticalSuccess,
      criticalFailure,
      destinyDice: destinyDice,
      formula: formula,
    };

    this.sendRolltoChat(rollData, roll, "regularRoll.hbs");

    this.update({ "system.currentBoons": 0 });
  }

  async rollHeal(pool, heal) {
    let roll = await new Roll(heal).evaluate();
    let rollResults = "";
    const rollData = {
      rollHTML: await roll.render(),
      rollResults: rollResults,
      roll: roll._total,
      actor: this._id,
      pool: pool,
    };
    let cardContent = await renderTemplate(
      "systems/ironbound/templates/chat/healRoll.hbs",
      rollData
    );
    const chatOptions = {
      type: rollData.rollType,
      roll: roll,
      content: cardContent,
      speaker: ChatMessage.getSpeaker({ actor: this }),
    };

    ChatMessage.create(chatOptions);
  }

  async rollDamage(pool, formula) {
    let roll = await new Roll(formula, this.getRollData()).evaluate();
    let rollResults = "";
    const rollData = {
      ...this.getRollData(),
      rollHTML: await roll.render(),
      rollResults: rollResults,
      roll: roll._total,
      actor: this._id,
      pool: pool,
    };
    console.log(rollData);
    let cardContent = await renderTemplate(
      "systems/ironbound/templates/chat/damageRoll.hbs",
      rollData
    );
    const chatOptions = {
      type: rollData.rollType,
      roll: roll,
      content: cardContent,
      speaker: ChatMessage.getSpeaker({ actor: this }),
    };

    ChatMessage.create(chatOptions);
  }

  async sendRolltoChat(rollData, roll, template) {
    let cardContent = await renderTemplate(
      `systems/ironbound/templates/chat/${template}`,
      rollData
    );
    const chatOptions = {
      type: rollData.rollType,
      roll: roll,
      content: cardContent,
      speaker: ChatMessage.getSpeaker({ actor: this }),
    };
    ChatMessage.create(chatOptions);
  }

  async rollDestiny(formula, pool) {
    await this.update({ "system.destinyDie": this.system.destinyDie - 1 });
    let roll = await new Roll(formula).evaluate();
    let criticalSuccess = false;
    let criticalFailure = false;
    const destinyDice = this.system.destinyDie;
    let type = "Destiny";
    if (roll._total == 12) {
      criticalSuccess = true;
    }
    if (roll._total == 1) {
      criticalFailure = true;
    }
    let rollResults = "";
    const rollData = {
      rollHTML: await roll.render(),
      rollResults: rollResults,
      roll: roll._total,
      roll_type: type,
      actor: this._id,
      pool: pool,
      criticalSuccess,
      criticalFailure,
      destinyDice: destinyDice,
      formula: formula,
    };

    this.sendRolltoChat(rollData, roll, "regularRoll.hbs");
  }

  async rollHealth(formula, pool) {
    let roll = await new Roll(formula).evaluate();
    let criticalSuccess = false;
    let criticalFailure = false;
    const destinyDice = this.system.destinyDie;
    let type = "Health Die ";
    if (roll._total == 12) {
      criticalSuccess = true;
    }
    if (roll._total == 1) {
      criticalFailure = true;
    }
    let rollResults = "";
    const rollData = {
      rollHTML: await roll.render(),
      rollResults: rollResults,
      roll: roll._total,
      roll_type: type,
      actor: this._id,
      pool: pool,
      criticalSuccess,
      criticalFailure,
      destinyDice: destinyDice,
      formula: formula,
    };

    this.sendRolltoChat(rollData, roll, "healthDieRoll.hbs");
  }

  async rollPower(formula, pool) {
    let roll = await new Roll(formula).evaluate();
    let criticalSuccess = false;
    let criticalFailure = false;
    const destinyDice = 0;
    let type = "Power Die ";
    if (roll._total == 12) {
      criticalSuccess = true;
    }
    if (roll._total == 1) {
      criticalFailure = true;
    }
    let rollResults = "";
    const rollData = {
      rollHTML: await roll.render(),
      rollResults: rollResults,
      roll: roll._total,
      roll_type: type,
      actor: this._id,
      pool: pool,
      criticalSuccess,
      criticalFailure,
      destinyDice: destinyDice,
      formula: formula,
    };

    this.sendRolltoChat(rollData, roll, "healthDieRoll.hbs");
  }

  async addPoolPoints(pool, roll) {
    if (pool == "destiny") {
      return;
    }
    let points = this.system[pool.toLowerCase()].current;
    const pointDialog = new game.ironbound.ironboundAddPoolDialog(
      this,
      pool,
      roll,
      points
    );

    pointDialog.render(true);
  }

  async addPoolChat(pool, boost, newRoll) {
    let cardData = {
      pool,
      boost,
      newRoll,
    };
    let cardContent = await renderTemplate(
      `systems/ironbound/templates/chat/addedPoolPoints.hbs`,
      cardData
    );

    const chatOptions = {
      content: cardContent,
      speaker: ChatMessage.getSpeaker({ actor: this }),
    };
    ChatMessage.create(chatOptions);
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

    // Add items.
    result.items = this.items?.size > 0 ? this.items.contents : [];

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }
}

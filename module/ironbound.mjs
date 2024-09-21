// Import document classes.
import { ironboundActor } from './documents/actor.mjs';
import { ironboundItem } from './documents/item.mjs';
// Import sheet classes.
import { ironboundActorSheet } from './sheets/actor-sheet.mjs';
import { ironboundItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { IRONBOUND } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.ironbound = {
    ironboundActor,
    ironboundItem,
    ironboundBoonDialog,
    ironboundAddPoolDialog,
    ironboundDamageDialog,
    ironboundHealDialog,
    ironboundHealDieDialog,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.IRONBOUND = IRONBOUND;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = ironboundActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.ironboundCharacter,
    npc: models.ironboundNPC,
  };
  CONFIG.Item.documentClass = ironboundItem;
  CONFIG.Item.dataModels = {
    activeFeats: models.ironboundActiveFeat,
    passiveFeats: models.ironboundPassiveFeat,
    characterClass: models.ironboundCharacterClass,
    flaws: models.ironboundFlaws,
    boons: models.ironboundBoons,
    banes: models.ironboundBanes,
    consumables: models.ironboundConsumables,
    defenseitems: models.ironboundDefenseitems,
    magicalSocieties: models.ironboundMagicalSocieties,
    potions: models.ironboundPotions,
    wands: models.ironboundWands,
    weapons: models.ironboundWeapons,
    fightingstances: models.ironboundFightingStances,
    factions: models.ironboundFactions,
    species: models.ironboundSpecies,
    scrolls: models.ironboundScrolls,
    gear: models.ironboundGear,
    npcattack: models.ironboundNPCAttack,
    npcability: models.ironboundNPCAbility,
  };

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ironbound", ironboundActorSheet, {
    makeDefault: true,
    label: "IRONBOUND.SheetLabels.Actor",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("ironbound", ironboundItemSheet, {
    makeDefault: true,
    label: "IRONBOUND.SheetLabels.Item",
  });

  // class IronboundBoonDialog extends Dialog {
  //   constructor(actor, dialogData = {}, options = {}) {
  //     super(dialogData, options);
  //     this.actor = actor;
  //   }

  //   /** @override */
  //   activateListeners(html) {
  //     html.find(".boon-btn").click((ev) => this._onBoonBtn(ev));
  //   }

  //   _onBoonBtn(event) {
  //     event.preventDefault();
  //     console.log(event);
  //   }
  // }

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});
Handlebars.registerHelper("isRangedWeapon", function (str) {
  if (str === "Single Action" || str === "Automatics") {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper("is1MarkofDoom", function (actorId) {
  let actor = game.actors.get(actorId);
  if (actor.system.markofdoom >= 1) {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper("is2MarkofDoom", function (actorId) {
  let actor = game.actors.get(actorId);
  if (actor.system.markofdoom >= 2) {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper("is3MarkofDoom", function (actorId) {
  let actor = game.actors.get(actorId);
  if (actor.system.markofdoom >= 3) {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper("isNotPassive", function (passive) {
  if (passive) {
    return false;
  } else {
    return true;
  }
});
Handlebars.registerHelper("rollNotCritical", function (roll) {
  if (parseInt(roll) === 1) {
    return false;
  } else {
    return true;
  }
});

Handlebars.registerHelper("hasDestinyDie", function (dice) {
  if (dice > 0) {
    return true;
  } else {
    return false;
  }
});

Handlebars.registerHelper("isGM", function (user) {
  return game.user.isGM;
});

Handlebars.registerHelper("isCharacter", function (actorId) {
  let actor = game.actors.get(actorId);
  if (actor.type == "npc") {
    return false;
  } else {
    return true;
  }
});

Handlebars.registerHelper("isDamageItem", function (item) {
  if (!item?.system?.formula) {
    return false;
  }
  if (item.system.formula !== "") {
    return true;
  } else {
    return false;
  }
});
/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

Hooks.on("renderChatMessage", function (message, html, messageData) {
  console.log("Chat rendered");
  html.find(".destinyDie-btn").click((ev) => {
    const el = ev.currentTarget;
    const dataset = el.dataset;
    rollDestiny(
      dataset.actorId,
      dataset.pool,
      dataset.rollType,
      dataset.formula
    );
  });

  html.find(".chat-addition-btn").click((ev) => {
    const el = ev.currentTarget;
    const dataset = el.dataset;
    addPoolPoints(dataset.actorId, dataset.pool, dataset.roll);
  });

  html.find(".addtohealth").click((ev) => {
    addToHealth(ev);
  });
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes("Actor.") && !data.uuid.includes("Token.")) {
    return ui.notifications.warn(
      "You can only create macro buttons for owned Items"
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.ironbound.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "ironbound.itemMacro": true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: "Item",
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}

function rollDestiny(actor_id, pool, type, formula) {
  let actor = game.actors.get(actor_id);
  actor.rollDestiny(formula, pool);
}
function addPoolPoints(actor_id, pool, roll) {
  let actor = game.actors.get(actor_id);
  actor.addPoolPoints(pool, roll);
}

function rollDmg(ev) {
  const el = ev.currentTarget;
  const data = el.dataset;
  const { actorId, formula, pool, crit, powerdie, weapon } = data;
  let actor = game.actors.get(actorId);
  actor.rollDamage(pool, formula, crit, powerdie, weapon);
}

function rollHeal(ev) {
  const el = ev.currentTarget;
  const data = el.dataset;
  const { actorId, formula, pool, crit, powerdie } = data;
  let actor = game.actors.get(actorId);
  actor.rollHeal(pool, formula, crit, powerdie);
}

function addToHealth(ev) {
  const el = ev.currentTarget;
  const data = el.dataset;
  const { actorId, roll } = data;
  let actor = game.actors.get(actorId);
  let newBase = actor.system.health.base + parseInt(roll);
  let newCurrent = actor.system.health.current + parseInt(roll);
  actor.update({
    "system.health.base": newBase,
    "system.health.current": newCurrent,
  });
}

class ironboundBoonDialog extends Application {
  constructor(actor, type, pool) {
    super();
    this.actor = actor;
    this.pool = pool;
    this.rollType = type;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      height: 200,
      width: 400,
      popOut: true,
      template: `systems/ironbound/templates/dialogs/boonDialog.hbs`,
      id: "boon-bane-dialog",
      title: "Boons / Banes",
    });
  }

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      pool: this.pool,
      rollType: this.rollType,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".boon-advance-btn").click((ev) => this._boonChange(ev));
    html.find(".roll-btn").click((ev) => this._rollCheck(ev));
  }

  async _boonChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const addingNum = parseInt(dataset.addingnum);
    const updateValue = this.actor.system.currentBoons + addingNum;
    await this.actor.update({ "system.currentBoons": updateValue });
    this.render();
  }

  async _rollCheck(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    this.actor.roll(dataset.type, dataset.pool);
    this.close();
  }

  async _chatUpdate(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    console.log("check ");
  }

  // /** @override */
  // activateListeners(html) {
  //   html.find(".boon-btn").click((ev) => this._onBoonBtn(ev));
  // }

  // _onBoonBtn(event) {
  //   event.preventDefault();
  //   console.log(this.actor);
  // }
}

class ironboundAddPoolDialog extends Application {
  constructor(actor, pool, roll, points) {
    super();
    this.actor = actor;
    this.pool = pool;
    this.roll = roll;
    this.points = points;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      height: 400,
      width: 400,
      popOut: true,
      template: `systems/ironbound/templates/dialogs/addPoolPoints.hbs`,
      id: "add-pool-points",
      title: "Add Pool Points",
    });
  }

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      pool: this.pool,
      roll: this.roll,
      points: this.points,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".add-pool-btn").click((ev) => this._poolChange(ev));
    html.find(".submit-pool-add").click((ev) => this._addPoolPoints(ev));
  }

  async _poolChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const pool = dataset.pool.toLowerCase();
    const roll = parseInt(dataset.roll);
    const current = this.actor.system[pool.toLowerCase()].current;
    const addingNum = parseInt(dataset.addingnum);
    let updateValue = this.actor.system.rollBoost + addingNum;
    if (updateValue < 0) {
      updateValue = 0;
    } else if (updateValue > 12) {
      updateValue = 12;
    } else if (updateValue > current) {
      updateValue = current;
    } else if (updateValue > 12 - roll) {
      updateValue = 12 - roll;
    }
    await this.actor.update({ "system.rollBoost": updateValue });
    this.render();
  }

  _addPoolPoints(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const pool = dataset.pool;
    const boost = parseInt(dataset.boost);
    const newRoll = parseInt(dataset.roll) + boost;
    const poolString = `system.${pool.toLowerCase()}.current`;
    const current = this.actor.system[pool.toLowerCase()].current - boost;
    console.log(poolString);
    this.actor.update({ [poolString]: current });
    this.actor.addPoolChat(pool, boost, newRoll);
    this.actor.update({ "system.rollBoost": 0 });
    this.close();
  }

  // /** @override */
  // activateListeners(html) {
  //   html.find(".boon-btn").click((ev) => this._onBoonBtn(ev));
  // }

  // _onBoonBtn(event) {
  //   event.preventDefault();
  //   console.log(this.actor);
  // }
}

class ironboundHealDieDialog extends Application {
  constructor(actor, pool, heal) {
    super();
    this.actor = actor;
    this.pool = pool;
    this.heal = heal;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      height: 400,
      width: 400,
      popOut: true,
      template: `systems/ironbound/templates/dialogs/rollHeal.hbs`,
      id: "roll-heal",
      title: "Roll Heal",
    });
  }

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      pool: this.pool,
      heal: this.heal,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // html.find(".submit-heal").click((ev) => this._addPoolPoints(ev));
  }
}

class ironboundHealDialog extends Application {
  constructor(actor, pool, formula) {
    super();
    this.actor = actor;
    this.pool = pool;
    this.formula = formula;
    this.crit = false;
    this.powerDie = false;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      height: 200,
      width: 350,
      popOut: true,
      template: `systems/ironbound/templates/dialogs/rollHeal.hbs`,
      id: "roll-dmg",
      title: "Roll Healing",
    });
  }

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      pool: this.pool,
      formula: this.formula,
      crit: this.crit,
      powerDie: this.powerDie,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".rollHeal").click((ev) => {
      rollHeal(ev);
      this.close();
    });
    html.find(".hasPowerDie").click((ev) => {
      this.powerDie = !this.powerDie;
      this.render();
    });

    html.find(".hasCrit").click((ev) => {
      this.crit = !this.crit;
      this.render();
    });
  }
}

class ironboundDamageDialog extends Application {
  constructor(actor, pool, formula, weaponType) {
    super();
    this.actor = actor;
    this.pool = pool;
    this.formula = formula;
    this.crit = false;
    this.powerDie = false;
    this.weaponType = weaponType;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form"],
      height: 200,
      width: 350,
      popOut: true,
      template: `systems/ironbound/templates/dialogs/rollDamage.hbs`,
      id: "roll-dmg",
      title: "Roll Damage",
    });
  }

  getData() {
    // Send data to the template
    return {
      actor: this.actor,
      pool: this.pool,
      formula: this.formula,
      crit: this.crit,
      powerDie: this.powerDie,
      weaponType: this.weaponType,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".rollDmg").click((ev) => {
      rollDmg(ev);
      this.close();
    });
    html.find(".hasPowerDie").click((ev) => {
      this.powerDie = !this.powerDie;
      this.render();
    });

    html.find(".hasCrit").click((ev) => {
      this.crit = !this.crit;
      this.render();
    });
  }
}


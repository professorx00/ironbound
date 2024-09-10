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

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.ironbound = {
    ironboundActor,
    ironboundItem,
    ironboundBoonDialog,
    ironboundAddPoolDialog,
    ironboundHealDialog,
    rollItemMacro,
    
  };

  // Add custom constants for configuration.
  CONFIG.IRONBOUND = IRONBOUND;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = ironboundActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.ironboundCharacter,
    npc: models.ironboundNPC
  }
  CONFIG.Item.documentClass = ironboundItem;
  CONFIG.Item.dataModels = {
    activeFeats: models.ironboundActiveFeat,
    passiveFeats: models.ironboundPassiveFeat,
    characterClass: models.ironboundCharacterClass,
    flaws: models.ironboundFlaws,
    boons: models.ironboundBoons,
    banes: models.ironboundBanes,
    consumables: models.ironboundConsumables,
    defitems: models.ironboundDefItems,
    magicalSocieties: models.ironboundMagicalSocieties,
    potions: models.ironboundPotions,
    wands: models.ironboundWands,
    weapons: models.ironboundWeapons,
    fightingStances: models.ironboundFightingStances,
    factions: models.ironboundFactions,
    species: models.ironboundSpecies,
    scrolls: models.ironboundScrolls,
    gear: models.ironboundGear,
  };

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('ironbound', ironboundActorSheet, {
    makeDefault: true,
    label: 'IRONBOUND.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('ironbound', ironboundItemSheet, {
    makeDefault: true,
    label: 'IRONBOUND.SheetLabels.Item',
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
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});
Handlebars.registerHelper("isRangedWeapon", function (str) {
  if(str === "Single Action" || str === "Automatics"){
    return true
  }else{
    return false
  }
});

Handlebars.registerHelper("isNotPassive", function(passive){
  if(passive){
    return false
  }else{
    return true
  }
})
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
  console.log("hi", game.user.isGM);
  return game.user.isGM;
})



Handlebars.registerHelper("isDamageItem", function(item){
  if(!item?.system?.formula){
    return false
  }
  if(item.system.formula !== ""){
    return true
  }else{
    return false
  }
});
/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
  
  
});

Hooks.on("renderChatMessage", function (message, html, messageData) {
  console.log("Chat rendered");
  html.find(".destinyDie-btn").click((ev) => {
    const el = ev.currentTarget
    const dataset = el.dataset
    console.log(dataset)
    rollDestiny(dataset.actorId, dataset.pool, dataset.rollType);
  });

  html.find(".chat-addition-btn").click((ev)=>{
    const el = ev.currentTarget;
    const dataset = el.dataset;
    addPoolPoints(dataset.actorId, dataset.pool, dataset.roll)
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
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
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
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'ironbound.itemMacro': true },
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
    type: 'Item',
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

function rollDestiny(actor_id, pool, type){
  let actor = game.actors.get(actor_id);
  actor.rollDestiny(type, pool);
}
function addPoolPoints(actor_id, pool, roll) {
  let actor = game.actors.get(actor_id);
  actor.addPoolPoints(pool, roll);
}



class ironboundBoonDialog extends Application {
  constructor(actor, pool) {
    super();
    this.actor = actor
    this.pool = pool
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
      pool: this.pool
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".boon-advance-btn").click((ev) => this._boonChange(ev));
    html.find(".roll-btn").click((ev) => this._rollCheck(ev));
  }

  async _boonChange(event){
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const addingNum = parseInt(dataset.addingnum);
    const updateValue = this.actor.system.currentBoons + addingNum;
    await this.actor.update({'system.currentBoons': updateValue})
    this.render();
  }

  async _rollCheck(event){
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    this.actor.roll(dataset.type, dataset.pool)
    this.close()
  }

  async _chatUpdate(event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    console.log("check ")
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
    const pool =  dataset.pool.toLowerCase();
    const roll = parseInt(dataset.roll)
    const current = this.actor.system[pool.toLowerCase()].current
    const addingNum = parseInt(dataset.addingnum);
    let updateValue = this.actor.system.rollBoost + addingNum;
    if(updateValue < 0){
      updateValue = 0;
    }else if(updateValue > 12){
      updateValue = 12;
    }else if(updateValue > current){
      updateValue = current;
    }else if (updateValue > 12-roll){
      updateValue = 12-roll;
    }
    await this.actor.update({ "system.rollBoost": updateValue });
    this.render();
  }

  _addPoolPoints(event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const pool = dataset.pool;
    const boost = parseInt(dataset.boost);
    const newRoll = parseInt(dataset.roll) + boost
    const poolString = `system.${pool.toLowerCase()}.current`
    const current = this.actor.system[pool.toLowerCase()].current - boost;
    console.log(poolString)
    this.actor.update({[poolString]:current})
    this.actor.addPoolChat(pool,boost, newRoll)
    this.actor.update({"system.rollBoost": 0});
    this.close()
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

class ironboundHealDialog extends Application {
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

    // html.find(".add-heal-btn").click((ev) => this._heal(ev));
    // html.find(".submit-heal").click((ev) => this._addPoolPoints(ev));
  }
}


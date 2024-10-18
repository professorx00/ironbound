import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ironboundActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ironbound", "sheet", "actor"],
      width: 900,
      height: 1120,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "favorites",
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/ironbound/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.IRONBOUND
    context.config = CONFIG.IRONBOUND;

    // Prepare character data and items.
    if (actorData.type == "character") {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == "npc") {
      this._prepareItems(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == "vehicle") {
      this._prepareItems(context);
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    context.enrichedgmnotes = await TextEditor.enrichHTML(
      this.actor.system.gmnotes,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isGM,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const activeFeats = [];
    const passiveFeats = [];
    const flaws = [];
    const boons = [];
    const banes = [];
    const potions = [];
    const wands = [];
    const scrolls = [];
    const consumables = [];
    let species = {};
    let characterClass = {};
    const weapons = [];
    const magicalSocieties = [];
    const defenseitems = [];
    const fightingstances = [];
    const favorites = [];
    const npcattack = [];
    const npcability = [];
    const vehicleEnhancements = [];
    const classAbilities = [];
    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.system.fav) {
        favorites.push(i);
      }
      if (i.type === "gear") {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === "activeFeats") {
        activeFeats.push(i);
      } else if (i.type === "passiveFeats") {
        passiveFeats.push(i);
      } else if (i.type === "flaws") {
        flaws.push(i);
      } else if (i.type === "boons") {
        boons.push(i);
      } else if (i.type === "banes") {
        banes.push(i);
      } else if (i.type === "potions") {
        potions.push(i);
      } else if (i.type === "wands") {
        wands.push(i);
      } else if (i.type === "scrolls") {
        scrolls.push(i);
      } else if (i.type === "consumables") {
        consumables.push(i);
      } else if (i.type === "characterClass") {
        characterClass = i;
      } else if (i.type === "species") {
        species = i;
      } else if (i.type === "weapons") {
        weapons.push(i);
      } else if (i.type === "magicalSocieties") {
        magicalSocieties.push(i);
      } else if (i.type === "defenseitems") {
        defenseitems.push(i);
      } else if (i.type === "fightingstances") {
        fightingstances.push(i);
      } else if (i.type === "npcattack") {
        npcattack.push(i);
      } else if (i.type === "npcability") {
        npcability.push(i);
      } else if (i.type === "vehicleEnhancements") {
        vehicleEnhancements.push(i);
      } else if (i.type === "classAbilities") {
        classAbilities.push(i);
      }
    }

    // Assign and return
    context.gear = gear;
    context.activeFeats = activeFeats;
    context.passiveFeats = passiveFeats;
    context.flaws = flaws;
    context.boons = boons;
    context.banes = banes;
    context.potions = potions;
    context.wands = wands;
    context.scrolls = scrolls;
    context.consumables = consumables;
    context.characterClass = characterClass;
    context.species = species;
    context.weapons = weapons;
    context.magicalSocieties = magicalSocieties;
    context.defenseitems = defenseitems;
    context.fightingstances = fightingstances;
    context.favorites = favorites;
    context.npcattack = npcattack;
    context.npcability = npcability;
    context.vehicleEnhancements = vehicleEnhancements;
    context.classAbilities = classAbilities;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on("click", ".item-edit", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on("click", ".item-create", this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on("click", ".item-delete", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on("click", ".effect-control", (ev) => {
      const row = ev.currentTarget.closest("li");
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on("click", ".rollable", this._onRoll.bind(this));
    html.on("click", ".roll-damage", this._onRollDamage.bind(this));
    html.on("click", ".roll-heal", this._onRollHeal.bind(this));
    html.on("click", ".rollPool", this._onRollPool.bind(this));
    html.on("click", ".rollHealthDie", this._rollHealthDie.bind(this));
    html.on("click", ".rollPowerDie", this._rollPowerDie.bind(this));

    html.on("click", ".bookmark", this._bookmark.bind(this));

    html.on("click", ".equipItem", this._equipItem.bind(this));
    html.on("click", ".changeOty", this._changeQty.bind(this));
    html.on("click", ".change-money-btn", this._changeMoney.bind(this));

    html.on("click", ".change-btn", this._updatePools.bind(this));
    html.on("click", ".deleteClass", this._deleteClass.bind(this));
    html.on("click", ".refresh-btn", this._refreshPools.bind(this));
    html.on("click", ".destinyRefresh-btn", this._refreshDestiny.bind(this));
    html.on("click", ".powerDiceSelect", this._setPowerDie.bind(this));
    html.on("click", ".healthDiceSelect", this._setHealthDie.bind(this));
    html.on("click", ".info", this._toggleDescription.bind(this));
    html.on("click", ".rollDestinyDie-btn", this._rollDestinyDie.bind(this));
    html.on("click", ".clickDoom", this._handleDoom.bind(this));
    html.on("click", ".clickShortRest", this._handleShortRest.bind(this));
    html.on("click", ".clickLongRest", this._handleLongRest.bind(this));
    html.on("click", ".were", this._handleChange.bind(this));
    html.on("click", "equipVE", this._handleEquipVE.bind(this));
    html.on(
      "click",
      ".refresh-actionPoints-btn",
      this._resetActionPoints.bind(this)
    );
    html.on(
      "click",
      ".change-actionPoint-btn",
      this._changeActionPoints.bind(this)
    );

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find("li.item").each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = foundry.utils.duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
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

    const itemData = {
      name: name,
      type: type,
      system: data,
      img: imgUrl.img,
    };

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    this._getBoonDialog(dataset);
  }

  _deleteClass(event) {
    const el = event.currentTarget;
    const dataset = el.dataset;
    const classId = dataset.classId;
    let item = this.actor.items.get(classId);
    item.delete();
  }

  _onRollHeal(event) {
    const el = event.currentTarget;
    const dataset = el.dataset;
    const pool = dataset.pool;
    const heal = dataset.heal;
    const dialog = new game.ironbound.ironboundHealDialog(
      this.actor,
      pool,
      heal
    );
    dialog.render(true);
    // this.actor.rollHeal(pool, heal);
  }

  _onRollDamage(event) {
    const el = event.currentTarget;
    const dataset = el.dataset;
    const pool = dataset.pool;
    const formula = dataset.formula;
    const weapon = dataset.weapon;
    const dialog = new game.ironbound.ironboundDamageDialog(
      this.actor,
      pool,
      formula,
      weapon
    );

    dialog.render(true);
    // this.actor.rollDamage(pool, formula);
  }

  _onRollPool(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const pool = dataset.pool;
    this._getBoonDialog(dataset);
  }

  async _getBoonDialog(data) {
    const boonDialog = new game.ironbound.ironboundBoonDialog(
      this.actor,
      data.rollType,
      data.pool,
      data.ap
    );

    boonDialog.render(true);
  }

  async rollCallBack(html, rollData) {
    console.log("Roll");
  }

  _bookmark(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item_id = dataset.itemId;
    const item = this.actor.items.get(item_id);
    item.update({ "system.fav": !item.system.fav });
  }

  _equipItem(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item_id = dataset.itemId;
    const item = this.actor.items.get(item_id);
    item.update({ "system.equipped": !item.system.equipped });
    if (!item.system.equipped) {
      if (item.type == "defenseitems") {
        if (item.system.pool.toLowerCase() === "physical") {
          this.actor.update({
            "system.physical.def":
              this.actor.system.physical.def + item.system.bonus,
          });
        }
        if (item.system.pool.toLowerCase() === "arcane") {
          this.actor.update({
            "system.arcane.def":
              this.actor.system.arcane.def + item.system.bonus,
          });
        }
        if (item.system.pool.toLowerCase() === "mental") {
          this.actor.update({
            "system.mental.def":
              this.actor.system.mental.def + item.system.bonus,
          });
        }
      }
      if (item.type == "vehicleEnhancements") {
        let vehiclePoints = this.actor.system.vehiclePoints;
        let newPoints = vehiclePoints - item.system.vehiclePoints;
        if (vehiclePoints >= 0 && newPoints >= 0) {
          this.actor.update({ "system.vehiclePoints": newPoints });
        } else {
          console.log("You Don't Have enough Points");
        }
      }
    } else {
      if (item.type == "defenseitems") {
        if (item.system.pool.toLowerCase() === "physical") {
          this.actor.update({
            "system.physical.def":
              this.actor.system.physical.def - item.system.bonus,
          });
        }
        if (item.system.pool.toLowerCase() === "arcane") {
          this.actor.update({
            "system.arcane.def":
              this.actor.system.arcane.def - item.system.bonus,
          });
        }
        if (item.system.pool.toLowerCase() === "mental") {
          this.actor.update({
            "system.mental.def":
              this.actor.system.mental.def - item.system.bonus,
          });
        }
      }
      if (item.type == "vehicleEnhancements") {
        let vehiclePoints = this.actor.system.vehiclePoints;
        let newPoints = vehiclePoints + item.system.vehiclePoints;
        this.actor.update({ "system.vehiclePoints": newPoints });
      }
    }
  }

  _changeQty(event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item_id = dataset.itemId;
    const point = dataset.point;
    const item = this.actor.items.get(item_id);
    item.update({"system.qty": item.system.qty+parseInt(point)})
  }
  
  _changeMoney(event){
    const element = event.currentTarget;
    const dataset = element.dataset;
    const money = dataset.money
    const moneyName = `system.${money}`
    const point = dataset.point
    this.actor.update({[moneyName]: this.actor.system[money] + parseInt(point) })
  }

  _updatePools(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const poolPoint = parseInt(dataset.poolpoint);
    const pool = dataset.pool;
    const currentPool = this.actor.system[pool.toLowerCase()].current;
    let newpool = currentPool + poolPoint;
    if (newpool > this.actor.system[pool.toLowerCase()].base) {
      newpool = this.actor.system[pool.toLowerCase()].base;
    }
    if (newpool <= 0) {
      newpool = 0;
    }
    this.actor.update({ [`system.${pool}.current`]: newpool });
  }
  _refreshPools(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const pool = dataset.pool;
    this.actor.update({
      [`system.${pool}.current`]: this.actor.system[pool.toLowerCase()].base,
    });
  }

  _refreshDestiny(event) {
    this.actor.update({ "system.destinyDie": this.actor.destinyDieBase });
  }

  _setPowerDie(event) {
    const element = event.currentTarget;
    const value = element.value;
    this.actor.update({ "system.powerDie": value });
  }
  _setHealthDie(event) {
    const element = event.currentTarget;
    const value = element.value;
    this.actor.update({ "system.healthDie": value });
  }

  _toggleDescription(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const item_id = dataset.itemId;
    const descriptionEl = document.getElementById(item_id);
    descriptionEl.classList.toggle("hidden");
  }

  _changeActionPoints(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const poolPoint = parseInt(dataset.poolpoint);
    const currentActionPoints = this.actor.system.actionPoints;
    const baseActionPoints = this.actor.system.actionPointsBase;
    let newActions = 0;
    if (currentActionPoints + poolPoint < 0) {
      newActions = 0;
    } else if (currentActionPoints + poolPoint > baseActionPoints) {
      newActions = baseActionPoints;
    } else {
      newActions = currentActionPoints + poolPoint;
    }
    this.actor.update({ "system.actionPoints": newActions });
  }

  _resetActionPoints(event) {
    const baseActionPoints = this.actor.system.actionPointsBase;
    this.actor.update({ "system.actionPoints": baseActionPoints });
  }

  _rollDestinyDie(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const formula = dataset.formula;
    const pool = dataset.pool;
    this.actor.rollDestiny(formula, pool);
  }

  _rollHealthDie(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const formula = dataset.formula;
    const pool = dataset.pool;
    this.actor.rollHealth(formula, pool);
  }

  _rollPowerDie(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const formula = dataset.formula;
    const pool = dataset.pool;
    this.actor.rollPower(formula, pool);
  }

  _handleDoom(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    const mark = parseInt(dataset.mark);
    let doom = this.actor.system.markofdoom + mark;
    let current = this.actor.system.currentBoons;
    let newcurrent = current + -1 * mark;
    this.actor.update({
      "system.markofdoom": doom,
      "system.currentBoons": newcurrent,
    });
  }

  async _handleShortRest(event) {
    let healthFormula = this.actor.system.healthDie;
    let healthRoll = await this.actor.healthRestRoll(healthFormula);
    let newHealth = this.actor.system.health.current + healthRoll;
    if (newHealth > this.actor.system.health.base) {
      newHealth = this.actor.system.health.base;
    }
    await this.actor.poolRestRoll("1d12");
    let marksofdoom = this.actor.system.markofdoom;
    if (marksofdoom > 0) {
      marksofdoom = marksofdoom - 1;
      if (marksofdoom < 0) {
        marksofdoom = 0;
      }
    }

    this.actor.update({
      "system.markofdoom": marksofdoom,
      "system.health.current": newHealth,
    });
  }

  async _handleLongRest(event) {
    let healthFormula = this.actor.system.healthDie;
    let poolFormula = "1d12";
    let healthRoll = await new Roll(healthFormula).evaluate();
    let newHealth =
      this.actor.system.health.current + healthRoll._total >
      this.actor.system.health.base
        ? this.actor.system.health.base
        : this.actor.system.health.current + healthRoll._total;
    this.actor.update({
      "system.markofdoom": 0,
      "system.currentBoons": 0,
      "system.health.current": this.actor.system.health.base,
      "system.physical.current": this.actor.system.physical.base,
      "system.mental.current": this.actor.system.mental.base,
      "system.arcane.current": this.actor.system.arcane.base,
    });
  }
  async _handleChange(event) {
    const element = event.currentTarget;
    const dataset = element.dataset;
    let were = dataset.were?.toLowerCase?.() === "true";
    let current = this.actor.system.physical.current;
    let base = this.actor.system.physical.base;
    if (!were) {
      current = current + 2;
      base = base + 2;
    } else {
      if (current - 2 > 0) {
        current = current - 2;
      } else {
        current = 0;
      }
      base = base - 2;
    }
    this.actor.update({
      "system.were": !were,
      "system.physical.current": current,
      "system.physical.base": base,
    });
  }

  async _handleWeakness(event) {
    console.log(event);
  }

  async _handleEquipVE(event) {
    console.log(event);
  }
}


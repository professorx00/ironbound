/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/ironbound/templates/actor/parts/actor-features.hbs",
    "systems/ironbound/templates/actor/parts/actor-items.hbs",
    "systems/ironbound/templates/actor/parts/actor-items-npc.hbs",
    "systems/ironbound/templates/actor/parts/actor-items-npcabilities.hbs",
    "systems/ironbound/templates/actor/parts/actor-effects.hbs",
    "systems/ironbound/templates/actor/parts/actor-favorites.hbs",
    "systems/ironbound/templates/actor/parts/actor-flaws.hbs",
    "systems/ironbound/templates/actor/parts/actor-magicalSocieties.hbs",
    "systems/ironbound/templates/actor/parts/actor-fightingstances.hbs",
    "systems/ironbound/templates/actor/parts/actor-vehicleEnhancements.hbs",
    // Item partials
    "systems/ironbound/templates/item/parts/item-effects.hbs",
  ]);
};

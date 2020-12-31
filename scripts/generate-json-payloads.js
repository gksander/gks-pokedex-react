const { capitalize } = require("lodash");
const path = require("path");
const fse = require("fs-extra");
const csv = require("csvtojson");
const pokemonColorPalettes = require("./data/pokemon-colors");

// Config
const NUM_POKEMON =
  {
    starters: 9,
    gen1: 151,
    gen2: 251,
    gen3: 384,
    gen4: 491,
    gen5: 649,
  }["starters"] || 9;
const DATA_DIR = path.join(__dirname, "data/csv");
const OUTPUT_DIR = path.join(__dirname, "../public/data");

module.exports = async () => {
  try {
    /**
     * Load in data first
     */
    // Types
    // Types
    const typesData = await csv().fromFile(path.join(DATA_DIR, "types.csv"));
    // Damage factors (how strong types are against each other)
    const damageFactorData = (
      await csv().fromFile(path.join(DATA_DIR, "type_efficacy.csv"))
    ).map((item) => ({
      id: `${item.damage_type_id}.${item.target_type_id}`,
      ...item,
    }));
    // Pokemon species
    const speciesData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_species.csv"))
    ).filter((dat) => parseInt(dat.id) <= NUM_POKEMON);
    // Species "Flavor" info, to get description
    const speciesFlavorData = (
      await csv().fromFile(
        path.join(DATA_DIR, "pokemon_species_flavor_text.csv"),
      )
    ).filter((dat) => parseInt(dat.species_id) <= NUM_POKEMON);
    // The colors of pokemon
    const pokemonColorsData = await csv().fromFile(
      path.join(DATA_DIR, "pokemon_colors.csv"),
    );
    // Pokemon themselves
    const pokemonData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon.csv"))
    ).filter((dat) => parseInt(dat.id) <= NUM_POKEMON);
    // Pivot table for pokemon and types
    const pokemonTypesData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_types.csv"))
    ).filter((dat) => parseInt(dat.pokemon_id) <= NUM_POKEMON);
    // Stat information
    const statsData = await csv().fromFile(path.join(DATA_DIR, "stats.csv"));
    // Pivot table for pokemon and stats
    const pokemonStatsData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_stats.csv"))
    ).filter((dat) => parseInt(dat.pokemon_id) <= NUM_POKEMON);
    // Evolution chains
    const evolutionChainsData = await csv().fromFile(
      path.join(DATA_DIR, "evolution_chains.csv"),
    );

    await generateTypesList({ typesData });
    await generateSearchList({ pokemonData });
    await generatePaginatedPokemonList({
      pokemonData,
      speciesData,
      pokemonTypesData,
      typesData,
      speciesFlavorData,
    });
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

/**
 * Generate "all types" list
 */
const generateTypesList = async ({ typesData }) => {
  const payload = typesData.map((type) => ({
    id: type.id,
    name: capitalize(type.identifier),
    slug: type.identifier,
  }));

  await fse.ensureDir(path.join(OUTPUT_DIR, "types"));
  await fse.writeJson(path.join(OUTPUT_DIR, "types/index.json"), payload);
};

/**
 * Generating search list
 */
const generateSearchList = async ({ pokemonData }) => {
  const payload = pokemonData.map((pokemon) => ({
    id: pokemon.id,
    name: capitalize(pokemon.identifier),
    slug: pokemon.identifier,
  }));

  await fse.ensureDir(path.join(OUTPUT_DIR, "search"));
  await fse.writeJson(path.join(OUTPUT_DIR, "search/index.json"), payload);
};

/**
 * Generating pokemon list
 */
const PAGE_SIZE = 3; // TODO: BUMP THIS
const generatePaginatedPokemonList = async ({
  pokemonData,
  speciesData,
  speciesFlavorData,
  pokemonTypesData,
  typesData,
}) => {
  await fse.ensureDir(path.join(OUTPUT_DIR, "pokemon"));
  await fse.emptyDir(path.join(OUTPUT_DIR, "pokemon"));

  const totalNumPages = Math.ceil(pokemonData.length / PAGE_SIZE);
  for (let page = 1; page <= totalNumPages; page++) {
    const pageFirstId = (page - 1) * PAGE_SIZE + 1;
    const pageLastId = page * PAGE_SIZE;
    const payload = {
      pageInfo: { page, totalNumPages },
      pokemon: [],
    };

    for (let id = pageFirstId; id <= pageLastId; id++) {
      const pokemon = pokemonData.find((p) => String(p.id) === String(id));
      const species = speciesData.find((s) => String(s.id) === String(id));
      const flavorText = (
        speciesFlavorData.find((rec) => String(rec.species_id) === String(id))
          ?.flavor_text || "No description."
      ).replace(/[\n\r\f]/g, " ");
      const colorPalette = pokemonColorPalettes[id];
      const types = pokemonTypesData
        .filter((typeAssoc) => String(typeAssoc.pokemon_id) === String(id))
        .map((typeAssoc) =>
          typesData.find(
            (type) => String(type.id) === String(typeAssoc.type_id),
          ),
        );

      payload.pokemon.push({
        id: pokemon.id,
        name: capitalize(pokemon.identifier),
        slug: pokemon.identifier,
        flavorText,
        colorPalette: trimColorPalette({ colorPalette }),
        types: types.map((type) => ({
          slug: type.identifier,
          name: capitalize(type.identifier),
        })),
      });
    }

    await fse.writeJson(
      path.join(OUTPUT_DIR, "pokemon", `${page}.json`),
      payload,
    );
  }
};

/**
 * Remove crap we don't need from color palette
 */
const trimColorPalette = ({ colorPalette }) => {
  return Object.entries(colorPalette).reduce((acc, [key, value]) => {
    acc[key] = value?.rgb || undefined;
    return acc;
  }, {});
};

module.exports();

export interface FetchPokemonDetailsDTO {
  id: string;
  slug: string;
  types: string[];
  height: number;
  weight: number;
  stats: Stat[];
  previousPokemon?: SlimPokemonDetails;
  nextPokemon?: SlimPokemonDetails;
  flavorText: string;
  colorPalette: ColorPalette;
  weaknesses: { slug: string; factor: number }[];
  evolutionChain: Array<EvolutionChainItem[]>;
}

interface ColorPalette {
  Vibrant: number[];
  DarkVibrant: number[];
  LightVibrant: number[];
  Muted: number[];
  DarkMuted: number[];
  LightMuted: number[];
}

interface Stat {
  base: string;
  name: string;
}

export interface EvolutionChainItem {
  id: string;
  slug: string;
}

interface SlimPokemonDetails {
  id: string;
  slug: string;
}

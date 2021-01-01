export interface FetchPokemonDetailsDTO {
  id: string;
  slug: string;
  types: string[];
  height: number;
  weight: number;
  stats: Stat[];
  previousPokemon: string;
  nextPokemon: string;
  flavorText: string;
  colorPalette: ColorPalette;
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

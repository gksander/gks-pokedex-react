export interface FetchPokemonListDTO {
  pageInfo: PageInfo;
  pokemon: Pokemon[];
}

interface PageInfo {
  page: number;
  pageSize: number;
  totalNumPages: number;
  totalNumPokemon: number;
}

interface Pokemon {
  id: string;
  name: string;
  slug: string;
  flavorText: string;
  colorPalette: ColorPalette;
  types: string[];
}

interface ColorPalette {
  Vibrant: number[];
  DarkVibrant: number[];
  LightVibrant: number[];
  Muted: number[];
  DarkMuted: number[];
  LightMuted: number[];
}

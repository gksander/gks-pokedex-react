export interface FetchTypeDetailsDTO {
  slug: string;
  pokemon: Pokemon[];
  efficacyTo: Efficacy[];
  efficacyFrom: Efficacy[];
}

interface Efficacy {
  type: string;
  factor: number;
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

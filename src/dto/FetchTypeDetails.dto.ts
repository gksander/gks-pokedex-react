export interface FetchTypeDetailsDTO {
  slug: string;
  pokemon: string[];
  efficacyTo: Efficacy[];
  efficacyFrom: Efficacy[];
}

interface Efficacy {
  type: string;
  factor: number;
}

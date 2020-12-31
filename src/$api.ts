import { FetchPokemonListDTO } from "./dto/FetchPokemonList.dto";
import { FetchPokemonDetailsDTO } from "./dto/FetchPokemonDetails.dto";
import { FetchSearchListDTO } from "./dto/FetchSearchList.dto";
import { FetchTypesListDTO } from "./dto/FetchTypesList.dto";
import { FetchTypeDetailsDTO } from "./dto/FetchTypeDetails.dto";

/**
 * Data fetching
 */
class API {
  fetchPokemonList = ({ pageParam = 1 }): Promise<FetchPokemonListDTO> =>
    fetch(`/data/pokemon/list/${pageParam}.json`).then((res) => res.json());

  fetchPokemonDetails = ({ slug = "" }): Promise<FetchPokemonDetailsDTO> =>
    fetch(`/data/pokemon/details/${slug}.json`).then((res) => res.json());

  fetchSearchList = (): Promise<FetchSearchListDTO> =>
    fetch(`/data/search/index.json`).then((res) => res.json());

  fetchTypesList = (): Promise<FetchTypesListDTO> =>
    fetch(`/data/types/index.json`).then((res) => res.json());

  fetchTypeDetails = ({ slug = "" }): Promise<FetchTypeDetailsDTO> =>
    fetch(`/data/types/${slug}.json`).then((res) => res.json());
}

export const $api = new API();

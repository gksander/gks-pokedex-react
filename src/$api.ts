/**
 * API fetching class
 */
import { FetchPokemonListDTO } from "./dto/FetchPokemonList.dto";

class API {
  fetchPokemonList = ({ pageParam = 1 }): Promise<FetchPokemonListDTO> =>
    fetch(`/data/pokemon/list/${pageParam}.json`).then((res) => res.json());
}

export const $api = new API();

import * as React from "react";
import { useQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { Link } from "react-router-dom";
import { PokeImg } from "../components/PokeImg";
import { FaChevronRight } from "react-icons/all";
import { useTitle } from "react-use";
import { ViewWrapper } from "../components/ViewWrapper";

type SearchViewProps = {};

export const SearchView: React.FC<SearchViewProps> = () => {
  useTitle("GKS Pokedex - Search");
  const { data } = useQuery(QUERY_CACHE_KEYS.SEARCH_LIST, $api.fetchSearchList);

  const [query, setQuery] = React.useState("");
  const filteredPokemon = React.useMemo(() => {
    const reg = new RegExp(query, "i");
    return (data || []).filter((p) => reg.test(p.slug)).slice(0, 10);
  }, [data, query]);

  return (
    <ViewWrapper>
      <div className="container max-w-2xl px-2 py-6">
        <div className="text-5xl font-fancy mb-6">Search for a Pokemon</div>
        <div className="border-2 border-gray-800 rounded">
          <input
            type="text"
            className="p-3 w-full text-xl outline-none"
            placeholder="Mew"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {filteredPokemon.map((p) => (
            <Link
              to={`/${p.slug}`}
              className="block p-3 flex items-center hover:bg-primary-100 transition-colors duration-150"
              key={p.slug}
            >
              <div className="flex-grow flex items-center">
                <div className="w-8 mr-3">
                  <div className="w-full">
                    <PokeImg
                      slug={p.slug}
                      id={p.id}
                      imgClassName="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="font-bold text-gray-700 capitalize">
                  #{p.id} - {p.slug}
                </div>
              </div>
              <FaChevronRight />
            </Link>
          ))}
        </div>
      </div>
    </ViewWrapper>
  );
};

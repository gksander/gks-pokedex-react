import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import { Link } from "react-router-dom";

type HomeViewProps = {};

export const HomeView: React.FC<HomeViewProps> = () => {
  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    QUERY_CACHE_KEYS.POKE_LIST,
    $api.fetchPokemonList,
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.pageInfo.page < lastPage.pageInfo.totalNumPages
          ? lastPage.pageInfo?.page + 1
          : false;
      },
    },
  );

  // Aggregated pokemon
  const pokemon = React.useMemo(
    () =>
      (data?.pages || []).reduce(
        (acc, page) => acc.concat(page?.pokemon || []),
        [] as FetchPokemonListDTO["pokemon"],
      ),
    [data?.pages],
  );

  if (status === "loading") {
    return (
      <div>
        <p>LOADING!</p>
      </div>
    );
  }

  return (
    <div>
      {pokemon.map((p) => (
        <div key={p.id} className="border-2 mb-4 p-4">
          <Link className="font-bold" to={`/${p.slug}`}>
            {p.slug}
          </Link>
        </div>
      ))}
      <div>
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Fetch more!
        </button>
      </div>
    </div>
  );

  return <p>Home view!</p>;
};

import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import { PokeListCard } from "../components/PokeListCard";
import { useInView } from "react-intersection-observer";
import { useTitle } from "react-use";
import { ViewWrapper } from "../components/ViewWrapper";

type HomeViewProps = {};

export const HomeView: React.FC<HomeViewProps> = () => {
  useTitle("GKS Pokedex - Home");
  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(QUERY_CACHE_KEYS.POKE_LIST, $api.fetchPokemonList, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pageInfo.page < lastPage.pageInfo.totalNumPages
        ? lastPage.pageInfo?.page + 1
        : undefined;
    },
  });

  // Aggregated pokemon
  const pokemon = React.useMemo(
    () =>
      (data?.pages || []).reduce(
        (acc, page) => acc.concat(page?.pokemon || []),
        [] as FetchPokemonListDTO["pokemon"],
      ),
    [data?.pages],
  );

  const { inView, ref } = useInView();
  React.useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, isFetchingNextPage]);

  return (
    <ViewWrapper>
      <div className="mb-12">
        <div className="text-5xl font-fancy">Grant's Pokedex</div>
        <div>
          A list of all pokemon (through generation 5), proudly powered by{" "}
          <a
            href="https://github.com/PokeAPI/pokeapi"
            target="_blank"
            rel="noreferrer"
            className="text-primary-800"
          >
            the Open PokeAPI
          </a>{" "}
          and{" "}
          <a
            href="https://veekun.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary-800"
          >
            Veekun
          </a>
          . Built with{" "}
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noreferrer"
            className="text-primary-800"
          >
            React.JS
          </a>{" "}
          and styled with the almighty{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noreferrer"
            className="text-primary-800"
          >
            TailwindCSS
          </a>
          . Check out{" "}
          <a
            href="https://github.com/gksander/gks-pokedex-react"
            target="_blank"
            rel="noreferrer"
            className="text-primary-800"
          >
            the source code
          </a>{" "}
          on GitHub. This is a pet project, and I claim no commercial or
          intellectual rights to any of the Pokemon-specific resources (such as
          data or images) used here.
        </div>
      </div>
      {status === "loading" ? (
        <p>Loading</p>
      ) : (
        <React.Fragment>
          <div className="grid gap-16">
            {pokemon.map((p) => (
              <PokeListCard key={p.id} pokemon={p} />
            ))}
          </div>
          <div>
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Fetch more!
            </button>
          </div>
          {isFetchingNextPage && (
            <div>
              <div className="text-2xl">LOADING MORE</div>
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </React.Fragment>
      )}
    </ViewWrapper>
  );
};

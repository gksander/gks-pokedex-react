import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import { PokeListCard } from "../components/PokeListCard";
import { useInView } from "react-intersection-observer";
import { useTitle } from "react-use";
import { ViewWrapper } from "../components/ViewWrapper";
import { LoadingIndicator } from "../components/LoadingIndicator";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "framer-motion";

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
      <AnimatePresence exitBeforeEnter initial={false}>
        {status === "loading" ? (
          <motion.div
            className="grid gap-16"
            variants={variants}
            initial="out"
            animate="in"
            exit="out"
            key="skeleton"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton height={160} width="100%" key={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="out"
            animate="in"
            variants={{
              in: {
                transition: {
                  staggerChildren: 0.25,
                },
              },
            }}
            key="list"
          >
            <div className="grid gap-16">
              {pokemon.map((p) => (
                <motion.div
                  variants={{
                    out: {
                      y: 5,
                      opacity: 0,
                    },
                    in: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                >
                  <PokeListCard key={p.id} pokemon={p} />
                </motion.div>
              ))}
            </div>
            {isFetchingNextPage && <LoadingIndicator />}
            {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
          </motion.div>
        )}
      </AnimatePresence>
    </ViewWrapper>
  );
};

const variants = {
  in: { opacity: 1, transition: { duration: 0.3 } },
  out: { opacity: 0, transition: { duration: 0.2 } },
};

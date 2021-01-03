import * as React from "react";
import { useQuery, useQueryClient } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import { PokeListCard } from "../components/PokeListCard";
import { useKey, useTitle } from "react-use";
import { ViewWrapper } from "../components/ViewWrapper";
import Skeleton from "react-loading-skeleton";
import {
  AnimatePresence,
  motion,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { Link, useHistory, useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/all";
import classNames from "classnames";

type HomeViewProps = {};

export const HomeView: React.FC<HomeViewProps> = () => {
  useTitle("GKS Pokedex - Home");
  const { page = "1" } = useParams<{ page: string }>();
  const currentPage = Number(page);

  const { status, data, isPreviousData } = useQuery(
    [QUERY_CACHE_KEYS.POKE_LIST, currentPage],
    () => $api.fetchPokemonList({ page: currentPage }),
    {
      keepPreviousData: true,
    },
  );

  // Helpers
  usePreloadPages({ data });
  useBindKeyHandlers({ data });
  const paginationDetails = usePaginationDetails({ data, currentPage });

  const pokemon = isPreviousData ? [] : data?.pokemon || [];
  const totalNumPages = data?.pageInfo?.totalNumPages || 1;
  const { scrollYProgress } = useViewportScroll();
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <ViewWrapper>
      <AnimatePresence initial={false}>
        {currentPage === 1 && (
          <motion.div
            variants={{
              in: { opacity: 1, height: "auto" },
              out: { opacity: 0, height: 0 },
            }}
            initial="out"
            animate="in"
            exit="out"
          >
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
              intellectual rights to any of the Pokemon-specific resources (such
              as data or images) used here.
            </div>
            <div className="h-12" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter initial={false}>
        {pokemon.length === 0 ? (
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
            exit="out"
            variants={{
              in: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            key={`page-${currentPage}`}
          >
            <div className="grid gap-16">
              {pokemon.map((p) => (
                <motion.div
                  variants={{
                    out: {
                      y: 5,
                      opacity: 0,
                      transition: { duration: 0.05 },
                    },
                    in: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                  key={p.slug}
                >
                  <PokeListCard key={p.id} pokemon={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-12" />
      <div className="sticky bottom-0 py-1 bg-white border-t flex items-center">
        {/* Bottom progress */}
        {/*<motion.div*/}
        {/*  className="absolute left-0 bottom-0 bg-primary-500 h-1"*/}
        {/*  style={{ width: barWidth }}*/}
        {/*/>*/}

        {(() => {
          const isDisabled = currentPage < 2;

          return (
            <Link
              to={
                isDisabled
                  ? ""
                  : currentPage === 2
                  ? "/"
                  : `/page/${currentPage - 1}`
              }
              className={classNames(
                "flex items-center rounded py-2 px-3 ",
                isDisabled
                  ? "disabled cursor-not-allowed text-gray-500"
                  : "hover:bg-gray-100 cursor-pointer",
              )}
            >
              <FaChevronLeft />
              <span className="w-1" />
              <span>Previous</span>
            </Link>
          );
        })()}
        <div className="flex-grow text-sm flex justify-center">
          <div className="flex flex-col">
            <div>
              #{paginationDetails.minId} - #{paginationDetails.maxId}
              <span className="hidden sm:inline">
                {" "}
                of #{paginationDetails.numPokemon}
              </span>
            </div>
            <motion.div
              className="bg-primary-600 h-1 rounded-full"
              style={{ width: barWidth }}
            />
          </div>
        </div>
        {(() => {
          const isDisabled =
            isPreviousData ||
            status === "loading" ||
            currentPage === totalNumPages;
          return (
            <Link
              to={isDisabled ? "" : `/page/${currentPage + 1}`}
              className={classNames(
                "flex items-center rounded py-2 px-3 hover:bg-gray-100",
                isDisabled
                  ? "disabled cursor-not-allowed text-gray-500"
                  : "hover:bg-gray-100 cursor-pointer",
              )}
            >
              <span>Next</span>
              <span className="w-1" />
              <FaChevronRight />
            </Link>
          );
        })()}
      </div>
    </ViewWrapper>
  );
};

const variants = {
  in: { opacity: 1, transition: { duration: 0.3 } },
  out: { opacity: 0, transition: { duration: 0.2 } },
};

const usePreloadPages = ({ data }: { data?: FetchPokemonListDTO }) => {
  const currentPage = data?.pageInfo?.page;
  const totalNumPages = data?.pageInfo?.totalNumPages;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!currentPage || !totalNumPages) return;

    if (currentPage > 1) {
      queryClient.prefetchQuery(
        [QUERY_CACHE_KEYS.POKE_LIST, currentPage - 1],
        () => $api.fetchPokemonList({ page: currentPage - 1 }),
      );
    }

    if (currentPage < totalNumPages) {
      queryClient.prefetchQuery(
        [QUERY_CACHE_KEYS.POKE_LIST, currentPage + 1],
        () => $api.fetchPokemonList({ page: currentPage + 1 }),
      );
    }
  }, [currentPage, queryClient, totalNumPages]);
};

const usePaginationDetails = ({
  data,
  currentPage,
}: {
  data?: FetchPokemonListDTO;
  currentPage: number;
}) => {
  const numPokemon = data?.pageInfo?.totalNumPokemon || 150;
  const pageSize = data?.pageInfo?.pageSize || 50;
  const minId = (currentPage - 1) * pageSize + 1;
  const maxId = currentPage * pageSize;

  return { minId, maxId, numPokemon };
};

const useBindKeyHandlers = ({ data }: { data?: FetchPokemonListDTO }) => {
  const currentPage = data?.pageInfo?.page;
  const totalNumPages = data?.pageInfo?.totalNumPages;
  const history = useHistory();

  const goPrev = () => {
    if (currentPage && currentPage > 1) {
      history.push(currentPage === 2 ? "/" : `/page/${currentPage - 1}`);
    }
  };
  useKey("ArrowLeft", goPrev, {}, [currentPage]);

  const goNext = () => {
    if (currentPage && totalNumPages && currentPage < totalNumPages) {
      history.push(`/page/${currentPage + 1}`);
    }
  };
  useKey("ArrowRight", goNext, {}, [currentPage]);
};

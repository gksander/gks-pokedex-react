import * as React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import tinycolor from "tinycolor2";
import { $api } from "../$api";
import { setBackgroundColor } from "../utils/setBackgroundColor";
import { PokeTypeChip } from "../components/PokeTypeChip";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaRuler,
  FaWeight,
} from "react-icons/all";
import { FetchPokemonDetailsDTO } from "../dto/FetchPokemonDetails.dto";
import { PokeImg } from "../components/PokeImg";
import { PokeStatChart } from "../components/PokeStatChart";
import { useKey, useTitle } from "react-use";
import classNames from "classnames";
import { ViewWrapper } from "../components/ViewWrapper";
import { AnimatePresence, motion } from "framer-motion";

type PokemonDetailsViewProps = {};

export const PokemonDetailsView: React.FC<PokemonDetailsViewProps> = () => {
  const { pokemonSlug } = useParams<{ pokemonSlug: string }>();
  useTitle(`Pokemon: ${pokemonSlug}`);

  const { data } = useQuery(pokemonSlug, () =>
    $api.fetchPokemonDetails({ slug: pokemonSlug }),
  );

  // Colors
  const color = useColor({ data });
  const bgColor = useBackgroundColor({ data });
  useSetBackgroundColor(bgColor);

  return (
    <ViewWrapper>
      <div>
        <div className="container max-w-2xl py-6 px-2">
          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <div
                className="w-3/4 sm:w-full relative mx-auto"
                style={{ paddingTop: "100%" }}
              >
                <div className="absolute inset-0">
                  <AnimatePresence exitBeforeEnter initial={false}>
                    <motion.div
                      key={data?.slug}
                      variants={{
                        in: { opacity: 1, transition: { duration: 0.2 } },
                        out: { opacity: 0, transition: { duration: 0.15 } },
                      }}
                      initial="out"
                      animate="in"
                      exit="out"
                    >
                      <PokeImg
                        slug={data?.slug || ""}
                        id={data?.id || ""}
                        imgClassName="w-full h-full object-contain"
                        imgStyle={{
                          filter:
                            "drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div
                  className="absolute left-0 bottom-0 text-6xl text-gray-700 font-fancy font-thin"
                  style={{
                    color,
                    filter: `drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))`,
                  }}
                >
                  #{data?.id}
                </div>
              </div>
            </div>
            <div>
              <div className="text-6xl leading-snug capitalize">
                {pokemonSlug}
              </div>
              {/* Types */}
              <div className="flex -mx-1 mb-3">
                {(data?.types || []).map((slug) => (
                  <div className="mx-1" key={slug}>
                    <PokeTypeChip slug={slug} />
                  </div>
                ))}
              </div>
              {/* Weight/height */}
              <div className="flex mb-2 text-gray-800">
                <div className="mr-5 flex items-center">
                  <span className="mr-2">
                    <FaRuler />
                  </span>
                  <span className="">{data?.height} ft</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">
                    <FaWeight />
                  </span>
                  <span className="">{data?.weight} lbs</span>
                </div>
              </div>
              {/*	Description */}
              <div className="text-gray-800 mb-4">{data?.flavorText}</div>
              <div className="text-xl font-bold">Weaknesses</div>
              <div className="flex flex-wrap">
                {(data?.weaknesses || []).map(({ factor, slug }) => (
                  <div className="mr-1 mb-1" key={slug}>
                    <PokeTypeChip slug={slug} isSmall isStarred={factor > 2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-12" />
          <div className="grid sm:grid-cols-4 gap-12">
            <div>
              <div className="text-xl font-bold mb-4">Stats</div>
              <div className="w-32 mx-auto">
                <div className="w-full relative" style={{ paddingTop: "100%" }}>
                  <div className="absolute inset-0 text-gray-700">
                    {data?.stats?.length && (
                      <PokeStatChart
                        stats={data.stats}
                        color={color}
                        bgColor={bgColor}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <EvolutionChain data={data} />
          </div>
          <div className="mb-12" />
          {/* Links */}
          <BottomLinks data={data} />
        </div>
      </div>
    </ViewWrapper>
  );
};

/**
 * Evolution chain UI
 */
const EV_SIZE = "100px";
const EvolutionChain: React.FC<{ data?: FetchPokemonDetailsDTO }> = ({
  data,
}) => {
  if ((data?.evolutionChain?.length || 0) <= 1) return null;

  const buckets = data?.evolutionChain || [];

  return (
    <div className="sm:col-span-3 flex flex-col">
      <div className="text-xl font-bold mb-4">Evolutions</div>
      <div className="flex gap-2 flex-col sm:flex-row items-center flex-grow">
        {buckets.map((bucket, i) => (
          <React.Fragment key={i}>
            <div
              style={{ width: EV_SIZE, height: EV_SIZE }}
              className="overflow-y-auto overflow-x-hidden grid gap-2"
            >
              {bucket.map((item, j) => (
                <Link
                  to={`/${item.slug}`}
                  className="block relative transition-all duration-300 flex flex-col evLink"
                  style={{
                    width: EV_SIZE,
                    height: EV_SIZE,
                  }}
                  key={j}
                >
                  <div className="flex-grow relative">
                    <div className="absolute inset-0 evImg transition-all duration-200">
                      <PokeImg {...item} />
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "text-center text-gray-700 overflow-hidden whitespace-no-wrap capitalize",
                      item.slug === data?.slug && "font-bold text-gray-900",
                    )}
                    style={{
                      maxWidth: EV_SIZE,
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.slug}
                  </div>
                </Link>
              ))}
            </div>
            {i < buckets.length - 1 && (
              <div className="flex p-2 items-center">
                <FaChevronRight className="hidden sm:block" />
                <FaChevronDown className="block sm:hidden" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * Bottom links, with pre-loading
 */
const BottomLinks: React.FC<{ data?: FetchPokemonDetailsDTO }> = ({ data }) => {
  const prevLink = `/${data?.previousPokemon?.slug || ""}`;
  const nextLink = `/${data?.nextPokemon?.slug || ""}`;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (data?.previousPokemon) {
      queryClient.prefetchQuery(data.previousPokemon.slug, () =>
        $api.fetchPokemonDetails({ slug: data.previousPokemon?.slug }),
      );
    }

    if (data?.nextPokemon) {
      queryClient.prefetchQuery(data.nextPokemon.slug, () =>
        $api.fetchPokemonDetails({ slug: data.nextPokemon?.slug }),
      );
    }
  }, [data, queryClient]);

  const history = useHistory();
  const goNext = React.useCallback(() => history.push(nextLink), [
    history,
    nextLink,
  ]);
  const goPrev = React.useCallback(() => history.push(prevLink), [
    history,
    prevLink,
  ]);
  useKey("ArrowRight", goNext, {}, [goNext]);
  useKey("ArrowLeft", goPrev, {}, [goPrev]);

  return (
    <div
      className="flex justify-between text-sm text-gray-700 sticky bottom-0 py-3 border-t"
      style={{
        backgroundColor: "var(--background-color)",
      }}
    >
      <Link
        to={prevLink}
        className="border-2 w-36 rounded flex justify-center items-center border-gray-700 hover:font-bold"
      >
        <span className="p-2 pr-0">
          <FaChevronLeft />
        </span>
        <span className="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap capitalize">
          {data?.previousPokemon?.slug || "Pokedex"}
        </span>
        {Boolean(data?.previousPokemon?.id) && (
          <span className="w-8 p-2 pl-0">
            <PokeImg
              slug={data?.previousPokemon?.slug || ""}
              id={data?.previousPokemon?.id || ""}
            />
          </span>
        )}
      </Link>
      <Link
        to={nextLink}
        className="border-2 w-36 rounded flex justify-center items-center border-gray-700 hover:font-bold"
      >
        {Boolean(data?.nextPokemon?.id) && (
          <span className="w-8 p-2 pr-0">
            <PokeImg
              slug={data?.nextPokemon?.slug || ""}
              id={data?.nextPokemon?.id || ""}
            />
          </span>
        )}
        <span className="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap capitalize">
          {data?.nextPokemon?.slug || "Pokedex"}
        </span>
        <span className="p-2 pl-0">
          <FaChevronRight />
        </span>
      </Link>
    </div>
  );
};

const useColor = ({ data }: { data?: FetchPokemonDetailsDTO }) => {
  return React.useMemo(() => {
    const [r, g, b] = data?.colorPalette?.LightVibrant ||
      data?.colorPalette?.Vibrant ||
      data?.colorPalette?.LightMuted || [200, 200, 200];

    return `rgb(${r}, ${g}, ${b})`;
  }, [data]);
};

const useBackgroundColor = ({ data }: { data?: FetchPokemonDetailsDTO }) => {
  return React.useMemo(() => {
    if (!data) return "";

    const [r, g, b] = data?.colorPalette?.LightVibrant ||
      data?.colorPalette?.Vibrant ||
      data?.colorPalette?.LightMuted || [200, 200, 200];

    return tinycolor.mix(`rgb(${r}, ${g}, ${b})`, "white", 80).toRgbString();
  }, [data]);
};

const useSetBackgroundColor = (bgColor = "") => {
  React.useEffect(() => {
    if (bgColor) {
      setBackgroundColor(bgColor);
    }
  }, [bgColor]);
};

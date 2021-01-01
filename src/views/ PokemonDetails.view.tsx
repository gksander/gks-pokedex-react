import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import tinycolor from "tinycolor2";
import { $api } from "../$api";
import { setBackgroundColor } from "../utils/setBackgroundColor";
import { PokeTypeChip } from "../components/PokeTypeChip";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRuler,
  FaWeight,
} from "react-icons/all";
import { FetchPokemonDetailsDTO } from "../dto/FetchPokemonDetails.dto";
import { PokeImg } from "../components/PokeImg";
import { PokeStatChart } from "../components/PokeStatChart";

type PokemonDetailsViewProps = {};

export const PokemonDetailsView: React.FC<PokemonDetailsViewProps> = () => {
  const { pokemonSlug } = useParams<{ pokemonSlug: string }>();
  const { status, data } = useQuery(pokemonSlug, () =>
    $api.fetchPokemonDetails({ slug: pokemonSlug }),
  );

  // Colors
  const color = useColor({ data });
  const bgColor = useBackgroundColor({ data });
  useSetBackgroundColor(bgColor);

  if (status === "loading") {
    return (
      <div>
        <p>LOADING!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container max-w-2xl py-6 px-2">
        <div className="grid sm:grid-cols-2 gap-12">
          {/* S TODO: Image */}
          <div>
            <div
              className="w-3/4 sm:w-full relative mx-auto"
              style={{ paddingTop: "100%" }}
            >
              <div className="absolute inset-0">
                <PokeImg
                  slug={data?.slug || ""}
                  id={data?.id || ""}
                  imgClassName="w-full h-full object-contain"
                  imgStyle={{
                    filter: "drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))",
                  }}
                />
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
            {/* S TODO: Weaknesses */}
            <div className="text-xl font-bold">Weaknesses</div>
            <div className="flex flex-wrap">
              {["normal"].map((slug) => (
                <div className="mr-1 mb-1">
                  <PokeTypeChip slug={slug} isSmall isStarred={true} />
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
          {/* S TODO: Evolutions */}
          <div className="sm:col-span-3 flex flex-col">
            <div className="text-xl font-bold mb-4">Evolutions</div>
          </div>
        </div>
        <div className="mb-12" />
        {/* Links */}
        <BottomLinks data={data} />
      </div>
    </div>
  );
};

/**
 * Bottom links, with pre-loading
 */
const BottomLinks: React.FC<{ data?: FetchPokemonDetailsDTO }> = ({ data }) => {
  const prevLink = `/${data?.previousPokemon || ""}`;
  const nextLink = `/${data?.nextPokemon || ""}`;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (data?.previousPokemon) {
      queryClient.prefetchQuery(data.previousPokemon, () =>
        $api.fetchPokemonDetails({ slug: data.previousPokemon }),
      );
    }

    if (data?.nextPokemon) {
      queryClient.prefetchQuery(data.nextPokemon, () =>
        $api.fetchPokemonDetails({ slug: data.nextPokemon }),
      );
    }
  }, [data, queryClient]);

  return (
    <div className="flex justify-between text-sm text-gray-700">
      <Link
        to={prevLink}
        className="border-2 w-32 rounded flex justify-center items-center border-gray-700 hover:font-bold"
      >
        <span className="p-2 pr-0">
          <FaChevronLeft />
        </span>
        <span className="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap capitalize">
          {data?.previousPokemon || "Pokedex"}
        </span>
      </Link>
      <Link
        to={nextLink}
        className="border-2 w-32 rounded flex justify-center items-center border-gray-700 hover:font-bold"
      >
        <span className="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap capitalize">
          {data?.nextPokemon || "Pokedex"}
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

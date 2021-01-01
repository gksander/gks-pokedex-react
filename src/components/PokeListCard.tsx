import * as React from "react";
import { Link } from "react-router-dom";
import styles from "./PokeListCard.module.css";
import { Pokeball } from "./Pokeball";
import { PokeImg } from "./PokeImg";
import { PokeTypeChip } from "./PokeTypeChip";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import { FetchPokemonDetailsDTO } from "../dto/FetchPokemonDetails.dto";
import classNames from "classnames";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { $api } from "../$api";
import { useInView } from "react-intersection-observer";

type PokeListCardProps = {
  isLoading?: boolean;
  slug?: string;
  pokemon?: FetchPokemonListDTO["pokemon"][number] | FetchPokemonDetailsDTO;
};

export const PokeListCard = React.forwardRef<HTMLDivElement, PokeListCardProps>(
  ({ isLoading, pokemon, slug }, ref) => {
    const pokeballColor = (() => {
      const rgb =
        pokemon?.colorPalette?.LightMuted ||
        pokemon?.colorPalette?.LightVibrant;
      return rgb
        ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
        : `rgba(0,0,0, 0.5)`;
    })();

    return (
      <div
        className="grid sm:grid-cols-4 gap-6 card transition-all duration-300"
        ref={ref}
      >
        <div className="sm:col-span-1 flex justify-center">
          <div className={classNames("w-56 sm:w-full", styles.pokeImg)}>
            <div className="relative " style={{ paddingTop: "100%" }}>
              <div className="absolute inset-0">
                {isLoading ? (
                  <Skeleton circle={true} width="100%" height="100%" />
                ) : (
                  <React.Fragment>
                    <div className="p-2" style={{ color: pokeballColor }}>
                      <Pokeball
                        className={classNames(
                          "transition-all duration-300",
                          styles.pokeball,
                        )}
                      />
                    </div>
                    <Link to={`/${pokemon?.slug}`} className="absolute inset-0">
                      <PokeImg
                        id={pokemon?.id || ""}
                        slug={pokemon?.slug || ""}
                      />
                    </Link>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3 sm:pt-3">
          <div className="flex justify-between items-baseline">
            <Link
              to={`/${pokemon?.slug || slug}`}
              className="capitalize font-bold text-2xl text-gray-800 hover:text-primary-800 transition-colors duration-150"
            >
              {pokemon?.slug || slug}
            </Link>
            {pokemon?.id && (
              <span className="text-gray-600 text-xl font-bold">
                #{pokemon?.id}
              </span>
            )}
          </div>
          <div className="text-gray-700 mb-2">
            {pokemon?.flavorText || <Skeleton />}
          </div>
          {isLoading ? (
            <Skeleton />
          ) : (
            <div className="-mx-1">
              {(pokemon?.types || []).map((slug) => (
                <span key={slug} className="mx-1">
                  <PokeTypeChip slug={slug} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

/**
 * Lazy version of poke list card...
 */
type LazyPokeListCardProps = {
  slug: string;
};
export const LazyPokeListCard: React.FC<LazyPokeListCardProps> = ({ slug }) => {
  const { inView, ref } = useInView();

  const { data, isLoading } = useQuery(
    slug,
    () => $api.fetchPokemonDetails({ slug }),
    {
      enabled: inView,
    },
  );

  return (
    <PokeListCard isLoading={isLoading} pokemon={data} ref={ref} slug={slug} />
  );
};

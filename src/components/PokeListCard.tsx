import * as React from "react";
import { Link } from "react-router-dom";
import styles from "./PokeListCard.module.css";
import { Pokeball } from "./Pokeball";
import { PokeImg } from "./PokeImg";
import { PokeTypeChip } from "./PokeTypeChip";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import { FetchPokemonDetailsDTO } from "../dto/FetchPokemonDetails.dto";
import classNames from "classnames";

type PokeListCardProps = {
  isLoading?: boolean;
  pokemon?: FetchPokemonListDTO["pokemon"][number] | FetchPokemonDetailsDTO;
};

export const PokeListCard: React.FC<PokeListCardProps> = ({
  isLoading,
  pokemon,
}) => {
  const pokeballColor = (() => {
    const rgb =
      pokemon?.colorPalette?.LightMuted || pokemon?.colorPalette?.LightVibrant;
    return rgb
      ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
      : `rgba(0,0,0, 0.5)`;
  })();

  return (
    <div className="grid sm:grid-cols-4 gap-6 card transition-all duration-300">
      <div className="sm:col-span-1 flex justify-center">
        <div className={classNames("w-56 sm:w-full", styles.pokeImg)}>
          <div className="relative " style={{ paddingTop: "100%" }}>
            <div className="absolute inset-0">
              <div className="p-2" style={{ color: pokeballColor }}>
                <Pokeball
                  className={classNames(
                    "transition-all duration-300",
                    styles.pokeball,
                  )}
                />
              </div>
              <Link to={`/${pokemon?.slug}`} className="absolute inset-0">
                <PokeImg id={pokemon?.id || ""} slug={pokemon?.slug || ""} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:col-span-3 sm:pt-3">
        <div className="flex justify-between items-baseline">
          <Link
            to={`/${pokemon?.slug}`}
            className="capitalize font-bold text-2xl text-gray-800 hover:text-primary-800 transition-colors duration-150"
          >
            {pokemon?.slug}
          </Link>
          <span className="text-gray-600 text-xl font-bold">
            #{pokemon?.id}
          </span>
        </div>
        <div className="text-gray-700 mb-2">{pokemon?.flavorText}</div>
        <div className="-mx-1">
          {(pokemon?.types || []).map((slug) => (
            <span key={slug} className="mx-1">
              <PokeTypeChip slug={slug} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

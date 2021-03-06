import * as React from "react";
import { Link } from "react-router-dom";
import { Pokeball } from "./Pokeball";
import { PokeImg } from "./PokeImg";
import { PokeTypeChip } from "./PokeTypeChip";
import { FetchPokemonListDTO } from "../dto/FetchPokemonList.dto";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import { FetchTypeDetailsDTO } from "../dto/FetchTypeDetails.dto";

type PokeListCardProps = {
  pokemon?:
    | FetchPokemonListDTO["pokemon"][number]
    | FetchTypeDetailsDTO["pokemon"][number];
};

export const PokeListCard = React.forwardRef<HTMLDivElement, PokeListCardProps>(
  ({ pokemon }, ref) => {
    const pokeballColor = (() => {
      const rgb =
        pokemon?.colorPalette?.LightMuted ||
        pokemon?.colorPalette?.LightVibrant;
      return rgb
        ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
        : `rgba(0,0,0, 0.5)`;
    })();

    return (
      <motion.div
        className="grid sm:grid-cols-4 gap-6 card transition-all duration-300"
        ref={ref}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <div className="sm:col-span-1 flex justify-center">
          <div className="w-56 sm:w-full">
            <div className="relative " style={{ paddingTop: "100%" }}>
              <motion.div className="absolute inset-0">
                <div className="p-2" style={{ color: pokeballColor }}>
                  <motion.div
                    variants={{
                      rest: {
                        scale: 1,
                        rotate: 0,
                        filter: "brightness(0) opacity(0.3)",
                      },
                      hover: {
                        scale: 1.2,
                        rotate: 180,
                        filter: "brightness(1) opacity(1)",
                      },
                    }}
                  >
                    <Pokeball />
                  </motion.div>
                </div>
                <Link to={`/${pokemon?.slug}`} className="absolute inset-0">
                  <PokeImg id={pokemon?.id || ""} slug={pokemon?.slug || ""} />
                </Link>
              </motion.div>
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
            {pokemon?.id && (
              <span className="text-gray-600 text-xl font-bold">
                #{pokemon?.id}
              </span>
            )}
          </div>
          <div className="text-gray-700 mb-2">
            {pokemon?.flavorText || <Skeleton />}
          </div>
          <div className="-mx-1">
            {(pokemon?.types || []).map((slug) => (
              <span key={slug} className="mx-1">
                <PokeTypeChip slug={slug} />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  },
);

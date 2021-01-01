import * as React from "react";
import { Link } from "react-router-dom";
import { Pokeball } from "./Pokeball";
import { PokeImg } from "./PokeImg";
import { PokeTypeChip } from "./PokeTypeChip";

type PokeListCardProps = {
  isLoading?: boolean;
  id?: string;
  slug?: string;
  flavorText?: string;
  types?: string[];
};

export const PokeListCard: React.FC<PokeListCardProps> = ({
  isLoading,
  id,
  slug,
  flavorText,
  types,
}) => {
  return (
    <div className="grid sm:grid-cols-4 gap-6 card transition-all duration-300">
      <div className="sm:col-span-1 flex justify-center">
        <div className="relative w-full" style={{ paddingTop: "100%" }}>
          <div className="absolute inset-0">
            <div
              className="p-2"
              style={{
                color: "red", // TODO: Color this...
              }}
            >
              <Pokeball className="pokeball transition-all duration-300" />
            </div>
            <Link to={`/${slug}`} className="absolute inset-0">
              <PokeImg id={id || ""} slug={slug || ""} />
            </Link>
          </div>
        </div>
      </div>
      <div className="sm:col-span-3 sm:pt-3">
        <div className="flex justify-between items-baseline">
          <Link
            to={`/${slug}`}
            className="capitalize font-bold text-2xl text-gray-800 hover:text-primary-800 transition-colors duration-150"
          >
            {slug}
          </Link>
          <span className="text-gray-600 text-xl font-bold">#{id}</span>
        </div>
        <div className="text-gray-700 mb-2">{flavorText}</div>
        <div className="-mx-1">
          {(types || []).map((slug) => (
            <span key={slug} className="mx-1">
              <PokeTypeChip slug={slug} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

import * as React from "react";
import { useQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { PokeTypeChip } from "../components/PokeTypeChip";
import { useTitle } from "react-use";
import { ViewWrapper } from "../components/ViewWrapper";

type TypesViewProps = {};

export const TypesView: React.FC<TypesViewProps> = () => {
  useTitle("GKS Pokedex - Types");
  const { status, data } = useQuery(
    QUERY_CACHE_KEYS.TYPES_LIST,
    $api.fetchTypesList,
  );

  return (
    <ViewWrapper>
      <div className="container max-w-2xl py-6 px-2">
        <div className="text-3xl font-bold">Types</div>
        <div className="mb-4 text-gray-700">
          Select a type to learn more about it.
        </div>
        {status === "loading" ? (
          // S TODO: Better indicator
          <span>Loading</span>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(data || []).map((type) => (
              <PokeTypeChip slug={type.slug} isBlock key={type.slug} />
            ))}
          </div>
        )}
      </div>
    </ViewWrapper>
  );
};

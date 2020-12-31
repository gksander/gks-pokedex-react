import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { $api } from "../$api";

type PokemonDetailsViewProps = {};

export const PokemonDetailsView: React.FC<PokemonDetailsViewProps> = () => {
  const { pokemonSlug } = useParams<{ pokemonSlug: string }>();
  const queryClient = useQueryClient();
  const { status, data } = useQuery(pokemonSlug, () =>
    $api.fetchPokemonDetails({ slug: pokemonSlug }),
  );

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

  if (status === "loading") {
    return (
      <div>
        <p>LOADING!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-5xl font-bold">{data?.name}</div>
      <div className="flex">
        <div className="flex-1">
          {data?.previousPokemon && (
            <Link to={`/${data.previousPokemon}`}>{data.previousPokemon}</Link>
          )}
        </div>
        <div className="flex-1">
          {data?.nextPokemon && (
            <Link to={`/${data.nextPokemon}`}>{data.nextPokemon}</Link>
          )}
        </div>
      </div>
    </div>
  );
};

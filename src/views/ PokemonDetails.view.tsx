import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { $api } from "../$api";
import { setBackgroundColor } from "../utils/setBackgroundColor";

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

  React.useEffect(() => {
    if (data) {
      setBackgroundColor("blue");
    }
  }, [data]);

  if (status === "loading") {
    return (
      <div>
        <p>LOADING!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-5xl font-bold">{data?.slug}</div>
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

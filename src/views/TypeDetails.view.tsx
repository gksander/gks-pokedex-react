import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { $api } from "../$api";

type TypeDetailsViewProps = {};

export const TypeDetailsView: React.FC<TypeDetailsViewProps> = () => {
  const { typeSlug } = useParams<{ typeSlug: string }>();
  const { status, data } = useQuery(`type/${typeSlug}`, () =>
    $api.fetchTypeDetails({ slug: typeSlug }),
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="font-bold text-5xl">{data?.slug || "---"}</div>
      <div>
        {(data?.pokemon || []).map((pokemonSlug) => (
          <div key={pokemonSlug}>{pokemonSlug}</div>
        ))}
      </div>
    </div>
  );
};

import * as React from "react";
import { useQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { Link } from "react-router-dom";

type TypesViewProps = {};

export const TypesView: React.FC<TypesViewProps> = () => {
  const { status, data } = useQuery(
    QUERY_CACHE_KEYS.TYPES_LIST,
    $api.fetchTypesList,
  );

  if (status === "loading") {
    return <p>Loading</p>;
  }

  return (
    <div>
      {(data || []).map((type) => (
        <div key={type.id}>
          <Link to={`/types/${type.slug}`}>{type.slug}</Link>
        </div>
      ))}
    </div>
  );
};

import * as React from "react";
import { useQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { Link } from "react-router-dom";

type SearchViewProps = {};

export const SearchView: React.FC<SearchViewProps> = () => {
  const { status, data } = useQuery(
    QUERY_CACHE_KEYS.SEARCH_LIST,
    $api.fetchSearchList,
  );

  if (status === "loading") {
    return (
      <div>
        <p>LOADING</p>
      </div>
    );
  }

  return (
    <div>
      {(data || []).map((dat) => (
        <div key={dat.id}>
          <Link to={`/${dat.slug}`}>{dat.slug}</Link>
        </div>
      ))}
    </div>
  );
};

import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { $api } from "../$api";
import { LazyPokeListCard } from "../components/PokeListCard";
import Skeleton from "react-loading-skeleton";
import { PokeTypeChip } from "../components/PokeTypeChip";

type TypeDetailsViewProps = {};

export const TypeDetailsView: React.FC<TypeDetailsViewProps> = () => {
  const { typeSlug } = useParams<{ typeSlug: string }>();
  const { status, data } = useQuery(`type/${typeSlug}`, () =>
    $api.fetchTypeDetails({ slug: typeSlug }),
  );

  const damageCategories = (() => {
    const superEffectiveAgainst = (data?.efficacyTo || [])
      .filter((dat) => dat.factor === 200)
      .map((dat) => dat.type);
    const notVeryEffectiveAgainst = (data?.efficacyTo || [])
      .filter((dat) => dat.factor === 50)
      .map((dat) => dat.type);
    const notEffectiveAgainst = (data?.efficacyTo || [])
      .filter((dat) => dat.factor === 0)
      .map((dat) => dat.type);

    return [
      {
        title: "Strong Against",
        types: superEffectiveAgainst,
      },
      {
        title: "Weak Against",
        types: notVeryEffectiveAgainst,
      },
      {
        title: "Doesn't Affect",
        types: notEffectiveAgainst,
      },
    ];
  })();

  return (
    <div className="container max-w-2xl py-6 px-2">
      <div className="text-6xl font-fancy mb-3 capitalize">{typeSlug}</div>
      <div className="grid gap-6">
        {damageCategories.map((cat) => (
          <div key={cat.title}>
            <div className="text-3xl font-thin mb-1">{cat.title}</div>
            {(() => {
              if (status === "loading") {
                return <Skeleton />;
              }

              if (!cat.types.length) {
                return <div className="italic text-gray-700">Nothing...</div>;
              }

              return (
                <div className="flex flex-wrap">
                  {cat.types.map((slug) => (
                    <div className="mr-1 mb-1" key={slug}>
                      <PokeTypeChip slug={slug} />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
      <hr className="my-6" />
      <div className="text-4xl font-thin mb-4">Pokemon with this type</div>
      {status === "loading" ? (
        <Skeleton height={100} className="mb-8" />
      ) : (
        <div className="grid gap-8">
          {(data?.pokemon || []).map((slug) => (
            <LazyPokeListCard key={slug} slug={slug} />
          ))}
        </div>
      )}
    </div>
  );
};

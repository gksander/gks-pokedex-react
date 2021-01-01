import * as React from "react";
import { useQuery } from "react-query";
import { QUERY_CACHE_KEYS } from "../consts";
import { $api } from "../$api";
import { PokeTypeChip } from "../components/PokeTypeChip";
import { useTitle } from "react-use";
import { ViewWrapper } from "../components/ViewWrapper";
import { AnimatePresence, motion, Variants } from "framer-motion";

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
        <AnimatePresence exitBeforeEnter>
          {status === "loading" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
            >
              <p>loading</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              initial="out"
              animate="in"
              exit="out"
              variants={list}
            >
              {(data || []).map((type) => (
                <motion.div key={type.slug} variants={chip}>
                  <PokeTypeChip slug={type.slug} isBlock key={type.slug} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ViewWrapper>
  );
};

const list: Variants = {
  in: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.03,
    },
  },
  out: { opacity: 0 },
};

const chip: Variants = {
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: 20 },
};

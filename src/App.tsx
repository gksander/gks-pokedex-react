import * as React from "react";
import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import classNames from "classnames";
import { Pokeball } from "./components/Pokeball";
import { ROUTES } from "./routes";
import { HomeView } from "./views/Home.view";
import { TypesView } from "./views/Types.view";
import { SearchView } from "./views/Search.view";
import { QueryClient, QueryClientProvider } from "react-query";
import { PokemonDetailsView } from "./views/ PokemonDetails.view";
import { TypeDetailsView } from "./views/TypeDetails.view";

export const App: React.FC = () => {
  const shouldShowHeaderShadow = false;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div
          style={{
            backgroundColor: "var(--background-color, white)",
          }}
          className="min-h-screen transition-colors duration-150"
        >
          <header
            className={classNames(
              "p-2 transition-all duration-150 sticky top-0 z-10",
              shouldShowHeaderShadow && ["shadow"],
            )}
            style={{
              backgroundColor: "var(--background-color, white)",
            }}
          >
            <div className="container max-w-2xl flex flex-row justify-between items-center">
              <NavLink
                to="/"
                className="flex items-center text-primary-800 px-3 py-2 rounded border-2 border-transparent hover:border-primary-800 transition-colors duration-150 homeLink"
                activeClassName="border-primary-800"
                exact
              >
                <div className="w-6 mr-2">
                  <Pokeball className="pokeball transition-all duration-300" />
                </div>
                <span className="font-bold text-lg">Pokedex</span>
              </NavLink>
              <div>
                {LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="px-3 py-2 text-primary-800 font-bold rounded transition-colors duration-150 border-2 border-transparent hover:border-primary-800"
                    exact
                    activeClassName="border-primary-800"
                  >
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </header>
          <main className="py-6 px-2">
            <div className="container max-w-2xl">
              <Switch>
                <Route path={ROUTES.SEARCH} component={SearchView} />
                <Route path={`/types/:typeSlug`} component={TypeDetailsView} />
                <Route path={ROUTES.TYPES} component={TypesView} />
                <Route path={`/:pokemonSlug`} component={PokemonDetailsView} />
                <Route path={ROUTES.HOME} component={HomeView} />
              </Switch>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const LINKS = [
  {
    title: "Search",
    to: "/search",
  },
  {
    title: "Types",
    to: "/types",
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  },
});

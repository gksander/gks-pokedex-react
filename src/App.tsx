import * as React from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import classNames from "classnames";
import { Pokeball } from "./components/Pokeball";
import { ROUTES } from "./routes";
import { HomeView } from "./views/Home.view";
import { TypesView } from "./views/Types.view";
import { SearchView } from "./views/Search.view";
import { QueryClient, QueryClientProvider } from "react-query";
import { PokemonDetailsView } from "./views/ PokemonDetails.view";
import { TypeDetailsView } from "./views/TypeDetails.view";
import { setBackgroundColor } from "./utils/setBackgroundColor";
import { AnimatePresence, motion } from "framer-motion";

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppBody />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AppBody: React.FC = () => {
  const shouldShowHeaderShadow = useShouldShowShadowHeader();
  useResetBgColorIfNecessary();
  useScollToTopOnRouteChange();

  return (
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
            className="text-primary-800 rounded border-2 border-transparent hover:border-primary-800 transition-colors duration-150 homeLink"
            activeClassName="border-primary-800"
            exact
          >
            <motion.div
              className="flex items-center h-full w-full px-3 py-2 "
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <div className="w-6 mr-2">
                <motion.div
                  variants={{
                    rest: {
                      rotate: 0,
                    },
                    hover: {
                      rotate: 180,
                    },
                  }}
                >
                  <Pokeball />
                </motion.div>
              </div>
              <span className="font-bold text-lg">Pokedex</span>
            </motion.div>
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
          <Route
            render={({ location }) => (
              <AnimatePresence exitBeforeEnter initial={false}>
                <Switch location={location}>
                  <Route path={ROUTES.SEARCH} component={SearchView} />
                  <Route
                    path={`/types/:typeSlug`}
                    component={TypeDetailsView}
                  />
                  <Route path={ROUTES.TYPES} component={TypesView} />
                  <Route path={`/page/:page`} component={HomeView} />
                  <Route
                    path={`/:pokemonSlug`}
                    component={PokemonDetailsView}
                  />
                  <Route path={ROUTES.HOME} component={HomeView} />
                </Switch>
              </AnimatePresence>
            )}
          />
        </div>
      </main>
    </div>
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

/**
 * Handle header shadow visibility
 */
const useShouldShowShadowHeader = () => {
  const [shouldShow, setShouldShow] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setShouldShow(window.scrollY > 0);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  });

  return shouldShow;
};

const useResetBgColorIfNecessary = () => {
  const pathname = useLocation().pathname;

  React.useEffect(() => {
    if (
      [ROUTES.HOME, ROUTES.SEARCH].includes(pathname) ||
      pathname.startsWith("/types") ||
      pathname.startsWith("/page")
    ) {
      setBackgroundColor("white");
    }
  }, [pathname]);
};

const useScollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

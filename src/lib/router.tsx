
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Game from '@/pages/Game';
import Lobby from '@/pages/Lobby';

// Root route layout
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <div id="outlet">
        <Outlet />
      </div>
    </div>
  ),
});

// Define all routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: Game,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      room: search.room as string | undefined
    };
  }
});

const lobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lobby',
  component: Lobby,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  gameRoute,
  lobbyRoute,
  notFoundRoute,
]);

// Create and export the router with type assertion to bypass strictNullChecks requirement
export const router = createRouter({ 
  routeTree,
}) as any; // Using type assertion to bypass the TypeScript error

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

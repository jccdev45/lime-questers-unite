import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <div>
        {/* Could be the common app shell */}
        <Outlet />
      </div>
    </>
  );
}

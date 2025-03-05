import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/not-found")({
  component: NotFound,
});

function NotFound() {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-700 underline"
          onClick={(e) => {
            e.preventDefault();
            router.navigate({ to: "/" });
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}

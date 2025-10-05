import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="mb-4 text-xl text-gray-600 dark:text-gray-400">Oops! Page not found</p>
      <a href="/" className="text-primary underline hover:text-primary-glow transition-colors">
        Return to Dashboard
      </a>
    </div>
  </div>
  );
};

export default NotFound;

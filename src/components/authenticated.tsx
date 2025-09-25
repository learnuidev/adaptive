import { useIsAuthenticatedQuery } from "@/modules/auth/use-is-authenticated.query";

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { data } = useIsAuthenticatedQuery();

  if (!data) {
    return (
      <div>
        <div> Login...</div>
      </div>
    );
  }

  return <div> {children}</div>;
};

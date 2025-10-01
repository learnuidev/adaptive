export const WithGlow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative isolate inline-block group">
      <div className="absolute -inset-1 shadow-lg shadow-pink-500/50 blur-md rounded-md pointer-events-none animate-pulse" />
      {children}
    </div>
  );
};

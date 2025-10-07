export const WithPulseDots = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-32 bg-background flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-8">
        <div
          className="w-8 h-8 bg-primary rounded-full animate-ping opacity-40"
          style={{ animationDuration: "2s" }}
        ></div>
        <div
          className="w-4 h-4 bg-primary/80 rounded-full animate-ping opacity-25 animation-delay-200"
          style={{ animationDuration: "2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary/60 rounded-full animate-ping opacity-15 animation-delay-400"
          style={{ animationDuration: "2s" }}
        ></div>
      </div>

      {children}
    </div>
  );
};

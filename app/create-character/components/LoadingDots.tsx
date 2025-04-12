const LoadingDots = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center gap-1 py-2 text-sm text-black/80">
      {/* <p>Searching</p> */}
      <div className="flex">
        <div className="dot text-2xl font-bold">.</div>
        <div className="dot text-2xl font-bold">.</div>
        <div className="dot text-2xl font-bold">.</div>
      </div>
    </div>
  );
};

export default LoadingDots;

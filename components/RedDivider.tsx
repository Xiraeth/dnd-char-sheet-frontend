const RedDivider = () => {
  return (
    <div className="w-full box-border">
      <svg
        viewBox="0 0 450 5"
        preserveAspectRatio="none"
        className="w-full h-[5px] my-[10px]"
      >
        <polyline points="0,0 450,2.5 0,5" fill="#922610" stroke="#922610" />
      </svg>
    </div>
  );
};

export default RedDivider;

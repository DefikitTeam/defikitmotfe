const LoadingPlaceholder = () => (
  <div
    aria-hidden="true"
    style={{
      opacity: 0,
      pointerEvents: 'none',
      userSelect: 'none'
    }}
  />
);

export default LoadingPlaceholder;

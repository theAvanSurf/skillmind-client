interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

export function Spinner({
  className = "",
  size = 40,
  color = "border-white",
}: SpinnerProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`animate-spin rounded-full border-4 ${color} border-t-transparent ${className}`}
    />
  );
}
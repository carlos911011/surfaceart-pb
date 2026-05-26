type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export default function Spinner({ size = "md" }: { size?: Size }) {
  return (
    <span
      className={[
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizeClasses[size],
      ].join(" ")}
      role="status"
      aria-label="Loading"
    />
  );
}

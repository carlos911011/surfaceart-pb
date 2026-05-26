type Variant = "blue" | "yellow" | "orange" | "purple" | "green" | "red" | "gray" | "gold";

const variantClasses: Record<Variant, string> = {
  blue:   "bg-blue-100 text-blue-700 border border-blue-200",
  yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  orange: "bg-orange-100 text-orange-700 border border-orange-200",
  purple: "bg-purple-100 text-purple-700 border border-purple-200",
  green:  "bg-green-100 text-green-700 border border-green-200",
  red:    "bg-red-100 text-red-700 border border-red-200",
  gray:   "bg-gray-100 text-gray-600 border border-gray-200",
  gold:   "bg-gold/10 text-gold border border-gold/30",
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "gray", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

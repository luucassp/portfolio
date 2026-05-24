import Image from "next/image";

interface LogoProps {
  size?: "sm" | "lg";
  onClick?: () => void;
  className?: string;
  showInitials?: boolean;
}

export default function Logo({ size = "sm", onClick, className = "" }: LogoProps) {
  const isLarge = size === "lg";
  const dimensions = isLarge ? "w-32 h-32" : "w-12 h-12";

  return (
    <button
      onClick={onClick}
      className={`${dimensions} relative overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/50 ${className}`}
      aria-label="Home"
    >
      <Image
        src="/logo para scrol.png"
        alt="Sergio L. Pereira"
        fill
        className="object-contain"
        priority
        quality={85}
        sizes={isLarge ? "128px" : "48px"}
      />
    </button>
  );
}

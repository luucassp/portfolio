import Image from "next/image";

interface LogoProps {
  size?: "sm" | "lg";
  onClick?: () => void;
  className?: string;
  showInitials?: boolean;
}

export default function Logo({ size = "sm", onClick, className = "", showInitials = false }: LogoProps) {
  const isLarge = size === "lg";
  const dimensions = isLarge ? "w-32 h-32" : "w-12 h-12";

  if (showInitials && size === "sm") {
    return (
      <button
        onClick={onClick}
        className={`${dimensions} rounded-full bg-gradient-to-br from-[#b91c1c] via-[#ea580c] to-[#d4af37] flex items-center justify-center font-bold text-white text-lg transition-all hover:shadow-lg hover:shadow-[#ea580c]/50 ${className}`}
        aria-label="Home"
      >
        SP
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${dimensions} relative rounded-full transition-all hover:shadow-lg hover:shadow-[#ea580c]/50 ${className}`}
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

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full transition-all duration-300 
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }
        bg-white/10 backdrop-blur-md border border-[#76b900]/50 shadow-[0_0_15px_#76b90033]
        hover:shadow-[0_0_25px_#76b900aa] hover:scale-110`}
    >
      <ArrowUp className="text-[#76b900]" size={22} />
    </button>
  );
};

export default ScrollTopButton;

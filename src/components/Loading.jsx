import { useEffect, useState } from "react";
import loadingKriya from "@/assets/images/loading-1.svg";

const LoadingAnimation = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [fade, setFade] = useState(true);

  const loadingPhrases = [
    "Just a moment",
    "Almost there",
    "Getting things ready",
    "Loading up",
    "Hang tight",
    "Preparing",
    "On it",
    "Working on it",
    "Setting things up",
    "Getting there",
    "One sec",
    "Almost done",
    "Loading your content",
    "Just finishing up",
    "Ready shortly",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadingPhrases.length]);

  return (
    <div className="flex flex-col items-center gap-1 justify-center h-screen -mt-30 text-[#008080]">
      <img
        src={loadingKriya}
        alt="loading"
        width={80}
        height={80}
        className="rotate-90"
      />

      <p className="text-sm font-regular italic">
        {loadingPhrases[currentPhrase]}
      </p>
    </div>
  );
};

export default LoadingAnimation;

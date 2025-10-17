import { useEffect, useState } from "react";
import loadingKriya from "@/assets/images/loading-1.svg";

export default function LoadingAnimation({ size = 80, withText = false }) {
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-1 text-[#008080] -mt-30">
      <img
        src={loadingKriya}
        alt="loading"
        width={size}
        height={size}
        className={`transition-opacity duration-500 rotate-90 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />
      {withText && (
        <p
          className={`text-sm italic font-normal transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {loadingPhrases[currentPhrase]}
        </p>
      )}
    </div>
  );
}

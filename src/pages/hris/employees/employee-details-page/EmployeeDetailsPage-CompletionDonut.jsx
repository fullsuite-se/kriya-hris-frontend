import { useState, useEffect } from "react";

const CompletionDonut = ({ userIncomplete, completionColor }) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [displayCompleted, setDisplayCompleted] = useState(0);

  const totalFields = userIncomplete.allRequiredFields.length;
  const completedFields = totalFields - userIncomplete.missingFields.length;
  const targetPercentage = userIncomplete.completionPercentage;

  useEffect(() => {
    const duration = 300;
    const frameRate = 60;
    const totalFrames = Math.ceil((duration / 1000) * frameRate);
    let frame = 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animation = () => {
      frame++;
      const progress = easeOutCubic(frame / totalFrames);

      setDisplayPercentage(Math.round(targetPercentage * progress));
      setDisplayCompleted(Math.round(completedFields * progress));

      if (frame < totalFrames) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, [targetPercentage, completedFields]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - displayPercentage / 100);

  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-4">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={completionColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke 0.3s ease-in-out" }}
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-lg font-semibold" style={{ color: completionColor }}>
          {displayPercentage}%
        </p>
        <p className="text-[10px] text-gray-400">
          {displayCompleted}/{totalFields} completed
        </p>
      </div>
    </div>
  );
};

//sa dashboard to

export const CompletionCircle = ({ user }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = user.completionPercentage;
    const duration = 300;
    const increment = end / (duration / 16);

    const animate = () => {
      start += increment;
      if (start >= end) {
        setProgress(end);
      } else {
        setProgress(start);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [user.completionPercentage]);

  const strokeColor =
    progress >= 80 ? "#008080" : progress >= 50 ? "#f59e0b" : "#dc2626";

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#ebebeb"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={strokeColor}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <span
        className="absolute text-[7.5px] font-semibold"
        style={{ color: strokeColor }}
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
};

//sa emp details page

export const CompletionCircle2 = ({ user }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = user.completionPercentage;
    const duration = 300;
    const increment = end / (duration / 16);

    const animate = () => {
      start += increment;
      if (start >= end) {
        setProgress(end);
      } else {
        setProgress(start);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [user.completionPercentage]);

  const completionColor =
    progress >= 80 ? "#008080" : progress >= 50 ? "#f59e0b" : "#dc2626";

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={completionColor}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <span
        className="absolute text-[10px] font-semibold"
        style={{ color: completionColor }}
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export default CompletionDonut;

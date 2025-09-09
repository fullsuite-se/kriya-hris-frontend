import random from "random";
import NotFoundImage1 from "../assets/images/404cuate.svg";
import NotFoundImage2 from "../assets/images/404bro.svg";
import NotFoundImage3 from "../assets/images/404amico.svg";
import NotFoundImage4 from "../assets/images/404pana.svg";
import NotFoundImage5 from "../assets/images/404rafiki.svg";
import { useNavigate } from "react-router-dom";
import LeftArrowIcon from "@/assets/icons/ArrowIcon";

export default function NotFoundPage() {
  const images = [
    NotFoundImage1,
    NotFoundImage2,
    NotFoundImage3,
    NotFoundImage4,
    NotFoundImage5,
  ];
  const randomIndex = random.int(0, images.length - 1);
  const NotFoundImage = images[randomIndex];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <img src={NotFoundImage} alt="404 Not Found" className="w-80 mb-8" />
      <p className="text-lg text-gray-600 mb-6">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
      >
        <LeftArrowIcon />
        Go Back
      </button>
      <p
        onClick={() => navigate('/')}
        className="flex items-center mt-3 text-[#008080] cursor-pointer select-none transition hover:text-[#008080c4]"
      >
        Go Home
      </p>
    </div>
  );
}

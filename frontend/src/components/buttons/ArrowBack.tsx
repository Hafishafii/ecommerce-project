import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ArrowBack = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4"
    >
      <MdArrowBackIos className="text-xl" />
      <span className="ml-1 text-sm">Back</span>
    </button>
  );
};

export default ArrowBack;

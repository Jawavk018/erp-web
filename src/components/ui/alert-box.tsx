import React from "react";

interface PopupProps {
    isVisible: any
    onClose: any
    message: any
  }


const AlertBox: React.FC<PopupProps> = ({ isVisible, onClose, message }) => {
  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      }`}
    >
      <div className="flex items-center bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-lg p-4 space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AlertBox;

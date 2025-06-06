import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Popup({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={onClose} // Close popup when clicking on the overlay
    >
      {/* Popup content */}
      <div
        className="relative bg-white p-8 shadow-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 cursor-pointer text-black hover:text-gray-500"
          onClick={onClose}
        >
          <XMarkIcon className="size-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
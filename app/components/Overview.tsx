import { ReactNode } from "react";

export default function Overview({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-[90%] h-[80%] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          Close
        </button>

        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          {/* Add content specific to the Overview modal here */}
          {children}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NavBar = ({
  onSettingsOpen,
  onOverviewOpen,
}: {
  onSettingsOpen: () => void;
  onOverviewOpen: () => void;
}) => {
  const router = useRouter();

  return (
    <div className="bg-purple-600 flex items-center justify-between px-28 py-3 shadow-md">
      <div className="flex items-center space-x-2">
        <img src="/clock-5.svg" alt="Clock" />

        <h1 className="text-white font-bold text-lg">focus</h1>
      </div>

      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800"
          onClick={onOverviewOpen}
        >
          overview
        </button>

        <button
          className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800"
          onClick={onSettingsOpen}
        >
          settings
        </button>
      </div>
    </div>
  );
};

export default NavBar;

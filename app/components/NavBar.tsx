import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Settings from "./Settings";
import Overview from "./Overview";

const NavBar = () => {
  const router = useRouter();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);


  return (
    <div className="bg-purple-600 flex items-center justify-between px-28 py-3 shadow-md">
      <div className="flex items-center space-x-2">
        <img src="/clock-5.svg" alt="Clock" />

        <h1 className="text-white font-bold text-lg">focus</h1>
      </div>

      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800"
          onClick={() => setIsOverviewOpen(true)}
        >
          overview
        </button>

        <button
          className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800"
          onClick={() => setIsSettingsOpen(true)}
        >
          settings
        </button>
      </div>

      {isSettingsOpen && (
        <Settings onClose={() => setIsSettingsOpen(false)} children={undefined} />
      )}

      {isOverviewOpen && (
        <Overview onClose = {() => setIsOverviewOpen(false)}>hi</Overview>
      )}



    </div>
  );
};

export default NavBar;

import React, { ReactNode, useState } from "react";
import TimersSettings from "./settings/TimerSettings";
import SoundsSettings from "./settings/SoundSettings";
import AccountSettings from "./settings/AccountSettings";

export default function Settings({
  children,
  onClose,
  onUpdateTimers,
  onLoginSuccess,
  isLoggedIn,
  onLogout,
  onSoundUpdate,
  selectedSound,
}: {
  children: ReactNode;
  onClose: () => void;
  onUpdateTimers: (values: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  }) => void;
  onLoginSuccess: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onSoundUpdate: (sound: string) => void;
  selectedSound: string;
}) {
  const [activeSection, setActiveSection] = useState<string>("timers");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[600px] h-[80%] max-width-w-[90%] max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          Close
        </button>

        <div className="flex h-full">
          <div className="w-64 bg-gray-800 text-white p-4">
            <div className="flex flex-col space-y-4">
          
              <button
                onClick={() => handleSectionChange("timers")}
                className="hover:text-gray-400"
              >
                Timers
              </button>
              <button
                onClick={() => handleSectionChange("sounds")}
                className="hover:text-gray-400"
              >
                Sounds
              </button>
              <button
                onClick={() => handleSectionChange("account")}
                className="hover:text-gray-400"
              >
                Account
              </button>
            </div>
          </div>

          <div className="flex-grow p-8 overflow-y-auto">

            {activeSection === "timers" && (
              <TimersSettings onUpdate={onUpdateTimers} />
            )}
            {activeSection === "sounds" && (
              <SoundsSettings
                onSoundUpdate={onSoundUpdate}
                selectedSound={selectedSound}
              />
            )}
            {activeSection === "account" && (
              <AccountSettings
                onLoginSuccess={onLoginSuccess}
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

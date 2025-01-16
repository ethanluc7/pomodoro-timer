"use client";

import { useState } from "react";
import NavBar from "./components/NavBar";
import Timer from "./components/Timer";
import Topics from "./components/Topics";
import Overview from "./components/Overview";
import Settings from "./components/Settings";

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("Calculus");
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10,
  });

  return (
    <div className="bg-purple-600 min-h-screen text-white flex flex-col items-center">
      <div className="w-full max-w-6xl px-8 py-4">
        <NavBar
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onOverviewOpen={() => setIsOverviewOpen(true)}
        />
      </div>

      <div className="flex flex-col items-center mt-10">
        <Timer selectedTopic={selectedTopic} timers={timerSettings} />
        <p className="mt-4 text-lg font-medium">#{selectedTopic}</p>
      </div>

      <div className="w-full max-w-4xl mt-8 px-4">
        <h2 className="text-xl font-bold mb-4 text-center">Tasks</h2>
        <Topics
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      </div>

      {isOverviewOpen && (
        <Overview onClose={() => setIsOverviewOpen(false)}>
          <p>Overview content here...</p>
        </Overview>
      )}

      {isSettingsOpen && (
        <Settings
          onClose={() => setIsSettingsOpen(false)}
          onUpdateTimers={(values) => setTimerSettings(values)}
        >
          <p>Settings content here...</p>
        </Settings>
      )}
    </div>
  );
}

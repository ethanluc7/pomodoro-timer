"use client";

import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Timer from "./components/Timer";
import Topics from "./components/Topics";
import Overview from "./components/Overview";
import Settings from "./components/Settings";
import axios from "axios";

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("None");
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [topicsRefreshTrigger, setTopicsRefreshTrigger] =
    useState<boolean>(false);
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10,
  });
  const [selectedSound, setSelectedSound] = useState<string>("chime");

  const fetchTimerSettings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/get-timer-settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setTimerSettings({
          pomodoro: response.data.pomodoro,
          shortBreak: response.data.short_break,
          longBreak: response.data.long_break,
        });
      }
    } catch (error) {
      console.error("Error fetching timer settings:", error);
    }
  };

  const fetchSoundSettings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/get-sound-settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.sound) {
        setSelectedSound(response.data.sound);
      }
    } catch (error) {
      console.error("Error fetching sound settings:", error);
    }
  };

  const fetchTopics = async () => {
    setTopicsRefreshTrigger((prev) => !prev);
  };

  const fetchUserData = async () => {
    await Promise.all([
      fetchTimerSettings(),
      fetchSoundSettings(),
      fetchTopics(),
    ]);
  };

  const handleLoginSuccess = () => {
    setIsSettingsOpen(false);
    setIsLoggedIn(true);
    fetchUserData();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    setTimerSettings({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 10,
    });
    setSelectedSound("default");
    setSelectedTopic("None");
    fetchTopics();
  };

  const handleSoundUpdate = (sound: string) => {
    setSelectedSound(sound);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  return (
    <div className="bg-purple-600 min-h-screen flex items-center justify-center">
      <div className="text-white flex flex-col items-center">
        <div className="w-full max-w-6xl px-8 py-4">
          <NavBar
            onSettingsOpen={() => setIsSettingsOpen(true)}
            onOverviewOpen={() => setIsOverviewOpen(true)}
          />
        </div>

        <div className="flex flex-col items-center mt-10">
          <Timer
            selectedTopic={selectedTopic}
            timers={timerSettings}
            selectedSound={selectedSound}
          />
          <p className="mt-4 text-lg font-medium">#{selectedTopic}</p>
        </div>

        <div className="w-full max-w-4xl mt-8 px-4">
          <h2 className="text-xl font-bold mb-4 text-center">Tasks</h2>
          <Topics
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            refreshTrigger={topicsRefreshTrigger}
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
            onLoginSuccess={handleLoginSuccess}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onSoundUpdate={handleSoundUpdate}
            selectedSound={selectedSound}
          >
            <p>Settings content here...</p>
          </Settings>
        )}
      </div>
    </div>
  );
}

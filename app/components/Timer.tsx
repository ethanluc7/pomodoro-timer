"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type PomodoroTimerProps = {
  selectedTopic: string;
  timers: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  selectedTopic,
  timers,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timers.pomodoro * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<"Pomodoro" | "Short Break" | "Long Break">(
    "Pomodoro"
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    resetTimer();
  }, [mode, timers]);

  const toggleTimer = (): void => {
    setIsRunning((prevState) => {
      if (prevState) {
        handlePause();
      }
      return !prevState;
    });
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    setElapsedTime(0);
    setTimeLeft(
      mode === "Pomodoro"
        ? timers.pomodoro * 60
        : mode === "Short Break"
        ? timers.shortBreak * 60
        : timers.longBreak * 60
    );
  };

  const handlePause = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("User is not logged in. Data will not be stored.");
      return;
    }

    const data = {
      project_name: selectedTopic, // Submit the current topic to the backend
      elapsed_time: Math.floor(elapsedTime),
    };

    console.log("Sending data to backend:", data);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/save-timer",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Timer data saved successfully:", response.data);
    } catch (error: any) {
      // console.error("Error saving timer data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval!);
            return 0;
          }
          setElapsedTime((prevElapsed) => prevElapsed + 1);
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex justify-center items-center h-[60vh] bg-purple-600">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg w-72">
        <div className="flex justify-center gap-4 mb-6">
          {["Pomodoro", "Short Break", "Long Break"].map((modeName) => (
            <button
              key={modeName}
              onClick={() =>
                setMode(modeName as "Pomodoro" | "Short Break" | "Long Break")
              }
              className={`py-2 px-4 rounded-full text-white ${
                mode === modeName ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              {modeName}
            </button>
          ))}
        </div>

        <div className="text-6xl font-bold text-purple-600 mb-4">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="py-2 px-6 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-200"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="py-2 px-6 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;

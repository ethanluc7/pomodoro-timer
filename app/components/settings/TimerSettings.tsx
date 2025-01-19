import React, { useState, useEffect } from "react";
import axios from "axios";

const TimersSettings: React.FC<{
  onUpdate: (values: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  }) => void;
}> = ({ onUpdate }) => {
  const [pomodoro, setPomodoro] = useState<number>(25);
  const [shortBreak, setShortBreak] = useState<number>(5);
  const [longBreak, setLongBreak] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please log in to see your timer settings.");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/api/get-timer-settings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { pomodoro, short_break, long_break } = response.data;
        setPomodoro(pomodoro);
        setShortBreak(short_break);
        setLongBreak(long_break);
      })
      .catch(() => {
        setErrorMessage("Error fetching timer settings. Please try again.");
      });
  }, []);

  const handleSave = async () => {
    onUpdate({ pomodoro, shortBreak, longBreak });

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not logged in");

      await axios.post(
        "http://127.0.0.1:5000/api/save-timer-settings",
        { pomodoro, shortBreak, longBreak },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
     
    } catch {
      setErrorMessage("Error saving timer settings. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Timers Settings</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form>
        <div className="mb-4">
          <label htmlFor="pomodoro" className="block text-sm font-medium text-gray-700 mb-1">
            Pomodoro
          </label>
          <input
            type="number"
            id="pomodoro"
            value={pomodoro}
            onChange={(e) => setPomodoro(Number(e.target.value))}
            className="w-full p-2 border rounded-md text-black"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>

        <div className="mb-4">
          <label htmlFor="shortBreak" className="block text-sm font-medium text-gray-700 mb-1">
            Short Break
          </label>
          <input
            type="number"
            id="shortBreak"
            value={shortBreak}
            onChange={(e) => setShortBreak(Number(e.target.value))}
            className="w-full p-2 border rounded-md text-black"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>

        <div className="mb-4">
          <label htmlFor="longBreak" className="block text-sm font-medium text-gray-700 mb-1">
            Long Break
          </label>
          <input
            type="number"
            id="longBreak"
            value={longBreak}
            onChange={(e) => setLongBreak(Number(e.target.value))}
            className="w-full p-2 border rounded-md text-black"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default TimersSettings;

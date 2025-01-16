import React, { useState } from "react";

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
  const [useSequence, setUseSequence] = useState<boolean>(false);

  const handleSave = () => {
    onUpdate({ pomodoro, shortBreak, longBreak });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Timers Settings</h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="pomodoro"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="shortBreak"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="longBreak"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useSequence"
            checked={useSequence}
            onChange={() => setUseSequence((prev) => !prev)}
            className="mr-2"
          />
          <label htmlFor="useSequence" className="text-sm text-gray-700">
            Use the Pomodoro sequence: Pomodoro → short break, repeat 4x, then
            one long break
          </label>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Number of Pomodoros complete is indicated with dots under "Pomodoro"
        </p>

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

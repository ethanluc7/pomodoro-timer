import React, { useState, useEffect } from "react";
import axios from "axios";

type SoundsSettingsProps = {
  onSoundUpdate: (sound: string) => void;
  selectedSound: string;
};

const SoundsSettings: React.FC<SoundsSettingsProps> = ({
  onSoundUpdate,
  selectedSound,
}) => {
  const availableSounds = ["chime", "success"];
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchSelectedSound = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Please log in to see your sound settings.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/get-sound-settings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { selected_sound } = response.data;
        onSoundUpdate(selected_sound || "chime"); 
      } catch (error) {
        console.error("Error fetching sound settings:", error);
        setErrorMessage("Error fetching sound settings. Please try again.");
      }
    };

    fetchSelectedSound();
  }, []);

  const handleSoundChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sound = event.target.value;
    onSoundUpdate(sound);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("User is not logged in");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/api/save-sound-settings",
        { selected_sound: sound },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {
      setErrorMessage("Error saving sound settings. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Sounds Settings</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <div>
        <label htmlFor="sound-select" className="block text-lg font-medium text-gray-700 mb-2">
          Select alert sound:
        </label>
        <select
          id="sound-select"
          value={selectedSound}
          onChange={handleSoundChange}
          className="block w-full p-2 border rounded-md text-gray-800 bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
        >
          {availableSounds.map((sound) => (
            <option key={sound} value={sound}>
              {sound.charAt(0).toUpperCase() + sound.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SoundsSettings;

import React, { useState, useEffect } from "react";
import axios from "axios";

type Topic = {
  id: number;
  name: string;
};

type TopicsProps = {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
};

const Topics: React.FC<TopicsProps> = ({ selectedTopic, setSelectedTopic }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please log in to see your topics.");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/api/get-topics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTopics(response.data);
      })
      .catch(() => {
        setErrorMessage("Error fetching topics. Please try again.");
      });
  }, []);

  const handleTopicClick = (name: string) => {
    setSelectedTopic(name);
  };

  const handleAddTopic = async () => {
    const token = localStorage.getItem("token");
    if (!newTopic.trim()) return;

    if (!token) throw new Error("User is not logged in");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/add-topic",
        { name: newTopic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTopics((prevTopics) => [...prevTopics, response.data]);
      setNewTopic("");
    } catch {
      setErrorMessage("Error adding topic. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Topics</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <ul className="space-y-3">
        {topics.map((topic) => (
          <li
            key={topic.id}
            onClick={() => handleTopicClick(topic.name)}
            className={`flex items-center justify-between p-3 border rounded-lg transition cursor-pointer ${
              selectedTopic === topic.name
                ? "bg-purple-200 border-purple-500"
                : "hover:bg-purple-50"
            }`}
          >
            <span className="text-gray-800 font-medium">{topic.name}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Add a new topic"
          className="w-full p-2 border rounded-lg mb-2 text-gray-800"
        />
        <button
          onClick={handleAddTopic}
          className="w-full py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
        >
          Add Topic
        </button>
      </div>
    </div>
  );
};

export default Topics;



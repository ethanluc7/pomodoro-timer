import React, { useState, useEffect } from "react";
import axios from "axios";

type Topic = {
  id: number;
  name: string;
};

type TopicsProps = {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  refreshTrigger: boolean;
};

const Topics: React.FC<TopicsProps> = ({
  selectedTopic,
  setSelectedTopic,
  refreshTrigger,
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const fetchTopics = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:5000/api/get-topics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoggedIn(true);
      const fetchedTopics = response.data;
      setTopics(fetchedTopics);
      if (fetchedTopics.length > 0) {
        setSelectedTopic(fetchedTopics[0].name);
      }
    } catch {
      setErrorMessage("Error fetching topics. Please try again.");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [refreshTrigger]);

  const handleTopicClick = (name: string) => {
    setSelectedTopic(name);
  };

  const handleAddTopic = async () => {
    const token = localStorage.getItem("token");
    if (!newTopic.trim()) return;

    if (!token) {
      setErrorMessage("You need to sign in to add topics.");
      return;
    }

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

      if (topics.length === 0) {
        setSelectedTopic(response.data.name);
      }
    } catch {
      setErrorMessage("Error adding topic. Please try again.");
    }
  };

  const handleRemoveTopic = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("You need to sign in to remove topics.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:5000/api/delete-topic/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTopics((prevTopics) => {
        const updatedTopics = prevTopics.filter((topic) => topic.id !== id);

        if (
          updatedTopics.length > 0 &&
          selectedTopic === prevTopics.find((t) => t.id === id)?.name
        ) {
          setSelectedTopic(updatedTopics[0].name);
        } else if (updatedTopics.length === 0) {
          setSelectedTopic("");
        }

        return updatedTopics;
      });
    } catch {
      setErrorMessage("Error removing topic. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Topics</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {!isLoggedIn ? (
        <p className="text-center text-gray-800">
          Please <span className="text-purple-700 font-bold">sign in</span> to
          view and manage your topics.
        </p>
      ) : (
        <>
          {topics.length === 0 && (
            <p className="text-center text-gray-800">No topics available.</p>
          )}

          {topics.length > 0 && (
            <ul className="space-y-3">
              {topics.map((topic) => (
                <li
                  key={topic.id}
                  className={`flex items-center justify-between p-3 border rounded-lg transition ${
                    selectedTopic === topic.name
                      ? "bg-purple-200 border-purple-500"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <span
                    onClick={() => handleTopicClick(topic.name)}
                    className="text-gray-800 font-medium cursor-pointer flex-grow"
                  >
                    {topic.name}
                  </span>
                  <button
                    onClick={() => handleRemoveTopic(topic.id)}
                    className="ml-4 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          
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
        </>
      )}
    </div>
  );
};

export default Topics;

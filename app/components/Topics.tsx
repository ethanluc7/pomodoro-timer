import React from "react";

type Topic = {
  id: number;
  name: string;
};

type TopicsProps = {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
};

const Topics: React.FC<TopicsProps> = ({ selectedTopic, setSelectedTopic }) => {
  const topics: Topic[] = [
    { id: 1, name: "Calculus" },
    { id: 2, name: "Coding" },
    { id: 3, name: "Math Contests" },
    { id: 4, name: "School Work" },
    { id: 5, name: "Advanced Functions" },
  ];

  const handleTopicClick = (name: string) => {
    setSelectedTopic(name);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Topics</h2>
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
    </div>
  );
};

export default Topics;

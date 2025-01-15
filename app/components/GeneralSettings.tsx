import React from 'react';

const GeneralSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">General Settings</h2>
      <form>
        <label className="block mb-2">
          Select theme:
          <select className="border px-4 py-2 rounded-md w-full mt-2">
            <option>Dark Academia</option>
            <option>Light Mode</option>
            <option>Night Mode</option>
          </select>
        </label>
        {/* Add more settings here */}
      </form>
    </div>
  );
};

export default GeneralSettings;

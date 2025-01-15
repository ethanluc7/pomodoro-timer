import React from 'react';

const GeneralSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">General Settings</h2>
      <form>
        <label className="block mb-2">
          Theme
          <select className="border px-4 py-2 rounded-md w-full mt-2">
            <option>Light Mode</option>
            <option>Night Mode</option>
          </select>
        </label>
       
      </form>
    </div>
  );
};

export default GeneralSettings;

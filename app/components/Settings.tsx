import { ReactNode, useState } from "react";
import GeneralSettings from './GeneralSettings';
import TimersSettings from "./TimerSettings";
import SoundsSettings from "./SoundSettings";
import AccountSettings from './AccountSettings';

export default function Settings({ children, onClose }: { children: ReactNode; onClose: () => void }) {
 
  const [activeSection, setActiveSection] = useState<string>('general');

  
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[600px] h-[80%] max-width-w-[90%] max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          Close
        </button>

        <div className="flex h-full">
          
          <div className="w-64 bg-gray-800 text-white p-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleSectionChange('general')}
                className="hover:text-gray-400"
              >
                General
              </button>
              <button
                onClick={() => handleSectionChange('timers')}
                className="hover:text-gray-400"
              >
                Timers
              </button>
              <button
                onClick={() => handleSectionChange('sounds')}
                className="hover:text-gray-400"
              >
                Sounds
              </button>
              <button
                onClick={() => handleSectionChange('account')}
                className="hover:text-gray-400"
              >
                Account
              </button>
            </div>
          </div>

     
          <div className="flex-grow p-8 overflow-y-auto">
      
            {activeSection === 'general' && <GeneralSettings />}
            {activeSection === 'timers' && <TimersSettings />}
            {activeSection === 'sounds' && <SoundsSettings />}
            {activeSection === 'account' && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

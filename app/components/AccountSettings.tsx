
import React from 'react';
import { useRouter } from 'next/navigation';

const AccountSettings: React.FC = () => {
 
  const router = useRouter();


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>

      <button className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800"
      onClick = {() => router.push("/login")}>
        log in
      </button>
      
    </div>
  );
};

export default AccountSettings;

"use client";

import { useState } from "react";
import NavBar from "./components/NavBar";
import Timer from "./components/Timer";
import Modal from "./components/Settings";

export default function HomePage() {
 // const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <NavBar />
      <Timer />
      
    </div>
  );
}

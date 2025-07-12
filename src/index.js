import React from "react";
import { createRoot } from "react-dom/client";
import ChatTrigger from "./components/ChatTrigger";  // Import only ChatTrigger

const App = () => (
  <div>
    <h1>Pantheon Ultimate Parser</h1>
    <ChatTrigger />  {/* This controls the visibility of ChatBox */}
  </div>
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

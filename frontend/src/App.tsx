import React from "react";
import { Route, Routes } from "react-router-dom";
import { Profile } from "./route/Profile";
import { Homepage } from "./route/Homepage";

function App() {
  return (
    <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;

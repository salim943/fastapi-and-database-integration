import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ProfileList from "./components/ProfileList";
import Signup from "./components/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profiles" element={<ProfileList />} />
      <Route path="/profiles" element={<ProfileList />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
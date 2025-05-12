import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Game from "./pages/game";
import Home from "./pages/home";
import WaitingRoom from "./pages/waiting-room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

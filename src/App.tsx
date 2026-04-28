import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Pundit from "./pages/Pundit";
import Take from "./pages/Take";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pundits/:slug" element={<Pundit />} />
        <Route path="/takes/:slug" element={<Take />} />
      </Routes>
    </BrowserRouter>
  );
}

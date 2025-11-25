import { Routes, Route } from "react-router-dom";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";

function App() {
  return (
    <Routes>
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;

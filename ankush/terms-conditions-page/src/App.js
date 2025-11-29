import { Routes, Route } from "react-router-dom";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";

function App() {
  return (
    <Routes>
      {/* Route for the Terms & Conditions page */}
      <Route path="/terms" element={<TermsAndConditions />} />

      {/* Catch-all route: triggers when no other route matches */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;

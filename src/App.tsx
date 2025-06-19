import { HashRouter } from "react-router-dom";
import AppContent from "./components/AppContent";
import HeaderBar from "./components/HeaderBar";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <HashRouter>
      <HeaderBar />
      <AppContent />
      <NavigationBar />
    </HashRouter>
  );
}

// ใช้ HashRouter แทน BrowserRouter
// เพราะ GitHub Pages ไม่รองรับ route แบบ history API
// HashRouter ใช้ #/path ซึ่งทำให้ routing ทำงานฝั่ง client ได้ถูกต้อง

export default App;

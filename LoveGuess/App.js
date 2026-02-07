import "./global.css";
import { ThemeProvider } from "./src/context/ThemeContext";
import Navigation from "./src/navigation";

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}

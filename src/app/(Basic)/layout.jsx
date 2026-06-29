import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function BasicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500 overflow-x-hidden relative">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

import type { ReactNode } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="site-shell">
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
    <Navbar />
    <main id="main-content">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;

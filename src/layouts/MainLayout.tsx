import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

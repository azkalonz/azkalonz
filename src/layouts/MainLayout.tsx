import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div
      className={`site-shell site-shell--matrix ${isHome ? "site-shell--home" : "site-shell--internal"}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

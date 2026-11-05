import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

// Navbar renders once here. Only the <Outlet /> swaps between pages.
function Layout() {
  const { pathname } = useLocation();

  // Start each new page at the top instead of keeping the old scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;

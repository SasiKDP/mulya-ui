import { useEffect } from "react";

const PreventNavigation = () => {
  useEffect(() => {
    // ✅ Prevent Back & Forward Navigation
    const preventNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.history.forward(); // Prevent forward button as well
    window.addEventListener("popstate", preventNavigation);

    // ✅ Disable Reload (F5, Ctrl+R)
    const disableReload = (event) => {
      if (event.key === "F5" || (event.ctrlKey && event.key.toLowerCase() === "r")) {
        event.preventDefault();
        alert("Page refresh is disabled!");
      }
    };

    window.addEventListener("keydown", disableReload);

    // ✅ Disable Right Click
    const disableRightClick = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("popstate", preventNavigation);
      window.removeEventListener("keydown", disableReload);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return null;
};

export default PreventNavigation;

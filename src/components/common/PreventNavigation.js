import { useEffect } from "react";

const PreventNavigation = () => {
  useEffect(() => {
    // Disable Back Button
    const blockBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBackNavigation);

    // Disable Reload (F5, Ctrl+R)
    const disableReload = (event) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        alert("Page refresh is disabled!");
      }
    };

    window.addEventListener("keydown", disableReload);

    // Disable Right Click
    const disableRightClick = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("popstate", blockBackNavigation);
      window.removeEventListener("keydown", disableReload);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return null;
};

export default PreventNavigation;

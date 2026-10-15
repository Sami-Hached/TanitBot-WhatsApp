import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAVBAR_OFFSET_PX = 96;

const scrollToHash = (hash: string) => {
  const id = hash.replace("#", "");
  const target = document.getElementById(id);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET_PX;
  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
};

const ScrollManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const isLocalHash = href.startsWith("#");
      const isRootHash = href.startsWith("/#");
      if (!isLocalHash && !isRootHash) return;

      const hash = isRootHash ? href.slice(1) : href;
      if (!hash || hash === "#") return;

      if (location.pathname !== "/") {
        event.preventDefault();
        navigate(`/${hash}`);
        return;
      }

      event.preventDefault();
      scrollToHash(hash);
      window.history.replaceState(null, "", `/${hash}`);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.hash) {
      // Scroll after a short delay to allow React to mount
      const timer = window.setTimeout(() => {
        scrollToHash(location.hash);
      }, 100);

      // Scroll again after the page is fully loaded (images, fonts, etc.)
      const handleLoad = () => {
        scrollToHash(location.hash);
      };
      
      if (document.readyState === "complete") {
        scrollToHash(location.hash);
      } else {
        window.addEventListener("load", handleLoad);
      }

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("load", handleLoad);
      };
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    return undefined;
  }, [location.pathname, location.hash]);

  return null;
};

export default ScrollManager;

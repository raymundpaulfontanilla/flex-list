import { useEffect } from "react";

function PageMeta({ title, faviconUrl }) {
  useEffect(() => {
    if (title) {
      document.title = `${title}`;
    }

    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = faviconUrl;
    }
  }, [title, faviconUrl]);

  return null;
}

export default PageMeta;

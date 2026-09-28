export const isCampusAmbassadorPage =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/+$/, "") === "/campus-ambassador";

export const CAMPUS_AMBASSADOR_PATH = "/campus-ambassador";

export const normalizePath = (pathname = window.location.pathname) =>
  pathname.replace(/\/+$/, "") || "/";

export const PAGE_NAV = {
  "/": [
    { label: "Theme", anchor: "#theme-reveal" },
    { label: "Khai", anchor: "#khai" },
    { label: "Artists", anchor: "#artists" },
    { label: "Merch", anchor: "#merch" },
    { label: "Events", anchor: "#events" },
    { label: "Campus Ambassador", page: CAMPUS_AMBASSADOR_PATH },
    { label: "Coming Soon", anchor: "#coming-soon" },
  ],
  [CAMPUS_AMBASSADOR_PATH]: [
    { label: "Home", page: "/" },
    { label: "Theme", page: "/#theme-reveal" },
    { label: "Khai", page: "/#khai" },
    { label: "Artists", page: "/#artists" },
    { label: "Merch", page: "/#merch" },
    { label: "Events", page: "/#events" },
    { label: "Campus Ambassador", page: CAMPUS_AMBASSADOR_PATH },
  ],
};

export const currentNav = PAGE_NAV[isCampusAmbassadorPage ? CAMPUS_AMBASSADOR_PATH : "/"];

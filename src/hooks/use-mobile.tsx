import { useSyncExternalStore } from "react";

type DeviceType = "mobile" | "desktop";

type UseScreenTypeOptions = {
  mobileBreakpoint?: number;
};

type UseScreenTypeReturn = {
  isMobile: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
};

const DEFAULT_MOBILE_BREAKPOINT = 768;

export function useScreenType(
  options: UseScreenTypeOptions = {},
): UseScreenTypeReturn {
  const { mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT } = options;
  const query = `(max-width: ${mobileBreakpoint - 1}px)`;

  const isMobile = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);

      return () => {
        mediaQuery.removeEventListener("change", callback);
      };
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(query).matches;
    },
    () => false,
  );

  return {
    isMobile,
    isDesktop: !isMobile,
    deviceType: isMobile ? "mobile" : "desktop",
  };
}

export function useIsMobile(options?: UseScreenTypeOptions) {
  return useScreenType(options).isMobile;
}

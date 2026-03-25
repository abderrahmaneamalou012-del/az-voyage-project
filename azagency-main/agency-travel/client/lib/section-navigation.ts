const PENDING_HOME_SECTION_KEY = "az:pending-home-section";

export function getSectionIdFromHref(href: string): string | null {
  if (href.startsWith("/#")) {
    return href.slice(2) || null;
  }

  if (href.startsWith("#")) {
    return href.slice(1) || null;
  }

  return null;
}

export function savePendingHomeSection(sectionId: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_HOME_SECTION_KEY, sectionId);
}

export function consumePendingHomeSection(): string | null {
  if (typeof window === "undefined") return null;

  const sectionId = window.sessionStorage.getItem(PENDING_HOME_SECTION_KEY);
  if (!sectionId) return null;

  window.sessionStorage.removeItem(PENDING_HOME_SECTION_KEY);
  return sectionId;
}

export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth",
): boolean {
  if (typeof document === "undefined") return false;

  const element = document.getElementById(sectionId);
  if (!element) return false;

  element.scrollIntoView({ behavior, block: "start" });
  return true;
}

export function clearHashFromUrl() {
  if (typeof window === "undefined") return;

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", cleanUrl);
}

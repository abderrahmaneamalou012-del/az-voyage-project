import type {
  AnchorHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearHashFromUrl,
  getSectionIdFromHref,
  savePendingHomeSection,
  scrollToSection,
} from "@/lib/section-navigation";

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
}

function isModifiedEvent(event: ReactMouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

const AppLink = ({ children, href, onClick, target, ...props }: AppLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) {
      return;
    }

    if (target && target !== "_self") {
      return;
    }

    const sectionId = getSectionIdFromHref(href);
    if (!sectionId) {
      return;
    }

    event.preventDefault();

    if (location.pathname === "/") {
      scrollToSection(sectionId, "smooth");
      clearHashFromUrl();
      return;
    }

    savePendingHomeSection(sectionId);
    navigate("/");
  };

  return (
    <a href={href} onClick={handleClick} target={target} {...props}>
      {children}
    </a>
  );
};

export default AppLink;

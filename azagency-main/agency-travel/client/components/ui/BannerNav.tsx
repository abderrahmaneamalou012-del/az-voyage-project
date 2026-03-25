import type { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface BannerNavProps {
  bgImage: string;
  navLinks: NavLink[];
  children: ReactNode;
}

const BannerNav = ({ bgImage, navLinks, children }: BannerNavProps) => {
  return (
    <div className="relative overflow-hidden rounded-[32px] min-h-[460px] sm:min-h-[520px]">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.73)), url('${bgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex min-h-[460px] sm:min-h-[520px] flex-col items-center px-6 py-8 sm:px-10 lg:px-16">
        <div className="mb-14 flex w-full items-center justify-center">
          <a href="/" className="absolute left-6 sm:left-10 lg:left-16">
            <img
              src="/assets/figma/logo.png"
              alt="AZ Voyage"
              className="h-8 object-contain opacity-80"
            />
          </a>

          <nav className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-tight text-white/80 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center max-w-[700px] pb-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BannerNav;

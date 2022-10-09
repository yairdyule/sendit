import { NewspaperIcon } from "@heroicons/react/24/solid";
import React from "react";
import { NavLink } from "@remix-run/react";

import { BiMailSend, BiUser } from "react-icons/bi";
import { classNames } from "~/utils/css";

import { type IconType } from "react-icons";
import type { ReactNode } from "react";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={classNames(
        "flex h-full w-full flex-col-reverse transition-colors sm:flex-row"
      )}
    >
      <SmallNav />
      <SidebarNav />
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

const SmallNav = () => (
  <nav
    className={
      "h-16 w-full border-t-[3px] border-emerald-500 sm:hidden sm:border-b-2 sm:border-t-transparent"
    }
  >
    <ul className="flex h-full flex-row items-center justify-center gap-8 md:gap-10">
      <li>
        <NavLinkWithIcon to="/created" Icon={BiMailSend} />
      </li>
      <li>
        <NavLinkWithIcon to="/feed" Icon={NewspaperIcon} />
      </li>
      <li>
        <NavLinkWithIcon to="/profile" Icon={BiUser} />
      </li>
    </ul>
  </nav>
);

const SidebarNav = () => (
  <nav
    aria-label="Sidebar"
    className="hidden pt-6 sm:block flex-shrink-0 overflow-y-auto border-r border-r-neutral-700 bg-card-dark"
  >
    <ul className="relative flex w-20 flex-col items-center justify-center space-y-8 p-3">
      <li>
        <NavLinkWithIcon to="/created" Icon={BiMailSend} />
      </li>
      <li>
        <NavLinkWithIcon to="/feed" Icon={NewspaperIcon} />
      </li>
      <li>
        <NavLinkWithIcon to="/profile" Icon={BiUser} />
      </li>
    </ul>
  </nav>
);

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto flex-grow overflow-scroll px-4 md:mx-0">
      {children}
    </div>
  );
};

const NavLinkWithIcon = ({ to, Icon }: { to: string; Icon: IconType }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => {
        return (
          <Icon
            className={`h-8 w-8 text-gray-500 ${
              isActive ? "text-emerald-500" : ""
            }`}
          />
        );
      }}
    </NavLink>
  );
};

export default {
  Main,
  Container,
};

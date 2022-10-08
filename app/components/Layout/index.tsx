import { NewspaperIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Form, NavLink } from "@remix-run/react";

import { BiMailSend, BiUser } from "react-icons/bi";
import { type IconType } from "react-icons";
import { breakpoints, classNames } from "~/utils/css";

export const Main = ({ children }: { children: React.ReactNode }) => {
  console.log(
    classNames(
      "flex h-full w-full flex-col-reverse transition-colors",
      breakpoints.mediumAndUp("flex-row")
    )
  );

  return (
    <div
      className={classNames(
        "flex h-full w-full flex-col-reverse transition-colors",
        breakpoints.smallAndUp("flex-row")
      )}
    >
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
      <nav
        aria-label="Sidebar"
        className="hidden md:block md:flex-shrink-0 md:overflow-y-auto md:bg-neutral-800 md:border-r md:border-r-emerald-600"
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
      <div className="flex-grow overflow-scroll">{children}</div>
    </div>
  );
};

export default {
  Main,
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

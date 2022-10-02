import { InboxIcon, PlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { NavLink } from "@remix-run/react";

import { IoMdSquareOutline } from "react-icons/io";
import { BiMailSend, BiUser } from "react-icons/bi";
import { type IconType } from "react-icons";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";

export const Main = ({ children }: { children: React.ReactNode }) => {
  const NavLinkWithIcon = ({ to, Icon }: { to: string; Icon: IconType }) => {
    return (
      <NavLink to={to}>
        {({ isActive }) => {
          return (
            <Icon
              className={`h-8 w-8 text-gray-500 ${
                isActive ? "text-green-500" : ""
              }`}
            />
          );
        }}
      </NavLink>
    );
  };

  return (
    <div className="flex h-full w-full flex-col-reverse transition-colors sm:flex-col">
      <nav className="h-16 w-full border-t-[3px] border-emerald-700 shadow-md shadow-emerald-100">
        <ul className="flex h-full flex-row items-center justify-center gap-8 md:gap-10">
          <li>
            <NavLinkWithIcon to="/sent" Icon={BiMailSend} />
          </li>
          <li>
            <NavLinkWithIcon to="/received" Icon={InboxIcon} />
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

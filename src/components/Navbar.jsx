import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import PremiumButton from "./PremiumButton";
import { menu, search } from "../assets";
import { navlinks } from "../constants";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 900);
  };

  return (
    <div className="mb-7 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
      <div className="surface-2 flex h-[52px] max-w-[520px] flex-1 flex-row items-center gap-2 px-2 pl-4">
        <input
          type="text"
          placeholder="Search EOSI Finance traders"
          className="flex w-full bg-transparent text-sm text-primary placeholder:text-muted outline-none"
        />
        <button type="button" className="btn-premium btn-premium--secondary btn-premium--sm">
          <img src={search} alt="search" className="h-[14px] w-[14px] object-contain" />
        </button>
      </div>

      <div className="hidden items-center justify-end gap-3 sm:flex">
        <PremiumButton as="a" href="#faq" variant="secondary" size="sm">
          Explore Roadmap
        </PremiumButton>
        <PremiumButton as="button" type="button" variant="ghost" size="sm" onClick={handleLogout}>
          Back to Site
        </PremiumButton>
        {isLoading && <Loading />}
      </div>

      <div className="relative flex items-center justify-between sm:hidden">
        <div className="surface-2 flex h-[46px] items-center px-4 text-xs font-semibold text-secondary">
          EOSI Finance
        </div>

        <img
          src={menu}
          alt="menu"
          className="h-[34px] w-[34px] cursor-pointer object-contain"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute left-0 right-0 top-[56px] z-10 rounded-xl border border-white/10 bg-[#111522] py-3 shadow-premium ${
            !toggleDrawer ? "-translate-y-[120vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-2">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex cursor-pointer items-center p-4 ${isActive === link.name ? "bg-[#1b2134]" : ""}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`h-[22px] w-[22px] object-contain ${isActive === link.name ? "grayscale-0" : "grayscale"}`}
                />
                <p className={`ml-4 text-sm ${isActive === link.name ? "text-primary" : "text-muted"}`}>{link.name}</p>
              </li>
            ))}
          </ul>

          <div className="mx-4 flex items-center justify-between gap-2">
            <PremiumButton as="a" href="#faq" variant="secondary" size="sm" className="flex-1">
              Explore Roadmap
            </PremiumButton>
            <PremiumButton as="button" type="button" variant="ghost" size="sm" onClick={handleLogout}>
              Back
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

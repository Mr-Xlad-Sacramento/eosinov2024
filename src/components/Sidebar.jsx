import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import PremiumButton from "./PremiumButton";
import { logout } from "../assets";
import { navlinks } from "../constants";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(() => navigate("/"), 900);
  };

  return (
    <aside className="sticky top-5 flex h-[90vh] w-[36vh] flex-col items-start justify-between">
      <button
        type="button"
        className="btn-premium btn-premium--brand btn-premium--sm ml-2"
        onClick={() => navigate("/dashboard")}
      >
        EOSI Finance
      </button>

      <div className="surface-2 mt-10 flex w-full flex-1 flex-col justify-between p-4">
        <ul className="mb-4 space-y-1">
          {navlinks.map((link) => (
            <li
              key={link.name}
              className={`flex cursor-pointer items-center rounded-xl px-4 py-4 ${
                isActive === link.name ? "bg-[#1d2438]" : ""
              }`}
              onClick={() => {
                setIsActive(link.name);
                navigate(link.link);
              }}
            >
              <img
                src={link.imgUrl}
                alt={link.name}
                className={`h-[20px] w-[20px] object-contain ${isActive === link.name ? "grayscale-0" : "grayscale"}`}
              />
              <p className={`ml-4 text-sm font-semibold ${isActive === link.name ? "text-primary" : "text-muted"}`}>
                {link.name}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <PremiumButton as="button" type="button" variant="ghost" size="md" className="w-full" onClick={handleLogout}>
            <img src={logout} alt="logout" className="h-[16px] w-[16px]" />
            Back to site
          </PremiumButton>
          {isLoading && <Loading />}
          <p className="text-center text-[11px] text-muted">EOSI Finance &copy; 2026</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

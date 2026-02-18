import React from "react";
import PremiumButton from "./PremiumButton";
import PremiumCard from "./PremiumCard";

const FundCard = ({ traderName, minProfit, minCapital, commission, image, handleClick }) => {
  return (
    <PremiumCard
      tone="surface-1"
      className="mb-3 flex w-full cursor-pointer flex-col gap-4 rounded-[15px] px-5 py-4 sm:w-[990px] sm:flex-row sm:items-center sm:justify-between"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        <span className="badge-pill !border-green-400/40 !bg-green-500/10 !text-green-200">Active</span>
        <img src={image} alt="trader" className="h-[62px] w-[62px] rounded-full object-cover ring-2 ring-white/10" />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-2 text-sm text-secondary sm:grid-cols-4 sm:items-center sm:px-4">
        <p className="font-semibold text-primary">{traderName}</p>
        <p>
          Min Profit: <span className="text-primary">{minProfit}</span>
        </p>
        <p>
          Min Capital: <span className="text-primary">{minCapital}</span>
        </p>
        <p>
          Commission: <span className="text-primary">{commission}</span>
        </p>
      </div>

      <PremiumButton as="button" type="button" variant="secondary" size="sm">
        Copy Trade
      </PremiumButton>
    </PremiumCard>
  );
};

export default FundCard;

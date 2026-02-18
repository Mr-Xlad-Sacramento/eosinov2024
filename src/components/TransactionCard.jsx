import React from 'react';

const TransactionCard = ({ owner, traderName, minProfit, minCapital, commission, amountCollected, image, handleClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:w-[990px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer items-center py-3 px-10 space-x-12 shadow-xl shadow-neutral-800" onClick={handleClick}>

          <div className=" rounded-full flex justify-center items-center bg-[#13131a]">
            

            {/* <div className=" rounded-full bg-green-800 flex justify-center items-center cursor-pointer px-3 py-1">
              <p className='text-xs font-semibold !text-gray-300'>Active</p>
            </div> */}

          </div>

      <img src={image} alt="fund" className="w-[40px] h-[40px] rounded-full object-cover"/>

      <div className="flex flex-col items-center justify-center sm:flex-row p-2 space-x-10 ">
        

        <div className=" flex flex-row items-center w-[280px]">
          <h3 className="font-epilogue font-semibold  text-white text-left leading-[26px] w-3/5 !text-xs ">{traderName}</h3>
          
        </div>

        

        
      </div>

      <button className='bg-black text-white text-xs border2 border-purple-600 rounded-full px-6 py-3 shadow-md hover:bg-gray-900 shadow-zinc-700'>Click to View All Copy Trade Transactions with this Pro-Trader</button>
    </div>
  )
}

export default TransactionCard

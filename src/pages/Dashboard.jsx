import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { TiArrowSortedUp } from "react-icons/ti"

import { DisplayCampaigns, Navbar, Sidebar } from '../components';
// import { useStateContext } from '../context'
import { StateContextProvider } from '../context';

const Dashboard = () => {
  const { contract } = useContract('0xA7318d0636BB3CaE88EE7b0C6e267Bb6Abf873c1');
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);


  // get and list all campaigns
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      traderName: campaign.traderName,
      minProfit: campaign.minProfit,
      minCapital: campaign.minCapital.toNumber(),
      commission: campaign.commission.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const address = useAddress();
  const connect = useMetamask();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  useEffect(() => {
    if (!address) {
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else if (contract) {
      fetchCampaigns();
    }
  }, [address, contract]);





  return (

    <div className="relative sm:-8 min-h-screen bg-premium-bg p-4 flex flex-row">



      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 mx-auto max-w-[1280px] max-sm:w-full sm:pr-5">
        <Navbar />


        <div>

          <h1 className='pb-5 font-epilogue text-sm font-semibold text-muted'>Welcome to EOSI Finance Traders</h1>
          <div className='surface-2 flex w-full flex-row items-center space-x-8 rounded-t-lg px-6 py-4 text-[11px] font-semibold text-secondary sm:w-[990px]'>

            <div className='flex flex-row items-center space-x-2 '>
              <h1>Status</h1>
              <TiArrowSortedUp className='text-base pt-1' />
            </div>

            <div className='flex flex-row items-center space-x-2 '>
              <h1>Trader</h1>
              <TiArrowSortedUp className='text-base pt-1' />
            </div>

            <div className='flex flex-row items-center space-x-2 '>
              <h1>Name</h1>
              <TiArrowSortedUp className='text-base pt-1' />
            </div>

            <h1 className='pl-10'>Min.Profit %</h1>
            <h1>min.Capital USD</h1>

            <div className='flex flex-row items-center space-x-2 '>
              <h1>Commission %</h1>
              <TiArrowSortedUp className='text-base pt-1' />
            </div>

          </div>

          <DisplayCampaigns
            // title="Eosi Protraders"
            isLoading={isLoading}
            campaigns={campaigns}
          />

        </div>
      </div>
    </div>

  )
}

export default Dashboard

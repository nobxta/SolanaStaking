import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [solanaPrice, setSolanaPrice] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stakingData, setStakingData] = useState({ amount: 332, duration: 30, daysLeft: 15, apy: 7.2 });

  useEffect(() => {
    fetchSolanaPrice();
    fetchWalletBalance();
    fetchTransactions();
  }, []);

  const fetchSolanaPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const data = await response.json();
      setSolanaPrice(data.solana.usd);
    } catch (error) {
      console.error("Error fetching Solana price:", error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: ["ENqqKBZQks2mchfQCKwhCadtG8atMUedCMdSywPZuCJR"]
        })
      });
      const data = await response.json();
      setWalletBalance(data.result.value / 1e9);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`https://api.solscan.io/account/transactions?address=ENqqKBZQks2mchfQCKwhCadtG8atMUedCMdSywPZuCJR`);
      const data = await response.json();
      setTransactions(data.data.slice(0, 5)); // Get last 5 transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-black mb-6">Solana Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <motion.div 
            className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300" 
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold text-black mb-4">Wallet Balance</h3>
            <p className="text-gray-700 text-2xl font-semibold">{walletBalance} SOL</p>
          </motion.div>
          {/* Currently Staking */}
          <motion.div 
            className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300" 
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-bold text-black mb-4">Currently Staking</h3>
            <p className="text-gray-700 text-lg">${stakingData.amount} for {stakingData.duration} days</p>
            <p className="text-gray-700">Days Left: {stakingData.daysLeft}</p>
            <p className="text-gray-700 font-semibold">APY: {stakingData.apy}%</p>
          </motion.div>
        </div>
        {/* Live Solana Price */}
        <motion.div 
          className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mt-6" 
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-bold text-black mb-4">Live Solana Price</h3>
          <p className="text-gray-700 text-2xl font-semibold">${solanaPrice}</p>
        </motion.div>
        {/* Recent Transactions */}
        <motion.div 
          className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mt-6" 
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-bold text-black mb-4">Recent Transactions</h3>
          <ul className="text-gray-700">
            {transactions.map((tx, index) => (
              <li key={index} className="mb-2">
                {tx.txHash.slice(0, 15)}... - ${((tx.change / 1e9) * solanaPrice).toFixed(2)}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
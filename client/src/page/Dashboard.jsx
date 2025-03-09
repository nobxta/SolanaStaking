import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [solanaPrice, setSolanaPrice] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stakingData, setStakingData] = useState({
    amount: 332,
    duration: 30,
    daysLeft: 15,
    apy: 7.2,
  });
  const [recentDeposit, setRecentDeposit] = useState(null);

  useEffect(() => {
    fetchSolanaPrice();
    fetchWalletBalance();
    fetchTransactions();
    checkRecentDeposit();
  }, []);

  const fetchSolanaPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data = await response.json();
      setSolanaPrice(data.solana.usd);
    } catch (error) {
      console.error("Error fetching Solana price:", error);
      // Fallback price in case API fails
      setSolanaPrice(100);
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
          params: ["ENqqKBZQks2mchfQCKwhCadtG8atMUedCMdSywPZuCJR"],
        }),
      });
      const data = await response.json();

      // Get balance from API
      let balance = data.result.value / 1e9;

      // If there's a recent deposit, add it to the balance
      const depositAmount = localStorage.getItem("depositAmount");
      if (depositAmount && !isNaN(parseFloat(depositAmount))) {
        balance += parseFloat(depositAmount);
      }

      setWalletBalance(balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);

      // Fallback balance + recent deposit for demo
      const depositAmount = localStorage.getItem("depositAmount");
      setWalletBalance(5000 + (depositAmount ? parseFloat(depositAmount) : 0));
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://api.solscan.io/account/transactions?address=ENqqKBZQks2mchfQCKwhCadtG8atMUedCMdSywPZuCJR`
      );
      const data = await response.json();

      // Prepare transactions from API
      let txList = data.data ? data.data.slice(0, 5) : [];

      // Add recent deposit to transactions if available
      const depositDetails = JSON.parse(
        localStorage.getItem("depositDetails") || "null"
      );
      if (depositDetails) {
        // Add the recent deposit to the top of transactions list
        txList = [
          {
            txHash: depositDetails.txHash,
            change: depositDetails.amount * 1e9, // Convert to lamports for consistency
            timestamp: depositDetails.timestamp,
            isRecent: true,
          },
          ...txList,
        ].slice(0, 5); // Keep only 5 transactions
      }

      setTransactions(txList);
    } catch (error) {
      console.error("Error fetching transactions:", error);

      // Fallback transactions + recent deposit for demo
      const depositDetails = JSON.parse(
        localStorage.getItem("depositDetails") || "null"
      );

      // Create demo transactions
      let demoTransactions = [
        {
          txHash: "7xHG53DFg23hJklM",
          change: -0.5 * 1e9,
          timestamp: Date.now() - 86400000 * 2,
        },
        {
          txHash: "9jNM45PqR78sTuVw",
          change: 2.3 * 1e9,
          timestamp: Date.now() - 86400000 * 3,
        },
        {
          txHash: "3zQw67LpK12xYbNm",
          change: -1.2 * 1e9,
          timestamp: Date.now() - 86400000 * 4,
        },
        {
          txHash: "5aXc89BnM34jKlPq",
          change: 0.8 * 1e9,
          timestamp: Date.now() - 86400000 * 5,
        },
      ];

      // Add recent deposit to transactions if available
      if (depositDetails) {
        demoTransactions = [
          {
            txHash: depositDetails.txHash,
            change: depositDetails.amount * 1e9,
            timestamp: depositDetails.timestamp,
            isRecent: true,
          },
          ...demoTransactions,
        ].slice(0, 5);
      }

      setTransactions(demoTransactions);
    }
  };

  const checkRecentDeposit = () => {
    // Check if there's a recent deposit in localStorage
    const depositAmount = localStorage.getItem("depositAmount");
    const depositUsdValue = localStorage.getItem("depositUsdValue");
    const depositDetails = JSON.parse(
      localStorage.getItem("depositDetails") || "null"
    );

    if (depositAmount && depositDetails) {
      setRecentDeposit({
        amount: parseFloat(depositAmount),
        usdValue: depositUsdValue,
        timestamp: depositDetails.timestamp,
        txHash: depositDetails.txHash,
      });
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-black mb-6">
          Solana Dashboard
        </h2>

        {/* Recent Deposit Alert */}
        {recentDeposit && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded"
          >
            <div className="flex items-center">
              <div className="py-1">
                <svg
                  className="h-6 w-6 text-green-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold">Deposit Successful!</p>
                <p className="text-sm">
                  You've successfully deposited {recentDeposit.amount} SOL ($
                  {recentDeposit.usdValue}) to your wallet.
                </p>
                <p className="text-xs mt-1">
                  Transaction: {recentDeposit.txHash.substring(0, 15)}...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-black mb-4">
              Wallet Balance
            </h3>
            <p className="text-gray-700 text-2xl font-semibold">
              {walletBalance.toFixed(2)} SOL
            </p>
            {solanaPrice && (
              <p className="text-gray-500 text-md">
                ≈ ${(walletBalance * solanaPrice).toFixed(2)} USD
              </p>
            )}
          </motion.div>

          {/* Currently Staking */}
          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-black mb-4">
              Currently Staking
            </h3>
            <p className="text-gray-700 text-lg">
              {stakingData.amount} SOL for {stakingData.duration} days
            </p>
            <p className="text-gray-700">Days Left: {stakingData.daysLeft}</p>
            <p className="text-gray-700 font-semibold">
              APY: {stakingData.apy}%
            </p>
          </motion.div>

          {/* Live Solana Price */}
          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-black mb-4">
              Live Solana Price
            </h3>
            <p className="text-gray-700 text-2xl font-semibold">
              ${solanaPrice}
            </p>
            <p className="text-gray-500 text-sm">
              Updated: {new Date().toLocaleTimeString()}
            </p>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mt-6"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-xl font-bold text-black mb-4">
            Recent Transactions
          </h3>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx, index) => (
                    <tr
                      key={index}
                      className={tx.isRecent ? "bg-green-50" : ""}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a
                          href={`https://solscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {tx.txHash.slice(0, 12)}...
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={
                            tx.change > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {tx.change > 0 ? "+" : ""}
                          {(tx.change / 1e9).toFixed(2)} SOL
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        $
                        {((Math.abs(tx.change) / 1e9) * solanaPrice).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatTimeAgo(tx.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent transactions found.</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate("/deposit")}
              className="px-4 py-2 bg-gradient-to-r from-[#3BC4BD] to-[#52AAC5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              New Deposit
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

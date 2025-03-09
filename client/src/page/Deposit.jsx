import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCopy, FiLink } from "react-icons/fi";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [usdValue, setUsdValue] = useState(0);
  const solanaPrice = 100; // Simulated SOL price in USD
  const navigate = useNavigate();

  const transactions = [
    { id: 1, status: "Pending", amount: "250 SOL", time: "2h ago" },
    { id: 2, status: "Success", amount: "500 SOL", time: "5h ago" },
    { id: 3, status: "Failed", amount: "100 SOL", time: "1d ago" },
    { id: 4, status: "Success", amount: "5 SOL", time: "2d ago" },
  ];

  const wallets = ["Phantom", "Trust Wallet", "MetaMask", "Exodus"];

  const handleAmountChange = (value) => {
    setAmount(value);
    setUsdValue((value * solanaPrice).toFixed(2));
  };

  const handleDeposit = () => {
    // Store amount in localStorage to use it on the next page
    localStorage.setItem("depositAmount", amount);
    localStorage.setItem("depositUsdValue", usdValue);

    // Navigate to payment page
    navigate("/payment-details");
  };

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Deposit Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Deposit SOL
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount (SOL)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#52AAC5] focus:border-[#52AAC5] transition-all duration-200"
            />
            <p className="mt-2 text-sm text-gray-500">≈ ${usdValue} USD</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Available Balance
              </p>
              <p className="text-xl font-semibold text-[#52AAC5]">5,000 SOL</p>
            </div>
          </div>

          <button
            onClick={handleDeposit}
            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-[#3BC4BD] to-[#52AAC5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#52AAC5]"
          >
            Deposit Funds
          </button>
        </div>

        {/* Right Side: Wallet Connection & Transactions */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Connect Wallet */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Connect Wallet
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Wallet
            </label>
            <select
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#52AAC5] focus:border-[#52AAC5] shadow-sm"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            >
              <option value="">Select Wallet</option>
              {wallets.map((w, index) => (
                <option key={index} value={w}>
                  {w}
                </option>
              ))}
            </select>

            <button className="mt-4 w-full py-3 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3BC4BD] to-[#52AAC5] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#52AAC5]">
              <FiLink className="w-5 h-5" /> Connect
            </button>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Transactions
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                        {tx.amount}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tx.status === "Success"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {tx.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm font-medium text-[#52AAC5] hover:text-[#3BC4BD]"
              >
                View All Transactions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deposit;

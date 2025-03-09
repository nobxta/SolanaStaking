import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";

const Withdraw = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(1250.75); // Mock balance
  const [solPrice, setSolPrice] = useState(103.42); // Mock SOL price
  const [message, setMessage] = useState(null);

  const handleMaxWithdraw = () => {
    setAmount(balance.toFixed(2));
  };

  const handleWithdraw = () => {
    if (!walletAddress.trim()) {
      setMessage({ text: "Please enter a valid wallet address!", type: "error" });
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setMessage({ text: "Please enter a valid withdrawal amount!", type: "error" });
      return;
    }

    if (amountNumber > balance) {
      setMessage({ text: "Insufficient balance!", type: "error" });
      return;
    }

    // Mock withdrawal processing
    setBalance(balance - amountNumber);
    setMessage({
      text: `Withdrawal request of ${amount} SOL sent to ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
      type: "success",
    });

    // Reset fields
    setAmount("");
    setWalletAddress("");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-900">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-[10px_10px_20px_#d1d5db,-10px_-10px_20px_#ffffff] border border-gray-200">
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-center">
          Withdraw Funds
        </h2>
        <p className="text-gray-500 mt-2 text-center">Securely withdraw your SOL funds.</p>

        {/* Balance Display */}
        <div className="mt-6 bg-white p-5 rounded-2xl flex justify-between items-center shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] border border-gray-100">
          <span className="text-[#14F195] text-lg font-bold">Balance:</span>
          <span className="text-gray-800 text-lg font-semibold">{balance.toFixed(2)} SOL</span>
        </div>

        {/* Amount Input */}
        <div className="mt-6">
          <label className="block text-gray-600 font-medium">Amount (SOL)</label>
          <div className="flex items-center bg-[#F0F4F8] p-4 rounded-lg shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] border border-gray-100">
            <span className="text-[#9945FF] font-bold mr-2">💰 SOL</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 font-medium"
              min="0"
              step="0.01"
            />
            <button className="text-blue-500 text-sm font-semibold hover:underline ml-2" onClick={handleMaxWithdraw}>
              Max
            </button>
          </div>
        </div>

        {/* Wallet Address Input */}
        <div className="mt-6">
          <label className="block text-gray-600 font-medium">Solana Wallet Address</label>
          <div className="flex items-center bg-[#F0F4F8] p-4 rounded-lg shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] border border-gray-100">
            <FaWallet className="text-[#14F195] mr-2" />
            <input
              type="text"
              placeholder="Enter your Solana wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-3 text-center rounded-lg font-medium ${
              message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Withdraw Button */}
        <button
          className="w-full mt-6 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-3 rounded-xl font-semibold shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] hover:shadow-[2px_2px_6px_#d1d5db,-2px_-2px_6px_#ffffff] transition-all"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>

        {/* SOL Price Display */}
        <div className="mt-4 bg-[#F0F4F8] p-3 rounded-xl text-center text-gray-600 font-medium shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] border border-gray-100">
          SOL = ${solPrice.toFixed(2)}
        </div>
      </div>
    </section>
  );
};

export default Withdraw;

import React, { useState } from "react";

const stakingPlans = [
  { duration: 7, roi: 0.05 },
  { duration: 15, roi: 0.07 },
  { duration: 30, roi: 0.1 },
  { duration: 60, roi: 0.12 },
  { duration: 90, roi: 0.15 },
];

const getROI = (duration) => {
  return (
    stakingPlans.find((plan) => plan.duration === duration)?.roi ||
    stakingPlans[stakingPlans.length - 1].roi
  );
};

const SOL_PRICE = 22; // Solana price in USD

const InvestmentCalculator = ({ walletBalance, onStartStaking }) => {
  const [amount, setAmount] = useState(100);
  const [duration, setDuration] = useState(30);
  const roi = getROI(duration);

  const netProfit = amount * roi * duration;
  const totalReturn = amount + netProfit;
  const dailyProfit = netProfit / duration;

  const handleStartStaking = () => {
    if (amount > walletBalance) {
      alert("You cannot stake more than your wallet balance.");
      return;
    }
    onStartStaking({ amount, duration });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-700">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Solana Staking Calculator
          </h1>
          <p className="text-gray-400 text-lg">
            Calculate your potential earnings with our staking simulator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Investment Input Section */}
          <div className="p-6 bg-gray-700 rounded-2xl border border-gray-600 shadow-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              Investment Parameters
            </h2>

            {/* Amount Slider */}
            <label className="text-gray-400">Amount (SOL)</label>
            <input
              type="range"
              min="10"
              max={walletBalance}
              step="1"
              value={amount}
              className="w-full accent-purple-500"
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <p className="text-purple-400 text-sm mt-2 text-center font-semibold">
              {amount} SOL{" "}
              <span className="text-gray-500 text-xs">
                (~${(amount * SOL_PRICE).toFixed(2)} USD)
              </span>
            </p>

            {/* Duration Slider */}
            <label className="text-gray-400 mt-4">
              Staking Duration (Days)
            </label>
            <input
              type="range"
              min="7"
              max="90"
              step="1"
              value={duration}
              className="w-full accent-blue-500"
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
            <p className="text-blue-400 text-sm mt-2 text-center font-semibold">
              {duration} Days
            </p>

            {/* Start Staking Button */}
            <button
              onClick={handleStartStaking}
              className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Start Staking
            </button>
          </div>

          {/* Staking Returns Section */}
          <div className="p-6 bg-gray-700 rounded-2xl border border-gray-600 shadow-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              Staking Returns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-600/10 p-6 border border-purple-500/20 rounded-xl text-center">
                <p className="text-gray-300">Daily Profit</p>
                <h3 className="text-2xl font-bold text-purple-400">
                  {dailyProfit.toFixed(4)} SOL
                </h3>
                <p className="text-gray-500 text-xs">
                  (~${(dailyProfit * SOL_PRICE).toFixed(2)} USD)
                </p>
              </div>
              <div className="bg-blue-600/10 p-6 border border-blue-500/20 rounded-xl text-center">
                <p className="text-gray-300">Total ROI</p>
                <h3 className="text-2xl font-bold text-blue-400">
                  {(roi * 100).toFixed(2)}%
                </h3>
              </div>
              <div className="bg-green-600/10 p-6 border border-green-500/20 rounded-xl text-center">
                <p className="text-gray-300">Total Return</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {totalReturn.toFixed(2)} SOL
                </h3>
                <p className="text-gray-500 text-xs">
                  (~${(totalReturn * SOL_PRICE).toFixed(2)} USD)
                </p>
              </div>
              <div className="bg-gray-600/10 p-6 border border-gray-500/20 rounded-xl text-center">
                <p className="text-gray-300">Net Profit</p>
                <h3 className="text-2xl font-bold text-gray-300">
                  {netProfit.toFixed(2)} SOL
                </h3>
                <p className="text-gray-500 text-xs">
                  (~${(netProfit * SOL_PRICE).toFixed(2)} USD)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentCalculator;

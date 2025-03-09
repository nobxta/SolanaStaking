import { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

const SolanaWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [sendModal, setSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [usdValue, setUsdValue] = useState(0);
  const [solPrice, setSolPrice] = useState(100);
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fetchSolPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const data = await response.json();
      setSolPrice(data.solana.usd);
    } catch (error) {
      console.error("Error fetching SOL price:", error);
    }
  };

  const fetchBalance = async () => {
    if (!walletAddress) return;
    try {
      const balanceLamports = await connection.getBalance(new PublicKey(walletAddress));
      setBalance((balanceLamports / LAMPORTS_PER_SOL).toFixed(4));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUsdValue(sendAmount * solPrice);
  }, [sendAmount, solPrice]);

  useEffect(() => {
    if (walletAddress) fetchBalance();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
        setTimeout(fetchBalance, 2000);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Phantom Wallet not found. Please install it.");
      window.open("https://phantom.app/", "_blank");
    }
  };

  const sendSol = async () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) return alert("Enter a valid SOL amount!");
    if (!targetAddress || targetAddress.length !== 44) return alert("Invalid recipient address!");
    if (parseFloat(sendAmount) > parseFloat(balance)) return alert("Insufficient balance!");
    
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletAddress),
          toPubkey: new PublicKey(targetAddress),
          lamports: parseFloat(sendAmount) * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = new PublicKey(walletAddress);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      const signedTransaction = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);
      alert("✅ Transaction Successful! Signature: " + signature);
      setSendModal(false);
      setTimeout(fetchBalance, 3000);
    } catch (error) {
      console.error("🚨 Transaction failed:", error);
      alert("❌ Transaction failed! Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-5 animate-fadeIn">
      <div className="bg-gray-900 shadow-xl rounded-xl p-8 w-full max-w-md text-white border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400 animate-pulse">Solana Wallet</h2>
        {walletAddress ? (
          <>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400">Wallet Address:</p>
              <p className="font-mono text-sm bg-gray-800 p-2 rounded break-all">{walletAddress}</p>
            </div>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold">Balance:</p>
              <p className="text-2xl text-green-400">{balance} SOL</p>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => setSendModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-lg transition-all">Send</button>
              <button onClick={fetchBalance} className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-lg transition-all">🔄 Refresh Balance</button>
              <button onClick={() => setWalletAddress(null)} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-lg transition-all">Disconnect</button>
            </div>
          </>
        ) : (
          <button onClick={connectWallet} className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg w-full text-lg transition-all">Connect Wallet</button>
        )}
      </div>

      {sendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg text-white w-96 border border-gray-700 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Send SOL</h3>
            <input type="number" placeholder="Amount (SOL)" className="border p-2 w-full rounded-lg bg-gray-800 text-white" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
            <p className="text-sm text-gray-400">≈ ${usdValue.toFixed(2)} USD</p>
            <input type="text" placeholder="Recipient Address" className="border p-2 w-full rounded-lg bg-gray-800 text-white mt-2" value={targetAddress} onChange={(e) => setTargetAddress(e.target.value)} />
            <button onClick={sendSol} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full transition-all">Send</button>
            <button onClick={() => setSendModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-3 w-full transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolanaWallet;

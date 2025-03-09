import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: "",
  });
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/users/" + user.email)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeEmail = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    setIsChangingEmail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex justify-center items-center p-6">
      <div className="max-w-lg w-full backdrop-blur-lg bg-black/30 p-8 rounded-xl border border-purple-500/20 shadow-lg">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <label htmlFor="profile-upload" className="relative cursor-pointer group">
            <div className="w-40 h-40 rounded-full border-2 border-cyan-400/50 overflow-hidden flex items-center justify-center text-gray-400 bg-gray-700 group-hover:scale-105 transition-all duration-300">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>No PFP</span>
              )}
            </div>
            <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
          </label>
        </div>

        {/* User Information */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text">
            {user.name}
          </h1>
          <p className="mt-2 text-gray-300">{user.email}</p>
          <button className="mt-2 text-sm px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 hover:border-cyan-400/50 transition-all duration-300" onClick={handleChangeEmail}>
            Change Email
          </button>
        </div>
      </div>

      {/* Email Change Modal */}
      {otpSent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white">Verify Your Identity</h3>
            <p className="text-gray-400 mt-2">OTP sent to {user.email}. Please verify.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mt-4 border border-purple-500/30 rounded-lg bg-black text-white"
              placeholder="Enter OTP"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-600" onClick={() => setOtpSent(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400" onClick={handleVerifyOtp}>Verify</button>
            </div>
          </div>
        </div>
      )}

      {isChangingEmail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white">Update Email</h3>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 mt-4 border border-purple-500/30 rounded-lg bg-black text-white"
              placeholder="Enter new email"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-600" onClick={() => setIsChangingEmail(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400">Update Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowLeft, User, Mail, Calendar, Save } from "lucide-react";

const Profile = () => {
	const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);

    } catch (error) {
      console.error(error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const token = localStorage.getItem("token");

      const res = await api.put(
        "/auth/profile",
        {
          username,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      setSuccess("Profile updated successfully");

			setTimeout(() => {
				navigate("/chat");
			}, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/chat")}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          {/* Header with Cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          {/* Avatar Section */}
          <div className="relative px-6 pb-6">
            <div className="flex justify-center -mt-12 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-900">
              Profile Settings
            </h1>
            <p className="text-center text-gray-400 text-sm mt-1">
              Manage your account information
            </p>
          </div>

          {/* Form Content */}
          <div className="px-6 pb-8">
            {/* Alert Messages */}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-emerald-700">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              {/* Joined Date Field */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Member Since
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes...
                    </span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/chat")}
                  className="w-full py-2.5 rounded-xl text-gray-400 hover:text-gray-600 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
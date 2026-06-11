import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

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
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-2xl font-bold mt-4">
            Profile
          </h1>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Joined
            </label>

            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>

          <button
            onClick={updateProfile}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;
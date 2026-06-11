import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);

    } catch (error) {
      console.error(error);
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
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        Profile
      </h1>

      <div className="space-y-4">
        <div>
          <p className="text-gray-500">
            Username
          </p>
          <p className="font-medium">
            {user.username}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Email
          </p>
          <p className="font-medium">
            {user.email}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Joined
          </p>
          <p className="font-medium">
            {new Date(
              user.createdAt
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
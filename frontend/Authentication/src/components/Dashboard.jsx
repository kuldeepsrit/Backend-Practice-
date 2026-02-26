import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/dashboard", {
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setUser(data.user);

      } catch (error) {
        alert("Not Authorized");
        navigate("/");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      navigate("/");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-96 text-center space-y-6">
        
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard 🚀
        </h2>

        {user ? (
          <div>
            <p className="text-lg text-gray-600">Welcome,</p>
            <p className="text-xl font-semibold text-indigo-600 mt-2">
              {user.email}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
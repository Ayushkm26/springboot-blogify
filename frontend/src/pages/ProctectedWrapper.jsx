import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true); // backend accepted token
        } else {
          setIsAuthenticated(false); // invalid/expired token
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, [token]);

  if (isAuthenticated === null) {
    // still checking → loading state
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">
          🔄 Verifying your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedWrapper;

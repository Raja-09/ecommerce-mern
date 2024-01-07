// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is present in local storage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if the token exists, otherwise false

    if (token) {
      // Fetch user details using the token
      axios
        .get('http://localhost:5555/users/me', {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUserName(response.data.username);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error.message);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token');

      // Send a request to the logout endpoint

      // Remove the token from local storage
      localStorage.removeItem('token');

      // Clear user details from the state
      setUserName('');
      setIsLoggedIn(false);
      navigate('/');

      // Close the mobile menu after logout
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout Error:', error.response.data);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Ecommerce App
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-white hidden md:inline">Welcome, {userName}!</span>
              <div className="md:hidden">
                {/* Mobile Menu */}
                <button
                  className="text-white focus:outline-none"
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      ></path>
                    )}
                  </svg>
                </button>
                {isMobileMenuOpen && (
                  <div className="absolute top-14 right-0 bg-gray-800 p-4 shadow-md rounded-md">
                    <Link to="/profile" className="text-white block py-2">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="text-white block py-2">
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="text-white hidden md:inline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hidden md:inline">
                Login
              </Link>
              <Link to="/register" className="text-white hidden md:inline">
                Register
              </Link>
              <div className="md:hidden">
                {/* Mobile Menu */}
                <button
                  className="text-white focus:outline-none"
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      ></path>
                    )}
                  </svg>
                </button>
                {isMobileMenuOpen && (
                  <div className="absolute top-14 right-0 bg-gray-800 p-4 shadow-md rounded-md">
                    <Link to="/login" className="text-white block py-2">
                      Login
                    </Link>
                    <Link to="/register" className="text-white block py-2">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

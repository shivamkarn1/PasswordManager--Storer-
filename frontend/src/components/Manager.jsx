import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { savePassword, fetchPasswords,deletePassword } from "../api";
import { useTheme } from "./ThemeContext";
import ExportPDF from "./ExportPDF";
import { toast } from "sonner";
import { FaTrashAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoTrashBinSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

function Manager() {
  const { getToken, isSignedIn, user } = useAuth();
  const { currentTheme, isDarkMode, isTransitioning } = useTheme();
  const [passwords, setPasswords] = useState([]);
  const [form, setForm] = useState({ website: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [copyFeedback, setCopyFeedback] = useState({});
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  // State for deleting
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // New states for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(8); // Adjustable items per page
  
  // State for showing password in form input
  const [showFormPassword, setShowFormPassword] = useState(false);

  useEffect(() => {
    const loadPasswords = async () => {
      if (!isSignedIn) return;
      
      try {
        setLoading(true);
        setError("");
        const token = await getToken();
        if (token) {
          const response = await fetchPasswords(token);
          setPasswords(response.data || []);
          
          // Show welcome message for first-time users or returning users
          if (!hasShownWelcome && user) {
            const firstName = user.firstName || 'User';
            toast.success(`🎉 Welcome back, ${firstName}!`, {
              description: "Your secure vault is ready. All your passwords are safe and encrypted.",
              duration: 2000,
              style: {
                background: isDarkMode ? 'hsl(224 71% 4%)' : 'hsl(0 0% 100%)',
                color: isDarkMode ? 'hsl(213 31% 91%)' : 'hsl(224 71% 4%)',
                border: `1px solid ${isDarkMode ? 'hsl(216 34% 17%)' : 'hsl(220 13% 91%)'}`,
              }
            });
            setHasShownWelcome(true);
          }
        }
      } catch (error) {
        console.error('Failed to load passwords:', error);
        setError('Failed to load passwords. Please try again.');
        toast.error("Failed to load passwords", {
          description: "Please check your connection and try again.",
          duration: 2000
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPasswords();
  }, [getToken, isSignedIn, user, hasShownWelcome, isDarkMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.website || !form.username || !form.password) {
      setError('Please fill in all fields');
      toast.error("Missing Information", {
        description: "Please fill in all fields before saving.",
        duration: 3000,
        style: {
          background: isDarkMode ? 'hsl(224 71% 4%)' : 'hsl(0 0% 100%)',
          color: isDarkMode ? 'hsl(213 31% 91%)' : 'hsl(224 71% 4%)',
          border: `1px solid ${isDarkMode ? 'hsl(0 62% 30%)' : 'hsl(0 84% 60%)'}`,
        }
      });
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = await getToken();
      
      if (!token) {
        setError('Authentication token not found. Please sign in again.');
        toast.error("Authentication Error", {
          description: "Please sign in again to continue.",
          duration: 3000
        });
        return;
      }

      await savePassword(form, token);
      setForm({ website: "", username: "", password: "" });
      
      // Show success toast
      toast.success("🔒 Password Secured!", {
        description: `Successfully saved credentials for ${form.website}`,
        duration: 2000,
        style: {
          background: isDarkMode ? 'hsl(224 71% 4%)' : 'hsl(0 0% 100%)',
          color: isDarkMode ? 'hsl(213 31% 91%)' : 'hsl(224 71% 4%)',
          border: `1px solid ${isDarkMode ? 'hsl(142 76% 36%)' : 'hsl(142 76% 36%)'}`,
        }
      });
      
      // Refresh passwords list
      const response = await fetchPasswords(token);
      setPasswords(response.data || []);
    } catch (error) {
      console.error('Failed to save password:', error);
      setError(`Failed to save password: ${error.message}`);
      toast.error("Save Failed", {
        description: "Failed to save password. Please try again.",
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        toast.error("Authentication Error", {
          description: "Please sign in again to continue.",
          duration: 3000
        });
        return;
      }

      // Use the API function instead of direct fetch
      await deletePassword(id, token);

      setDeleteConfirm(null);
      
      toast.success("🗑️ Password Deleted!", {
        description: "Password entry has been permanently removed.",
        duration: 2000,
        style: {
          background: isDarkMode ? 'hsl(224 71% 4%)' : 'hsl(0 0% 100%)',
          color: isDarkMode ? 'hsl(213 31% 91%)' : 'hsl(224 71% 4%)',
          border: `1px solid ${isDarkMode ? 'hsl(216 34% 17%)' : 'hsl(220 13% 91%)'}`,
        }
      });
      
      // Refresh passwords list
      const passwordsResponse = await fetchPasswords(token);
      setPasswords(passwordsResponse.data || []);
      
    } catch (error) {
      console.error('Failed to delete password:', error);
      setDeleteConfirm(null);
      toast.error("Delete Failed", {
        description: error.message || "Failed to delete password. Please try again.",
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFormPasswordVisibility = () => {
    setShowFormPassword(prev => !prev);
  };

  const copyToClipboard = async (text, type, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback({ [id]: type });
      setTimeout(() => setCopyFeedback({}), 2000);
      
      // Show copy success toast
      const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
      toast.success(`📋 ${typeCapitalized} Copied!`, {
        description: `${typeCapitalized} has been copied to your clipboard securely.`,
        duration: 2000,
        style: {
          background: isDarkMode ? 'hsl(224 71% 4%)' : 'hsl(0 0% 100%)',
          color: isDarkMode ? 'hsl(213 31% 91%)' : 'hsl(224 71% 4%)',
          border: `1px solid ${isDarkMode ? 'hsl(216 34% 17%)' : 'hsl(220 13% 91%)'}`,
        }
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Copy Failed", {
        description: "Unable to copy to clipboard. Please try again.",
        duration: 2000
      });
    }
  };

  if (!isSignedIn) {
    return (
      <div className={`
        min-h-screen transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950' 
          : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
        }
        flex items-center justify-center p-4
        ${isTransitioning ? 'animate-pulse' : ''}
      `}>
        <div className={`
          w-full max-w-md rounded-3xl shadow-2xl border p-8
          transition-all duration-300 ease-in-out
          ${isDarkMode 
            ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-sm' 
            : 'bg-white/80 border-zinc-200 backdrop-blur-sm'
          }
        `}>
          <div className="text-center">
            <div className={`
              mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg
              transition-all duration-300 ease-in-out
              ${isDarkMode 
                ? 'bg-gradient-to-br from-zinc-100 to-white' 
                : 'bg-gradient-to-br from-zinc-900 to-zinc-700'
              }
            `}>
              <svg className={`w-10 h-10 transition-colors duration-300 ${isDarkMode ? 'text-zinc-900' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className={`
              text-2xl font-bold mb-2 transition-colors duration-300
              ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}
            `} style={{ fontFamily: "'Handlee', cursive" }}>Access Required</h2>
            <p className={`transition-colors duration-300 font-source-code ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Please sign in to access your secure password vault
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter and pagination logic
  const filteredPasswords = passwords
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
    .filter(password =>
      password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredPasswords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPasswords = filteredPasswords.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={`
      min-h-screen transition-all duration-300 ease-in-out
      ${isDarkMode 
        ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950' 
        : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
      }
      ${isTransitioning ? 'animate-pulse' : ''}
    `}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className={`
            inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-2xl mb-8
            transition-all duration-300 ease-in-out
            ${isDarkMode 
              ? 'bg-gradient-to-br from-zinc-100 to-white' 
              : 'bg-gradient-to-br from-zinc-900 to-zinc-700'
            }
          `}>
            <svg className={`w-12 h-12 transition-colors duration-300 ${isDarkMode ? 'text-zinc-900' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className={`
            text-6xl font-black mb-4 leading-tight transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent'
            }
          `} style={{ fontFamily: "'Libertinus Keyboard', monospace" }}>
            SECURE VAULT
          </h1>
          
          <div className={`
            w-24 h-1 mx-auto mb-6 transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-transparent via-zinc-600 to-transparent' 
              : 'bg-gradient-to-r from-transparent via-zinc-400 to-transparent'
            }
          `}></div>
          
          <p className={`
            text-xl mb-8 max-w-3xl mx-auto leading-relaxed font-source-code transition-colors duration-300
            ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}
          `}>
            Enterprise-grade password management with military-level security
          </p>
          
          <div className="flex justify-center">
            <ExportPDF passwords={passwords} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`
            mb-8 border rounded-2xl p-6 transition-all duration-300
            ${isDarkMode 
              ? 'bg-red-950/50 border-red-800/50 backdrop-blur-sm' 
              : 'bg-red-50 border-red-200'
            }
          `}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-3 transition-colors duration-300 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className={`font-medium font-source-code transition-colors duration-300 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Add Password Form */}
        <div className={`
          mb-12 rounded-3xl shadow-2xl border transition-all duration-300
          ${isDarkMode 
            ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-sm' 
            : 'bg-white/80 border-zinc-200 backdrop-blur-sm'
          }
        `}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}
              `}>
                <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-zinc-900' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} style={{ fontFamily: "'Handlee', cursive" }}>
                  Add New Entry
                </h2>
                <p className={`font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Securely store a new password entry
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className={`text-sm font-semibold flex items-center gap-2 font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    Platform
                  </label>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="Enter platform name"
                    className={`
                      montserrat-input w-full h-12 px-4 border rounded-xl placeholder-zinc-500 
                      focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${isDarkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                      }
                    `}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold flex items-center gap-2 font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username or email"
                    className={`
                      montserrat-input w-full h-12 px-4 border rounded-xl placeholder-zinc-500 
                      focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${isDarkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                      }
                    `}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold flex items-center gap-2 font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      type={showFormPassword ? "text" : "password"}
                      className={`
                        montserrat-input w-full h-12 px-4 pr-12 border rounded-xl placeholder-zinc-500 
                        focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                        ${isDarkMode 
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                        }
                      `}
                      style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleFormPasswordVisibility}
                      className={`
                        absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200
                        ${isDarkMode 
                          ? 'text-zinc-400 hover:text-zinc-200' 
                          : 'text-zinc-500 hover:text-zinc-700'
                        }
                      `}
                    >
                      {showFormPassword ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  type="submit" 
                  className={`
                    h-12 px-8 font-semibold text-base rounded-xl shadow-lg transition-all duration-200 
                    transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2 font-source-code
                    ${isDarkMode 
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }
                  `}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Securing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Passwords List */}
        <div className={`
          rounded-3xl shadow-2xl border transition-all duration-300
          ${isDarkMode 
            ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-sm' 
            : 'bg-white/80 border-zinc-200 backdrop-blur-sm'
          }
        `}>
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                  ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}
                `}>
                  <svg className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-zinc-900' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} style={{ fontFamily: "'Handlee', cursive" }}>
                    Your Secure Vault
                  </h2>
                  <p className={`text-sm font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {filteredPasswords.length} of {passwords.length} {passwords.length === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              {passwords.length > 0 && (
                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search passwords..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`
                      w-full h-11 pl-10 pr-4 border rounded-xl placeholder-zinc-500 font-source-code text-sm
                      focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${isDarkMode 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:ring-zinc-400'
                      }
                    `}
                  />
                </div>
              )}
            </div>

            {loading && passwords.length === 0 ? (
              <div className="text-center py-12">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300
                  ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}
                `}>
                  <svg className={`w-8 h-8 animate-spin transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className={`font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Loading your secure vault...
                </p>
              </div>
            ) : passwords.length === 0 ? (
              <div className="text-center py-12">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300
                  ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}
                `}>
                  <svg className={`w-8 h-8 transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} style={{ fontFamily: "'Handlee', cursive" }}>
                  Your vault is empty
                </h3>
                <p className={`font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Add your first password entry using the form above
                </p>
              </div>
            ) : filteredPasswords.length === 0 ? (
              <div className="text-center py-12">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300
                  ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}
                `}>
                  <svg className={`w-8 h-8 transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} style={{ fontFamily: "'Handlee', cursive" }}>
                  No passwords found
                </h3>
                <p className={`font-source-code transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <>
                {/* Responsive Grid - Compact Mobile Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {currentPasswords.map((password) => (
                    <div 
                      key={password._id} 
                      className={`
                        relative group rounded-2xl p-4 md:p-6 border transition-all duration-300 transform hover:scale-[1.02]
                        ${isDarkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-700/50 hover:border-gray-600' 
                          : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg'
                        }
                      `}
                    >
                      {/* Mobile-Optimized Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {password.website.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`font-semibold text-base md:text-lg leading-tight truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {password.website}
                            </h3>
                            <p className={`text-xs text-gray-500 dark:text-gray-400 truncate`}>
                              {new Date(password.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-200">
                          {deleteConfirm === password._id ? (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleDelete(password._id)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-xs"
                                disabled={loading}
                              >
                                {loading ? (
                                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <MdDeleteForever className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className={`p-2 rounded-lg transition-colors duration-200 text-xs ${
                                  isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                                disabled={loading}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(password._id)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode 
                                  ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300' 
                                  : 'hover:bg-red-50 text-red-500 hover:text-red-600'
                              }`}
                            >
                              <RiDeleteBin6Line className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Compact Info Grid */}
                      <div className="space-y-3">
                        {/* Username Row */}
                        <div className="group/item">
                          <div className="flex items-center justify-between">
                            <label className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Username
                            </label>
                            <button
                              onClick={() => copyToClipboard(password.username, 'username', password._id)}
                              className={`opacity-0 group-hover/item:opacity-100 md:opacity-100 p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                isDarkMode 
                                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                              }`}
                              title="Copy username"
                            >
                              {copyFeedback[password._id] === 'username' ? (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                                </svg>
                              )}
                            </button>
                          </div>
                          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                             style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace' }}>
                            {password.username}
                          </p>
                        </div>

                        {/* Password Row */}
                        <div className="group/item">
                          <div className="flex items-center justify-between">
                            <label className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Password
                            </label>
                            <div className="flex items-center space-x-2 opacity-0 group-hover/item:opacity-100 md:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => togglePasswordVisibility(password._id)}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                  isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                }`}
                                title={showPassword[password._id] ? "Hide password" : "Show password"}
                              >
                                {showPassword[password._id] ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(password.password, 'password', password._id)}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                  isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                }`}
                                title="Copy password"
                              >
                                {copyFeedback[password._id] === 'password' ? (
                                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                             style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace' }}>
                            {showPassword[password._id] ? password.password : '••••••••••••'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
                    <div className={`text-sm font-source-code ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPasswords.length)} of {filteredPasswords.length} entries
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1
                          ${currentPage === 1 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105'
                          }
                          ${isDarkMode 
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700' 
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                          }
                        `}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`
                              w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105
                              ${page === currentPage
                                ? isDarkMode 
                                  ? 'bg-blue-600 text-white shadow-lg' 
                                  : 'bg-blue-500 text-white shadow-lg'
                                : isDarkMode 
                                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700' 
                                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                              }
                            `}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1
                          ${currentPage === totalPages 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105'
                          }
                          ${isDarkMode 
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700' 
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                          }
                        `}
                      >
                        Next
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`
              w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all duration-300
              ${isDarkMode 
                ? 'bg-zinc-900 border-zinc-700' 
                : 'bg-white border-zinc-200'
              }
            `}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}
                `}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} style={{ fontFamily: "'Handlee', cursive" }}>
                    Confirm Deletion
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  Are you sure you want to delete the password for{' '}
                  <span className="font-semibold">
                    {passwords.find(p => p._id === deleteConfirm)?.website}
                  </span>
                  ?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`
                    flex-1 h-11 px-4 font-medium rounded-xl transition-all duration-200 border
                    ${isDarkMode 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                    }
                  `}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 h-11 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <RiDeleteBin6Line className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Manager;
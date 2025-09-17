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
  const { currentTheme } = useTheme();
  const [passwords, setPasswords] = useState([]);
  const [form, setForm] = useState({ website: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [copyFeedback, setCopyFeedback] = useState({});
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  // State for deleting
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
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
          duration: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPasswords();
  }, [getToken, isSignedIn, user, hasShownWelcome]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.website || !form.username || !form.password) {
      setError('Please fill in all fields');
      toast.error("Missing Information", {
        description: "Please fill in all fields before saving.",
        duration: 3000
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
        duration: 3000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
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
        duration: 3000
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
        duration: 3000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
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
        duration: 3000
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
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2" style={{ fontFamily: "'Handlee', cursive" }}>Access Required</h2>
            <p className="text-slate-600 dark:text-slate-400 font-source-code">Please sign in to access your secure password vault</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-3xl shadow-2xl mb-8">
            <svg className="w-12 h-12 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent leading-tight" style={{ fontFamily: "'Libertinus Keyboard', monospace" }}>
            SECURE VAULT
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto mb-6"></div>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed font-source-code">
            Enterprise-grade password management with military-level security
          </p>
          
          <div className="flex justify-center">
            <ExportPDF passwords={passwords} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 dark:text-red-200 font-medium font-source-code">{error}</span>
            </div>
          </div>
        )}

        {/* Add Password Form */}
        <div className="mb-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Handlee', cursive" }}>Add New Entry</h2>
                <p className="text-slate-600 dark:text-slate-400 font-source-code">Securely store a new password entry</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-source-code">
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
                    className="montserrat-input w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-source-code">
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
                    className="montserrat-input w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-source-code">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Password
                  </label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    type="password"
                    className="montserrat-input w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  type="submit" 
                  className="h-12 px-8 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white font-semibold text-base rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2 font-source-code"
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Handlee', cursive" }}>Your Secure Vault</h2>
                  <p className="text-slate-600 dark:text-slate-400 font-source-code">
                    {passwords.length} {passwords.length === 1 ? 'entry' : 'entries'} stored securely
                  </p>
                </div>
              </div>
            </div>

            {loading && passwords.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                  <svg className="w-8 h-8 animate-spin text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-source-code">Loading your secure vault...</p>
              </div>
            ) : passwords.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                  <svg className="w-8 h-8 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2" style={{ fontFamily: "'Handlee', cursive" }}>Your vault is empty</h3>
                <p className="text-slate-600 dark:text-slate-400 font-source-code">
                  Add your first password entry using the form above
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {passwords.map((password) => (
                  <div 
                    key={password._id} 
                    className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all duration-200"
                  >
                    {/* View Mode Only */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide font-source-code">Platform</label>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 dark:text-slate-100 font-medium" style={{ fontFamily: "'Goldman', cursive" }}>
                            {password.website}
                          </span>
                          <button
                            onClick={() => copyToClipboard(password.website, 'website', password._id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Copy website"
                          >
                            {copyFeedback[password._id] === 'website' ? (
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide font-source-code">Username</label>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 dark:text-slate-100 font-medium" style={{ fontFamily: "'Goldman', cursive" }}>
                            {password.username}
                          </span>
                          <button
                            onClick={() => copyToClipboard(password.username, 'username', password._id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Copy username"
                          >
                            {copyFeedback[password._id] === 'username' ? (
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide font-source-code">Password</label>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 dark:text-slate-100 font-medium" style={{ fontFamily: "'Goldman', cursive" }}>
                            {showPassword[password._id] ? password.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(password._id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title={showPassword[password._id] ? "Hide password" : "Show password"}
                          >
                            {showPassword[password._id] ? (
                              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(password.password, 'password', password._id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Copy password"
                          >
                            {copyFeedback[password._id] === 'password' ? (
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide font-source-code">Created</label>
                        <div className="text-slate-600 dark:text-slate-400 text-sm font-source-code">
                          {new Date(password.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Delete Button Only */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide font-source-code">Actions</label>
                        <div className="flex gap-2">
                          {deleteConfirm === password._id ? (
                            // Enhanced Confirmation UI
                            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 min-w-[280px] shadow-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm" style={{ fontFamily: "'Handlee', cursive" }}>
                                    Delete Password?
                                  </h4>
                                  <p className="text-xs text-red-600 dark:text-red-400 font-source-code">
                                    This action cannot be undone
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-red-100 dark:bg-red-900 rounded-lg p-3 mb-4">
                                <p className="text-xs text-red-700 dark:text-red-300 font-source-code mb-1">
                                  <span className="font-semibold">Platform:</span> {password.website}
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 font-source-code">
                                  <span className="font-semibold">Username:</span> {password.username}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDelete(password._id)}
                                  className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg group font-source-code text-sm font-semibold disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                                  title="Confirm delete"
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
                                      <MdDeleteForever className="w-4 h-4 group-hover:animate-pulse" />
                                      Yes, Delete
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="flex-1 h-10 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-source-code text-sm font-semibold flex items-center justify-center gap-2"
                                  title="Cancel delete"
                                  disabled={loading}
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Enhanced Delete Button
                            <div className="relative group">
                              <button
                                onClick={() => setDeleteConfirm(password._id)}
                                className="relative p-3 bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl group overflow-hidden border border-red-400 hover:border-red-300"
                                title="Delete password entry"
                              >
                                {/* Animated background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-600 opacity-0 group-hover:opacity-30 transition-all duration-300 animate-pulse"></div>
                                
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-12 transition-all duration-700"></div>
                                
                                {/* Icon with enhanced animations */}
                                <div className="relative z-10 flex items-center justify-center">
                                  <RiDeleteBin6Line className="w-5 h-5 group-hover:animate-bounce transition-all duration-200 group-hover:scale-110" />
                                </div>

                                {/* Ripple effect on hover */}
                                <div className="absolute inset-0 rounded-xl bg-red-300 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                              </button>

                              {/* Enhanced Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg border border-slate-700 dark:border-slate-300 font-source-code whitespace-nowrap z-20">
                                <div className="relative">
                                  Delete this password
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manager;
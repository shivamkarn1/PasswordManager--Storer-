import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { savePassword, fetchPasswords } from "../api";
import { useTheme } from "./ThemeContext";
import ExportPDF from "./ExportPDF";

function Manager() {
  const { getToken, isSignedIn } = useAuth();
  const { currentTheme } = useTheme();
  const [passwords, setPasswords] = useState([]);
  const [form, setForm] = useState({ website: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        }
      } catch (error) {
        console.error('Failed to load passwords:', error);
        setError('Failed to load passwords. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPasswords();
  }, [getToken, isSignedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.website || !form.username || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = await getToken();
      
      if (!token) {
        setError('Authentication token not found. Please sign in again.');
        return;
      }

      await savePassword(form, token);
      setForm({ website: "", username: "", password: "" });
      
      // Refresh passwords list
      const response = await fetchPasswords(token);
      setPasswords(response.data || []);
    } catch (error) {
      console.error('Failed to save password:', error);
      setError(`Failed to save password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.colors.background}`}>
        <p className={`text-xl ${currentTheme.colors.text}`}>Please sign in to access the password manager.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.colors.background} px-4 sm:px-6`}>
      <main className={`flex-1 max-w-7xl mx-auto w-full px-4 py-16 ${currentTheme.colors.text}`}>
        <header className="text-center mb-4 sm:mb-8 pt-8 sm:pt-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            YOUR PASSWORD's 🔐
          </h1>
          <p className="text-lg text-gray-600">
            Your Secure Password Vault 💼 Forget to Remember Now 😎
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4">
            <ExportPDF passwords={passwords} />
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Platform (e.g. Platform / Website Name 🔑)"
              className="border p-2 rounded flex-1"
              required
            />
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username or Email 👤"
              className="border p-2 rounded flex-1"
              required
            />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password Here.."
              className="border p-2 rounded flex-1"
              type="password"
              required
            />
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Password'}
            </button>
          </div>
        </form>

        <div>
          <h2 className="text-xl font-bold mb-4">Stored Passwords 🗄️</h2>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading passwords...</p>
          ) : passwords.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No passwords stored yet 📭
            </p>
          ) : (
            <div className="space-y-2">
              {passwords.map((item, idx) => (
                <div key={item._id || idx} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1">
                      <strong className="text-blue-600">{item.website}</strong>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-600">Username: </span>
                      <span>{item.username}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-600">Password: </span>
                      <span className="font-mono">{"•".repeat(item.password?.length || 8)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Manager;
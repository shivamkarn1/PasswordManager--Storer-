const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const savePassword = async (passwordData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
};

export const fetchPasswords = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/passwords`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching passwords:', error);
    throw error;
  }
};

export const deletePassword = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
};
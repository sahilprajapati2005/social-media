const login = async (userData) => {
  const response = await axios.post('/api/users/login', userData);

  if (response.data) {
    // This saves the user object (and their token) to the browser
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};
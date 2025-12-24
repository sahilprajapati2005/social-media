import api from '../../utils/axios';

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

// You can add register/logout here later
const authService = {
  login,
};

export default authService;
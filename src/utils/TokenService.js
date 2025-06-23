const TOKEN_KEY = "jwt"; // o "token", pero consistente con LoginUser
const TokenService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
  },
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};
export default TokenService;

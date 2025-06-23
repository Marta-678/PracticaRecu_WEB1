// hacerlo así perimite 




const TokenService = {
  getToken: () => {
      return localStorage.getItem("jwt"); 
  },
  setToken: (token) => {
      localStorage.setItem("jwt", token);
  },
  clearToken: () => {
      localStorage.removeItem("jwt");
  },
};

export default TokenService;

  


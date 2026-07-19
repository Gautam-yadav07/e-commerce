export const RATE_LIMIT = {
  login: {
    prefix: "login",
    limit: 5,
    windowInSeconds: 60,
  },

  register: {
    prefix: "register",
    limit: 3,
    windowInSeconds: 3600,
  },

  forgotPassword: {
    prefix: "forgot-password",
    limit: 3,
    windowInSeconds: 900,
  },

  resetPassword: {
    prefix: "reset-password",
    limit: 3,
    windowInSeconds: 600,
  },


};
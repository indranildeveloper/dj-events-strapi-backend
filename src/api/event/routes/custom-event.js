module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/events/me",
      handler: "event.me",
      config: {},
    },
  ],
};

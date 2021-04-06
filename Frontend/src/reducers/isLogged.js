const loggedReducer = (state = { username: "", email: "" }, action) => {
  switch (action.type) {
    case "LOG_IN":
      state = { username: action.payload,email:action.email };
      return state;
    default:
      return state;
  }
};

export default loggedReducer;

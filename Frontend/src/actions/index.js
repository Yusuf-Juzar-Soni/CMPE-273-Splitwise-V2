const logged = (username,email) => ({ type: "LOG_IN", payload: username, email:email });
export default logged;

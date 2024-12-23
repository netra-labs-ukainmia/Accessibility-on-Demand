/** @jsx React.createElement */
const { useState } = React;

function App() {
  const [authState, setAuthState] = useState("logged_out");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(10);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthState("logged_in");
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState("logged_out");
  };

  if (authState === "logged_out") {
    return React.createElement(Login, { onLogin: handleLogin });
  }

  return React.createElement(
    "div",
    { className: "min-h-screen" },
    React.createElement(Header, {
      user: user,
      onLogout: handleLogout,
      balance: balance
    }),
    React.createElement(
      "main",
      { className: "p-8" },
      React.createElement(DocumentList)
    )
  );
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
/** @jsx React.createElement */
const { useState } = React;

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (email === "demo@example.com" && password === "demo123") {
        onLogin({
          email,
          name: "Demo User",
          role: "admin"
        });
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(
    "div",
    { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4" },
    React.createElement(
      "div",
      { className: "max-w-md w-full space-y-8" },
      React.createElement(
        "form",
        { onSubmit: handleSubmit, className: "mt-8 space-y-6" },
        React.createElement(
          "h2",
          { className: "text-center text-3xl font-bold" },
          "Sign In"
        ),
        error && React.createElement(
          "div",
          { className: "bg-red-50 text-red-600 p-3 rounded" },
          error
        ),
        React.createElement(
          "div",
          null,
          React.createElement("input", {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Email",
            className: "w-full p-2 border rounded mb-3"
          }),
          React.createElement("input", {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "Password",
            className: "w-full p-2 border rounded mb-3"
          }),
          React.createElement(
            "button",
            {
              type: "submit",
              disabled: isLoading,
              className: "w-full bg-blue-600 text-white p-2 rounded"
            },
            isLoading ? "Signing in..." : "Sign In"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "mt-4 text-center text-sm text-gray-600" },
        React.createElement("p", null, "Demo credentials:"),
        React.createElement("p", null, "Email: demo@example.com"),
        React.createElement("p", null, "Password: demo123")
      )
    )
  );
}

window.Login = Login;
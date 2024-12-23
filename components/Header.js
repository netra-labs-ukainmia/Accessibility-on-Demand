/** @jsx React.createElement */
const { useState } = React;

function Header({ user, onLogout, balance }) {
  return React.createElement(
    "header",
    { className: "app-header" },
    React.createElement(
      "div",
      { className: "max-w-7xl mx-auto flex justify-between items-center" },
      // Logo section
      React.createElement(
        "div",
        { className: "logo-container" },
        React.createElement(
          "h1",
          { className: "text-2xl font-bold text-blue-600" },
          "Accessibility on Demand"
        )
      ),
      // Right section with balance and user menu
      React.createElement(
        "div",
        { className: "flex items-center space-x-6" },
        // Balance display
        React.createElement(
          "div",
          { className: "balance-display" },
          React.createElement(
            "p",
            { className: "text-sm text-gray-600" },
            "Available Credits"
          ),
          React.createElement(
            "p",
            { className: "text-2xl font-bold text-blue-600" },
            Math.floor(balance),
            " credits"
          ),
          React.createElement(
            "p",
            { className: "text-xs text-gray-500" },
            `(${formatCurrency(balance * CREDIT_PRICING.STANDARD)} value)`
          )
        ),
        // User Menu
        React.createElement(UserMenu, {
          user: user,
          onLogout: onLogout
        })
      )
    )
  );
}

window.Header = Header;
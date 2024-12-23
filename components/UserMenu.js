/** @jsx React.createElement */
const { useState, useEffect, useRef } = React;

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'logout', label: 'Sign Out', icon: '🚪', onClick: onLogout }
  ];

  return React.createElement(
    "div",
    { 
      className: "relative",
      ref: menuRef
    },
    // User Menu Button
    React.createElement(
      "button",
      {
        className: "user-menu-button",
        onClick: () => setIsOpen(!isOpen),
        title: "User menu"
      },
      "👤"
    ),
    // Dropdown Menu
    isOpen && React.createElement(
      "div",
      { className: "user-menu-dropdown" },
      React.createElement(
        "div",
        { className: "user-menu-header" },
        React.createElement(
          "div",
          { className: "font-medium" },
          user.name
        ),
        React.createElement(
          "div",
          { className: "text-sm text-gray-500" },
          user.email
        )
      ),
      React.createElement(
        "div",
        { className: "user-menu-content" },
        menuItems.map(item => 
          React.createElement(
            "div",
            {
              key: item.id,
              className: "menu-item",
              onClick: () => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }
            },
            React.createElement(
              "span",
              { className: "menu-item-icon" },
              item.icon
            ),
            item.label
          )
        )
      )
    )
  );
}

window.UserMenu = UserMenu;
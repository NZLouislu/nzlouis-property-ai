import React from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  const handleLink = () => {
    const windowLink = window.open("about:blank");
    if (windowLink) {
      windowLink.location.href = "https://nzlouis.com";
    }
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#0d9488", // teal.600
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        padding: "12px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          display: "flex",
          alignItems: "center",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <div
          onClick={handleLink}
          style={{
            marginRight: "32px",
            cursor: "pointer",
          }}
        >
          <img
            src="/nzlouis.jpg" // Ensure image is in public folder
            alt="NZLouis.com"
            style={{ width: "100px", height: "30px" }}
          />
        </div>
        <Link
          href="/property"
          style={{
            color: "white",
            fontSize: "18px",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: "transparent",
          }}
        >
          Properties
        </Link>
        <div style={{ flex: 1 }}></div> {/* Spacer */}
      </div>
    </nav>
  );
};

export default NavBar;

import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#f7fafc", padding: "12px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            margin: "16px 0",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div style={{ flex: "1", marginBottom: "8px", color: "#718096" }}>
            &copy; {currentYear} NZ Louis
          </div>
          <div style={{ flex: "1" }}></div> {/* Spacer */}
          <ul
            style={{
              display: "flex",
              flex: "1",
              justifyContent: "flex-end",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            <li style={{ marginRight: "8px" }}>
              <a
                href="https://nzlouis.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#718096",
                  padding: "0 8px",
                  textDecoration: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="https://nzlouis.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#718096",
                  padding: "0 8px",
                  textDecoration: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

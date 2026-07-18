import React from "react";
import "../resources/css/footer.css"

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface GlobalFooterProps {
  brandName?: string;
  brandAccent?: string;
  tagline?: string;
  sections?: FooterSection[];
  copyright?: string;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({
  brandName = "Sarab",
  brandAccent = "Foods",
  tagline = "Operational precision behind culinary excellence.",
  copyright = "© 2026 Sarab Foods Management. All rights reserved.",
  sections = [
    {
      title: "Portal",
      links: [
        {
          label: "Admin Dashboard",
          href: "#",
        },
        {
          label: "Support Tickets",
          href: "#",
        },
        {
          label: "System Status",
          href: "#",
        },
      ],
    },
    {
      title: "Legal & Security",
      links: [
        {
          label: "Privacy Policy",
          href: "#",
        },
        {
          label: "Terms of Service",
          href: "#",
        },
        {
          label: "Access Logs",
          href: "#",
        },
      ],
    },
  ],
}) => {
  return (
    <footer className="global-footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h2>
            {brandName}
            <span>{brandAccent}</span>
          </h2>

          <p>{tagline}</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          {sections.map((section) => (
            <div
              key={section.title}
              className="link-group"
            >
              <h4>{section.title}</h4>

              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>{copyright}</p>
      </div>
    </footer>
  );
};

export default GlobalFooter;
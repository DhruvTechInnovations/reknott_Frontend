"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const navItems = [
  ["/", "Home"],
  ["/about", "About"],
  ["/how-it-works", "How it works"],
  ["/matches", "Explore matches"],
  ["/pricing", "Plans"],
  ["/safety", "Safety"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [memberAuthenticated, setMemberAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const response = await fetch("/api/demo/session", { cache: "no-store" });
        if (active) setMemberAuthenticated(response.ok);
      } catch {
        if (active) setMemberAuthenticated(false);
      } finally {
        if (active) setSessionChecked(true);
      }
    }
    void checkSession();
    return () => { active = false; };
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  async function signOut() {
    await fetch("/api/demo/logout", { method: "POST" });
    setMemberAuthenticated(false);
    closeMenu();
    window.location.assign("/");
  }

  return (
    <>
      <header className="site-header">
        <div className="announcement">
          <div className="container">
            <span className="announcement-heart">♥</span>
            <span>Made for people ready to welcome companionship again</span>
          </div>
        </div>
        <div className="container nav-wrap">
          <Link className="brand" href="/" aria-label="ReKnott Matrimony home" onClick={closeMenu}>
            <img src="/assets/reknott-logo.jpeg" alt="ReKnott Matrimony, a fresh start together" />
          </Link>
          <nav className={`nav-links${menuOpen ? " open" : ""}`} id="main-nav" aria-label="Main navigation">
            {navItems.map(([href, label]) => (
              <Link
                className={`nav-link${pathname === href ? " active" : ""}`}
                href={href}
                key={href}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            {sessionChecked && memberAuthenticated ? (
              <>
                <Link className="login-link member-nav-account" href="/member">My account</Link>
                <button className="nav-signout" type="button" onClick={signOut}>Sign out</button>
              </>
            ) : sessionChecked ? (
              <>
                <Link className="login-link" href="/login">Member login</Link>
                <Link className="btn btn-primary btn-sm" href="/register">Create profile <span aria-hidden="true">→</span></Link>
              </>
            ) : null}
            <button
              className="nav-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-controls="main-nav"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <img src="/assets/reknott-logo.jpeg" alt="ReKnott Matrimony" />
            <p>A private, respectful matrimony community for people whose earlier marital journey has concluded and who are ready to build again.</p>
          </div>
          <div>
            <h3 className="footer-title">Discover</h3>
            <div className="footer-links">
              <Link href="/how-it-works">How it works</Link><Link href="/matches">Explore matches</Link>
              <Link href="/pricing">Membership plans</Link><Link href="/about">About ReKnott</Link>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Support</h3>
            <div className="footer-links">
              <Link href="/safety">Safety & privacy</Link><Link href="/contact">Help centre</Link>
              <Link href="/contact#faq">FAQs</Link><Link href="/contact">Contact us</Link>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Popular searches</h3>
            <div className="footer-links">
              <Link href="/matches">Working professionals</Link><Link href="/matches">NRI profiles</Link>
              <Link href="/matches">Shared family values</Link><Link href="/matches">Telugu matrimony</Link>
            </div>
            <div className="footer-note" style={{ marginTop: 14 }}>
              The past is respected. The life ahead is still full of possibility. ReKnott brings together people who understand both.
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} ReKnott Matrimony. All rights reserved.</span>
          <div className="footer-bottom-links"><Link href="/safety">Privacy</Link><Link href="/safety">Terms</Link><Link href="/contact">Grievance support</Link></div>
        </div>
      </footer>
    </>
  );
}

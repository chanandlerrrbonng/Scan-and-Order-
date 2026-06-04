export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-name">NoQs</span>
          <p className="footer-tagline">Skip the queue. Savour the moment.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <ul role="list">
            <li><a href="#help">Help &amp; Support</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
        <p className="footer-copy">© 2026 NoQs Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}

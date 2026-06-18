import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <span>© {new Date().getFullYear()} Gatherly. Built for the Event Management assignment.</span>
    </div>
  </footer>
);

export default Footer;
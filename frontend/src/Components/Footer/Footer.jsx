import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
                <p className="footer-tagline">Connecting talent with opportunity</p>
            </div>
        </footer>
    );
};

export default Footer;

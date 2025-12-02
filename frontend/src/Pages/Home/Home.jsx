import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import Button from '../../Components/Button/Button';
import './Home.css';

// CompanyCarousel Component
function CompanyCarousel({ companies }) {
    const items = [...companies, ...companies];
    return (
        <section className="companies">
            <p className="trusted-companies-heading">Trusted by top companies</p>
            <div className="marquee">
                <div className="company-carousel-track">
                    {items.map((c, i) => (
                        <a className="company" href={c.href} key={`${c.name}-${i}`} target="_blank" rel="noreferrer">
                            <img src={c.logo} alt={c.name} />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Home Page Component - Landing page of the application
const Home = () => {
    // Get authentication info from context
    const { isAuthenticated, isJobSeeker, isRecruiter } = useAuth();

    const companies = [
        { name: 'Flipkart', logo: '/images/Flipkartlogo.png', href: 'https://www.flipkart.com' },
        { name: 'BigBasket', logo: '/images/bigbasketlogo.png', href: 'https://www.bigbasket.com' },
        { name: 'Jio', logo: '/images/jiologo.png', href: 'https://www.jio.com' },
        { name: 'HDFC', logo: '/images/hdfclogo.png', href: 'https://www.hdfcbank.com' },
        { name: 'Urban Company', logo: '/images/urbancompany.png', href: 'https://www.urbancompany.com' },
        { name: 'Zomato', logo: '/images/zomatologo.png', href: 'https://www.zomato.com' },
        { name: 'Uber', logo: '/images/blinkit.png', href: 'https://www.blinkit.com' },
        { name: 'Tech Mahindra', logo: '/images/TechMahindra.png', href: 'https://www.techmahindra.com' },
        { name: 'NST', logo: '/images/NSTlogo.png', href: 'https://www.newtonschool.co/newton-school-of-technology-nst/home' },
        { name: 'Swiggy', logo: '/images/swiggylogo.png', href: 'https://www.swiggy.com' },
        { name: 'Sozou', logo: '/images/sozoulogo.jpeg', href: 'https://www.sozou.in' }
    ];

    return (
        <div className="home">
            {/* Hero Section - Main banner */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Find Your Dream Job Today</h1>
                        <p className="hero-subtitle">
                            Connect with top employers and discover thousands of opportunities
                            that match your skills and aspirations.
                        </p>

                        {/* Show different buttons based on login status */}
                        <div className="hero-actions">
                            {!isAuthenticated ? (
                                // Not logged in - show register and browse buttons
                                <>
                                    <Link to="/register">
                                        <Button size="large">Get Started</Button>
                                    </Link>
                                    <Link to="/jobs">
                                        <Button size="large" variant="outline">Browse Jobs</Button>
                                    </Link>
                                </>
                            ) : (
                                // Logged in - show role-specific buttons
                                <>
                                    {isJobSeeker && (
                                        <Link to="/jobs">
                                            <Button size="large">Browse Jobs</Button>
                                        </Link>
                                    )}
                                    {isRecruiter && (
                                        <Link to="/post-job">
                                            <Button size="large">Post a Job</Button>
                                        </Link>
                                    )}
                                    <Link to="/dashboard">
                                        <Button size="large" variant="outline">Go to Dashboard</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Carousel */}
            <CompanyCarousel companies={companies} />

            {/* Call to Action Section */}
            <section className="cta">
                <div className="container">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join thousands of job seekers and employers on JobPortal</p>
                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button size="large">Create Account</Button>
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;

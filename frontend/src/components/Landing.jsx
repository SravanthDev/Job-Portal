import './landing.css';

function Navbar({ navigate }) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">Job Portal</div>
        <nav className="nav-links">
          <a href="#jobs">Jobs</a>
          <a href="#prep">Job Prep</a>
          <a href="#tools">Resume Tools</a>
          <a className="cta" href="/login" onClick={(e) => { e.preventDefault(); navigate?.('/login'); }}>Login</a>
          <a className="cta outline" href="/signup" onClick={(e) => { e.preventDefault(); navigate?.('/signup'); }}>Signup</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ navigate }) {
  return (
    <section className="hero">
      <p className="label">INDIA'S #1 JOB PLATFORM</p>
      <h1 className="title">Your job search ends here</h1>
      <p className="subtitle">Discover 50 lakh+ career opportunities</p>

      <div className="search-bar">
        <input placeholder="Search jobs by company, role..." />
        <input placeholder="Your Experience" />
        <input placeholder="Search for an area or city" />
        <button>Search jobs</button>
      </div>

      <div className="hero-cta">
        <button className="btn" onClick={() => navigate?.('/signup')}>Create free account</button>
        <button className="btn ghost" onClick={() => navigate?.('/login')}>Login</button>
      </div>
    </section>
  );
}

function CompanyCarousel({ companies }) {
  const items = [...companies, ...companies];
  return (
    <section className="companies">
      <p className="companies-title">Trusted by top companies</p>
      <div className="marquee">
        <div className="marquee-track">
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

export default function Landing({ navigate }) {
  const companies = [
    { name: 'Flipkart', logo: '/src/assets/Flipkartlogo.png', href: 'https://www.flipkart.com' },
    { name: 'BigBasket', logo: '/src/assets/bigbasketlogo.png', href: 'https://www.bigbasket.com' },
    { name: 'Jio', logo: '/src/assets/jiologo.png', href: 'https://www.jio.com' },
    { name: 'HDFC', logo: '/src/assets/hdfclogo.png', href: 'https://www.hdfcbank.com' },
    { name: 'Urban Company', logo: '/src/assets/urbancompany.png', href: 'https://www.urbancompany.com' },
    { name: 'Zomato', logo: '/src/assets/zomatologo.png', href: 'https://www.zomato.com' },
    { name: 'Uber', logo: '/src/assets/blinkit.png', href: 'https://www.blinkit.com' },
    { name: 'Tech Mahindra', logo: '/src/assets/TechMahindra.png', href: 'https://www.techmahindra.com' },
    { name: 'NST', logo: '/src/assets/NSTlogo.webp', href: '#' },
    { name: 'Swiggy', logo: '/src/assets/swiggylogo.png', href: 'https://www.swiggy.com' }
  ];

  return (
    <div className="landing">
      <Navbar navigate={navigate} />
      <Hero navigate={navigate} />
      <CompanyCarousel companies={companies} />
    </div>
  );
}



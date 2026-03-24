import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const LandingPage: FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = (): void => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    const pricingPlans = [
        {
            name: 'Starter',
            price: '$0',
            period: 'Forever free',
            description: 'Perfect for learning and prototyping',
            features: [
                'JWT Authentication',
                'Basic API Access',
                'Dashboard',
                'Community Support',
                'Up to 5 projects',
            ],
            cta: 'Get Started',
            highlighted: false,
        },
        {
            name: 'Professional',
            price: '$29',
            period: '/month',
            description: 'For individual developers',
            features: [
                'Everything in Starter',
                'Advanced API Features',
                'Custom Branding',
                'Priority Support',
                'Unlimited projects',
                'Advanced Analytics',
            ],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: 'Contact sales',
            description: 'For large teams and organizations',
            features: [
                'Everything in Professional',
                'Dedicated Support',
                'Custom Integration',
                'SSO & Advanced Security',
                '99.9% SLA',
                'Custom Development',
            ],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ];

    return (
        <div className="landing-page">
            {/* Navigation Bar */}
            <header className="landing-nav">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <span className="logo-icon">RAG</span>
                    </Link>
                    <nav className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                        <a href="#about" className="nav-link">About</a>
                    </nav>
                    <div className="nav-actions">
                        <Link to="/login" className="nav-btn login-btn">
                            Sign In
                        </Link>
                        <Link to="/register" className="nav-btn register-btn">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>✨ Build Faster with Auth</span>
                    </div>
                    <h1 className="hero-title">
                        Production-Ready
                        <span className="gradient-text"> Authentication</span>
                    </h1>
                    <p className="hero-subtitle">
                        A complete full-stack authentication template with JWT tokens, refresh mechanism,
                        and beautiful UI. Deploy in minutes, not days.
                    </p>
                    <div className="hero-actions">
                        <button onClick={handleGetStarted} className="btn-primary btn-lg">
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                        </button>
                        <a href="#features" className="btn-secondary btn-lg">
                            Learn More
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Users</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">10k+</span>
                            <span className="stat-label">GitHub Stars</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="code-block">
                        <div className="code-header">
                            <span className="code-title">app.tsx</span>
                        </div>
                        <pre className="code-content">{`import { AuthProvider } from '@/auth'
import { Layout } from '@/components'

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        {/* Your app */}
      </Layout>
    </AuthProvider>
  )
}`}</pre>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Why Choose RAG?</h2>
                    <p>Everything you need to build secure, scalable applications</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔐</div>
                        <h3>Secure by Default</h3>
                        <p>JWT authentication with bcrypt password hashing and automatic token refresh</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Fast & Lightweight</h3>
                        <p>Built with FastAPI and React. Optimized for performance and bundle size</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Fully Responsive</h3>
                        <p>Beautiful UI that works perfectly on desktop, tablet, and mobile devices</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌓</div>
                        <h3>Dark & Light Mode</h3>
                        <p>Professional theme toggle with persistent user preferences</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Well Documented</h3>
                        <p>Comprehensive guides, API docs, and inline code comments throughout</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Ready to Deploy</h3>
                        <p>Deploy to Vercel, Railway, AWS, or anywhere. Includes CI/CD workflows</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <div className="section-header">
                    <h2>Simple, Transparent Pricing</h2>
                    <p>Choose the plan that fits your needs</p>
                </div>
                <div className="pricing-grid">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
                        >
                            {plan.highlighted && <div className="popular-badge">Most Popular</div>}
                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="price">{plan.price}</span>
                                    <span className="period">{plan.period}</span>
                                </div>
                                <p className="plan-description">{plan.description}</p>
                            </div>
                            <button
                                className={`plan-cta ${plan.highlighted ? 'primary' : 'secondary'}`}
                                onClick={handleGetStarted}
                            >
                                {plan.cta}
                            </button>
                            <div className="plan-features">
                                <p className="features-label">Includes:</p>
                                <ul className="features-list">
                                    {plan.features.map((feature) => (
                                        <li key={feature}>
                                            <span className="feature-check">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Build?</h2>
                    <p>Start building your authentication-ready application today</p>
                    <div className="cta-actions">
                        <button onClick={handleGetStarted} className="btn-primary btn-lg">
                            Get Started Free
                        </button>
                        <a href="https://github.com" className="btn-secondary btn-lg">
                            View on GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>RAG</h4>
                        <p>Full-stack auth template</p>
                    </div>
                    <div className="footer-section">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#">Documentation</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Terms</a></li>
                            <li><a href="#">Security</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Connect</h4>
                        <ul>
                            <li><a href="#">GitHub</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">Discord</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 RAG. All rights reserved.</p>
                </div>
            </footer>

            <style>{`
                .landing-page {
                    background: #081120;
                    color: #e5eefb;
                    min-height: 100vh;
                }

                /* Navigation */
                .landing-nav {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(8, 17, 32, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 1rem 0;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 2rem;
                }

                .nav-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-decoration: none;
                    color: #e5eefb;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .logo-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 6px;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    flex: 1;
                }

                .nav-link {
                    color: #c5d5e8;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-weight: 500;
                }

                .nav-link:hover {
                    color: #8dbbff;
                }

                .nav-actions {
                    display: flex;
                    gap: 1rem;
                }

                .nav-btn {
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-size: 0.95rem;
                }

                .login-btn {
                    background: transparent;
                    color: #8dbbff;
                    border: 1px solid rgba(141, 187, 255, 0.3);
                }

                .login-btn:hover {
                    background: rgba(141, 187, 255, 0.1);
                    border-color: rgba(141, 187, 255, 0.5);
                }

                .register-btn {
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    color: white;
                }

                .register-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(79, 140, 255, 0.3);
                }

                /* Hero Section */
                .hero-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    align-items: center;
                }

                .hero-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1rem;
                    background: rgba(79, 140, 255, 0.1);
                    border: 1px solid rgba(79, 140, 255, 0.3);
                    border-radius: 20px;
                    color: #8dbbff;
                    font-size: 0.9rem;
                    font-weight: 500;
                    width: fit-content;
                }

                .hero-title {
                    margin: 0;
                    font-size: 3.5rem;
                    font-weight: 700;
                    line-height: 1.2;
                    color: #e5eefb;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #c5d5e8;
                    line-height: 1.6;
                }

                .hero-actions {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .btn-primary,
                .btn-secondary {
                    padding: 0.9rem 2rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    display: inline-block;
                    text-align: center;
                }

                .btn-lg {
                    padding: 1rem 2rem;
                    font-size: 1.05rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(79, 140, 255, 0.3);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #8dbbff;
                    border: 1px solid rgba(141, 187, 255, 0.3);
                }

                .btn-secondary:hover {
                    background: rgba(141, 187, 255, 0.15);
                    border-color: rgba(141, 187, 255, 0.5);
                }

                .hero-stats {
                    display: flex;
                    gap: 2rem;
                    margin-top: 1rem;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .stat-number {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #4f8cff;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: #9eb0d1;
                }

                .hero-image {
                    position: relative;
                }

                .code-block {
                    background: rgba(11, 20, 39, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                }

                .code-header {
                    padding: 0.75rem 1rem;
                    background: rgba(79, 140, 255, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.85rem;
                }

                .code-title {
                    color: #8dbbff;
                    font-weight: 600;
                }

                .code-content {
                    margin: 0;
                    padding: 1rem;
                    color: #c5d5e8;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 0.85rem;
                    line-height: 1.6;
                    overflow-x: auto;
                }

                /* Features Section */
                .features-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .section-header h2 {
                    margin: 0 0 0.5rem;
                    font-size: 2.5rem;
                    color: #e5eefb;
                }

                .section-header p {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #9eb0d1;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .feature-card {
                    padding: 2rem;
                    background: rgba(17, 32, 63, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .feature-card:hover {
                    background: rgba(17, 32, 63, 0.6);
                    border-color: rgba(141, 187, 255, 0.3);
                    transform: translateY(-4px);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .feature-card h3 {
                    margin: 0 0 0.75rem;
                    font-size: 1.3rem;
                    color: #e5eefb;
                }

                .feature-card p {
                    margin: 0;
                    color: #c5d5e8;
                    line-height: 1.6;
                }

                /* Pricing Section */
                .pricing-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                }

                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .pricing-card {
                    position: relative;
                    padding: 2rem;
                    background: rgba(17, 32, 63, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .pricing-card.highlighted {
                    background: rgba(17, 32, 63, 0.8);
                    border-color: rgba(79, 140, 255, 0.5);
                    transform: scale(1.05);
                }

                .pricing-card:hover {
                    border-color: rgba(141, 187, 255, 0.3);
                    background: rgba(17, 32, 63, 0.6);
                }

                .popular-badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 0.4rem 1rem;
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .plan-header {
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                .plan-header h3 {
                    margin: 0 0 1rem;
                    font-size: 1.4rem;
                    color: #e5eefb;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .price {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #4f8cff;
                }

                .period {
                    font-size: 1rem;
                    color: #9eb0d1;
                }

                .plan-description {
                    margin: 0;
                    color: #c5d5e8;
                    font-size: 0.95rem;
                }

                .plan-cta {
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 1.5rem;
                    transition: all 0.3s ease;
                }

                .plan-cta.primary {
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    color: white;
                }

                .plan-cta.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(79, 140, 255, 0.3);
                }

                .plan-cta.secondary {
                    background: transparent;
                    color: #8dbbff;
                    border: 1px solid rgba(141, 187, 255, 0.3);
                }

                .plan-cta.secondary:hover {
                    background: rgba(141, 187, 255, 0.1);
                    border-color: rgba(141, 187, 255, 0.5);
                }

                .plan-features {
                    flex: 1;
                    text-align: left;
                }

                .features-label {
                    margin: 0 0 1rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #8dbbff;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .features-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .features-list li {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #c5d5e8;
                    font-size: 0.95rem;
                }

                .feature-check {
                    color: #4f8cff;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                /* CTA Section */
                .cta-section {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                    text-align: center;
                }

                .cta-content h2 {
                    margin: 0 0 1rem;
                    font-size: 2.5rem;
                    color: #e5eefb;
                }

                .cta-content p {
                    margin: 0 0 2rem;
                    font-size: 1.1rem;
                    color: #9eb0d1;
                }

                .cta-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                /* Footer */
                .landing-footer {
                    background: rgba(8, 17, 32, 0.5);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 3rem 2rem 1rem;
                    margin-top: 3rem;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto 2rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }

                .footer-section h4 {
                    margin: 0 0 1rem;
                    color: #e5eefb;
                    font-weight: 600;
                }

                .footer-section p {
                    margin: 0;
                    color: #9eb0d1;
                    font-size: 0.95rem;
                }

                .footer-section ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .footer-section a {
                    color: #c5d5e8;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer-section a:hover {
                    color: #8dbbff;
                }

                .footer-bottom {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    text-align: center;
                    color: #9eb0d1;
                    font-size: 0.9rem;
                }

                .footer-bottom p {
                    margin: 0;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }

                    .hero-section {
                        grid-template-columns: 1fr;
                        padding: 2rem 1rem;
                    }

                    .hero-title {
                        font-size: 2rem;
                    }

                    .hero-subtitle {
                        font-size: 1rem;
                    }

                    .hero-stats {
                        gap: 1rem;
                    }

                    .pricing-card.highlighted {
                        transform: scale(1);
                    }

                    .section-header h2 {
                        font-size: 1.8rem;
                    }

                    .cta-content h2 {
                        font-size: 1.8rem;
                    }

                    .nav-container {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

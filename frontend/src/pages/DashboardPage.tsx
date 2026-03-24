import { FC } from 'react';
import { useAuth } from '../auth/AuthContext';

export const DashboardPage: FC = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Welcome, {user?.full_name}</h1>
                <p className="page-subtitle">Here's your dashboard overview</p>
            </div>

            <div className="feature-grid">
                <article className="feature-panel">
                    <h2>JWT Authentication</h2>
                    <p>The React client stores your access token and sends it to protected backend routes.</p>
                </article>
                <article className="feature-panel">
                    <h2>Protected API</h2>
                    <p>The backend validates the bearer token and returns your current user profile securely.</p>
                </article>
                <article className="feature-panel">
                    <h2>Refresh Tokens</h2>
                    <p>Access tokens auto-refresh before expiry, keeping your session alive seamlessly.</p>
                </article>
                <article className="feature-panel">
                    <h2>TypeScript</h2>
                    <p>Full type safety across the React frontend for better developer experience.</p>
                </article>
                <article className="feature-panel">
                    <h2>Responsive Design</h2>
                    <p>The layout adapts beautifully to desktop, tablet, and mobile screens.</p>
                </article>
                <article className="feature-panel">
                    <h2>Ready to Extend</h2>
                    <p>Add more pages, features, and routes to build your complete application.</p>
                </article>
            </div>

            <style>{`
        .dashboard-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
          background: linear-gradient(135deg, #4f8cff, #7c4dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          margin: 0;
          color: #9eb0d1;
          font-size: 1.1rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .feature-panel {
          padding: 1.5rem;
          background: rgba(17, 32, 63, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .feature-panel:hover {
          background: rgba(17, 32, 63, 0.8);
          border-color: rgba(141, 187, 255, 0.3);
          transform: translateY(-2px);
        }

        .feature-panel h2 {
          margin: 0 0 0.75rem;
          font-size: 1.1rem;
          color: #8dbbff;
        }

        .feature-panel p {
          margin: 0;
          color: #c5d5e8;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 1.5rem;
            background: linear-gradient(135deg, #4f8cff, #7c4dff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .feature-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .feature-panel {
            padding: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

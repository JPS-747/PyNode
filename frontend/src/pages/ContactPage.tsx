import { FC, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { sendContactMessage } from '../api';

export const ContactPage: FC = () => {
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        if (!token) {
            setError('You must be logged in to send a message');
            setLoading(false);
            return;
        }

        try {
            await sendContactMessage(token, {
                subject: formData.subject,
                message: formData.message,
            });

            setSuccess(true);
            setFormData({ subject: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Send us a message and we'll get back to you as soon as possible</p>
                </div>

                <div className="contact-content">
                    <div className="contact-form-wrapper">
                        {success && (
                            <div className="success-banner">
                                ✓ Message sent successfully! We'll be in touch soon.
                            </div>
                        )}
                        {error && (
                            <div className="error-banner">
                                ✗ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="sender_name">Your Name</label>
                                <input
                                    type="text"
                                    id="sender_name"
                                    value={user?.full_name || ''}
                                    disabled
                                    className="form-input disabled"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sender_email">Your Email</label>
                                <input
                                    type="email"
                                    id="sender_email"
                                    value={user?.email || ''}
                                    disabled
                                    className="form-input disabled"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">
                                    Subject <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this about?"
                                    minLength={3}
                                    maxLength={200}
                                    required
                                    className="form-input"
                                    disabled={loading}
                                />
                                <span className="char-count">
                                    {formData.subject.length}/200
                                </span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">
                                    Message <span className="required">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us what's on your mind..."
                                    minLength={10}
                                    maxLength={5000}
                                    required
                                    className="form-textarea"
                                    rows={6}
                                    disabled={loading}
                                />
                                <span className="char-count">
                                    {formData.message.length}/5000
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-btn"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    <div className="contact-info">
                        <div className="info-card">
                            <div className="info-icon">📧</div>
                            <h3>Email</h3>
                            <p>support@example.com</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">💬</div>
                            <h3>Response Time</h3>
                            <p>We typically respond within 24 hours</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">🌐</div>
                            <h3>Online Support</h3>
                            <p>Available Monday to Friday, 9 AM - 5 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .contact-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .contact-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .contact-header {
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .contact-header h1 {
                    margin: 0 0 0.5rem;
                    font-size: 2rem;
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .contact-header p {
                    margin: 0;
                    color: #c5d5e8;
                    font-size: 1.1rem;
                }

                .contact-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                    align-items: start;
                }

                .contact-form-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .success-banner {
                    padding: 1rem;
                    background: rgba(34, 197, 94, 0.15);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    border-radius: 12px;
                    color: #86efac;
                    font-weight: 500;
                }

                .error-banner {
                    padding: 1rem;
                    background: rgba(255, 102, 146, 0.15);
                    border: 1px solid rgba(255, 102, 146, 0.3);
                    border-radius: 12px;
                    color: #ffd5e2;
                    font-weight: 500;
                }

                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: rgba(17, 32, 63, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    position: relative;
                }

                .form-group label {
                    font-weight: 500;
                    color: #e5eefb;
                }

                .required {
                    color: #ff6692;
                }

                .form-input,
                .form-textarea {
                    padding: 0.75rem;
                    background: rgba(11, 20, 39, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                    color: #e5eefb;
                    font-family: inherit;
                    transition: all 0.2s ease;
                }

                .form-input:focus,
                .form-textarea:focus {
                    outline: 2px solid rgba(79, 140, 255, 0.5);
                    border-color: transparent;
                    background: rgba(11, 20, 39, 1);
                }

                .form-input.disabled,
                .form-textarea:disabled {
                    background: rgba(11, 20, 39, 0.5);
                    color: #9eb0d1;
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 150px;
                }

                .char-count {
                    font-size: 0.8rem;
                    color: #9eb0d1;
                    text-align: right;
                }

                .submit-btn {
                    padding: 0.9rem 1.5rem;
                    background: linear-gradient(135deg, #4f8cff, #7c4dff);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(79, 140, 255, 0.3);
                }

                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .info-card {
                    padding: 1.5rem;
                    background: rgba(17, 32, 63, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .info-card:hover {
                    background: rgba(17, 32, 63, 0.6);
                    border-color: rgba(79, 140, 255, 0.3);
                }

                .info-icon {
                    font-size: 2rem;
                    margin-bottom: 0.75rem;
                }

                .info-card h3 {
                    margin: 0 0 0.5rem;
                    color: #8dbbff;
                    font-size: 1.1rem;
                }

                .info-card p {
                    margin: 0;
                    color: #c5d5e8;
                    font-size: 0.95rem;
                }

                @media (max-width: 768px) {
                    .contact-content {
                        grid-template-columns: 1fr;
                    }

                    .contact-header h1 {
                        font-size: 1.5rem;
                    }

                    .contact-form {
                        padding: 1.5rem;
                    }

                    .contact-info {
                        order: -1;
                    }
                }
            `}</style>
        </div>
    );
};

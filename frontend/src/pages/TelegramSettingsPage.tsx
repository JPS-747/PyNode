import { FC, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { checkTelegramSettings, setTelegramSettings } from '../api';
import './TelegramSettingsPage.css';

export const TelegramSettingsPage: FC = () => {
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        telegram_bot_token: user?.telegram_bot_token || '',
        telegram_chat_id: user?.telegram_chat_id || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isConfigured, setIsConfigured] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        checkConfigurationStatus();
    }, []);

    const checkConfigurationStatus = async () => {
        if (!token) return;
        try {
            setCheckingStatus(true);
            const result = await checkTelegramSettings(token);
            setIsConfigured(result.message.includes('true'));
        } catch {
            setIsConfigured(false);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!formData.telegram_bot_token.trim()) {
            setError('Bot token is required');
            return;
        }

        if (!formData.telegram_chat_id.trim()) {
            setError('Chat ID is required');
            return;
        }

        if (!token) {
            setError('Not authenticated');
            return;
        }

        setLoading(true);
        try {
            await setTelegramSettings(token, {
                telegram_bot_token: formData.telegram_bot_token.trim(),
                telegram_chat_id: formData.telegram_chat_id.trim(),
            });

            setSuccess(true);
            setIsConfigured(true);
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="telegram-settings-container">
            <div className="telegram-settings-header">
                <h1>Telegram Bot Settings</h1>
                <p>Configure your personal Telegram bot to receive contact messages</p>
            </div>

            <div className="telegram-settings-content">
                <div className="settings-guide">
                    <h2>How to set up your bot:</h2>
                    <ol>
                        <li>
                            Open Telegram and search for{' '}
                            <strong>@BotFather</strong>
                        </li>
                        <li>
                            Send the command <code>/newbot</code>
                        </li>
                        <li>
                            Follow the prompts to create your bot and get the{' '}
                            <strong>Bot Token</strong>
                        </li>
                        <li>
                            Send a message to your new bot, then go to{' '}
                            <code>https://api.telegram.org/bot&lt;YOUR_TOKEN&gt;/getUpdates</code>
                        </li>
                        <li>
                            Look for the <strong>chat.id</strong> field in the response
                        </li>
                        <li>
                            Paste both values below and click "Save Settings"
                        </li>
                    </ol>
                </div>

                <div className="settings-form-container">
                    <div
                        className={`status-indicator ${checkingStatus
                                ? 'checking'
                                : isConfigured
                                    ? 'configured'
                                    : 'not-configured'
                            }`}
                    >
                        <span className="status-dot"></span>
                        <span className="status-text">
                            {checkingStatus
                                ? 'Checking status...'
                                : isConfigured
                                    ? '✓ Bot configured'
                                    : '⚠ Bot not configured'}
                        </span>
                    </div>

                    {success && (
                        <div className="banner banner-success">
                            <span>✓ Settings saved successfully!</span>
                        </div>
                    )}

                    {error && (
                        <div className="banner banner-error">
                            <span>✕ {error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-group">
                            <label htmlFor="telegram_bot_token">
                                Bot Token <span className="required">*</span>
                            </label>
                            <input
                                type="password"
                                id="telegram_bot_token"
                                name="telegram_bot_token"
                                value={formData.telegram_bot_token}
                                onChange={handleChange}
                                placeholder="747484:HSHSHYNFHDHDHD"
                                disabled={loading}
                                className="token-input"
                            />
                            <p className="field-hint">
                                Your bot token from @BotFather (kept secret)
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="telegram_chat_id">
                                Chat ID <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="telegram_chat_id"
                                name="telegram_chat_id"
                                value={formData.telegram_chat_id}
                                onChange={handleChange}
                                placeholder="123456789"
                                disabled={loading}
                            />
                            <p className="field-hint">
                                Your Telegram chat ID (where messages will be sent)
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>

                    <div className="info-section">
                        <h3>Why do I need this?</h3>
                        <p>
                            When you use the Contact form to send messages, they will be
                            delivered directly to your Telegram bot. This allows you to
                            receive notifications in real-time while keeping your
                            personal information private.
                        </p>

                        <h3>Security Note</h3>
                        <p>
                            Your bot token and chat ID are securely stored on our
                            servers. They are encrypted and never shared with third
                            parties. Only you can see and modify these settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

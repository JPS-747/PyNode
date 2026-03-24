import { FC, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { checkAISettings, setAISettings, sendTestAIMessage } from '../api';
import './AISettingsPage.css';

export const AISettingsPage: FC = () => {
    const { token, user } = useAuth();
    const [provider, setProvider] = useState(user?.preferred_ai_provider || 'anthropic');
    const [formData, setFormData] = useState({
        anthropic_api_key: user?.anthropic_api_key || '',
        openai_api_key: user?.openai_api_key || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isConfigured, setIsConfigured] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [testLoading, setTestLoading] = useState(false);
    const [testMessage, setTestMessage] = useState('');
    const [testInput, setTestInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');

    useEffect(() => {
        checkConfigurationStatus();
    }, []);

    const checkConfigurationStatus = async () => {
        if (!token) return;
        try {
            setCheckingStatus(true);
            const result = await checkAISettings(token);
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

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProvider(e.target.value);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setTestMessage('');

        const apiKey =
            provider === 'anthropic'
                ? formData.anthropic_api_key.trim()
                : formData.openai_api_key.trim();

        if (!apiKey) {
            setError(`${provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key is required`);
            return;
        }

        if (!token) {
            setError('Not authenticated');
            return;
        }

        setLoading(true);
        try {
            await setAISettings(token, {
                preferred_ai_provider: provider,
                ...(provider === 'anthropic' && { anthropic_api_key: apiKey }),
                ...(provider === 'openai' && { openai_api_key: apiKey }),
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

    const handleTestMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setTestMessage('');
        setAiResponse('');

        if (!testInput.trim()) {
            setError('Please enter a message');
            return;
        }

        if (!isConfigured) {
            setError('Please save your AI settings first');
            return;
        }

        if (!token) {
            setError('Not authenticated');
            return;
        }

        setTestLoading(true);
        try {
            const result = await sendTestAIMessage(token, { message: testInput });
            setAiResponse(result.message);
            setTestMessage('Response received!');
            setTimeout(() => setTestMessage(''), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get AI response');
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="ai-settings-container">
            <div className="ai-settings-header">
                <h1>AI Settings</h1>
                <p>Configure your preferred AI provider (Anthropic Claude or OpenAI)</p>
            </div>

            <div className="ai-settings-content">
                <div className="settings-guide">
                    <h2>Getting Your API Keys:</h2>
                    <div className="provider-guide">
                        <h3>🤖 Anthropic Claude</h3>
                        <ol>
                            <li>
                                Visit{' '}
                                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
                                    console.anthropic.com
                                </a>
                            </li>
                            <li>Sign up for an account or log in</li>
                            <li>Go to the "API Keys" section</li>
                            <li>Click "Create Key" to generate a new API key</li>
                            <li>Copy the key and paste it below</li>
                        </ol>
                    </div>
                    <div className="provider-guide">
                        <h3>🔓 OpenAI GPT</h3>
                        <ol>
                            <li>
                                Visit{' '}
                                <a href="https://platform.openai.com" target="_blank" rel="noreferrer">
                                    platform.openai.com
                                </a>
                            </li>
                            <li>Sign up or log in to your account</li>
                            <li>Go to "API keys" in your account settings</li>
                            <li>Click "Create new secret key"</li>
                            <li>Copy the key and paste it below</li>
                        </ol>
                    </div>
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
                                    ? `✓ ${provider === 'anthropic' ? 'Claude' : 'ChatGPT'} configured`
                                    : '⚠ AI provider not configured'}
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

                    {testMessage && (
                        <div className="banner banner-success">
                            <span>✓ {testMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-group">
                            <label htmlFor="provider">
                                AI Provider <span className="required">*</span>
                            </label>
                            <select
                                id="provider"
                                value={provider}
                                onChange={handleProviderChange}
                                disabled={loading}
                                className="provider-select"
                            >
                                <option value="anthropic">Anthropic Claude</option>
                                <option value="openai">OpenAI GPT</option>
                            </select>
                            <p className="field-hint">
                                Choose which AI provider you want to use
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor={`${provider}_api_key`}>
                                {provider === 'anthropic' ? 'Claude' : 'OpenAI'} API Key{' '}
                                <span className="required">*</span>
                            </label>
                            <input
                                type="password"
                                id={`${provider}_api_key`}
                                name={`${provider}_api_key`}
                                value={
                                    provider === 'anthropic'
                                        ? formData.anthropic_api_key
                                        : formData.openai_api_key
                                }
                                onChange={handleChange}
                                placeholder={
                                    provider === 'anthropic'
                                        ? 'sk-ant-...'
                                        : 'sk-proj-...'
                                }
                                disabled={loading}
                                className="token-input"
                            />
                            <p className="field-hint">
                                Your {provider === 'anthropic' ? 'Claude' : 'OpenAI'} API key
                                (kept secret)
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

                    {isConfigured && (
                        <form onSubmit={handleTestMessage} className="test-form">
                            <h3>Test Your AI Configuration</h3>
                            <div className="form-group">
                                <label htmlFor="test-message">
                                    Send a test message to{' '}
                                    {provider === 'anthropic' ? 'Claude' : 'ChatGPT'}:
                                </label>
                                <textarea
                                    id="test-message"
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                    placeholder="E.g., What is the capital of France?"
                                    rows={3}
                                    disabled={testLoading}
                                    className="test-textarea"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={testLoading}
                                className="test-button"
                            >
                                {testLoading ? 'Getting response...' : 'Send Test Message'}
                            </button>
                        </form>
                    )}

                    {aiResponse && (
                        <div className="response-container">
                            <h3>AI Response:</h3>
                            <div className="response-box">
                                <p>{aiResponse}</p>
                            </div>
                        </div>
                    )}

                    <div className="info-section">
                        <h3>Security & Privacy</h3>
                        <p>
                            Your API keys are securely stored on our servers and encrypted.
                            They are never shared with third parties or used for any
                            purpose other than processing your requests.
                        </p>

                        <h3>Cost & Usage</h3>
                        <p>
                            API calls are made directly from this application to your
                            selected AI provider. Standard usage fees from your provider
                            will apply.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

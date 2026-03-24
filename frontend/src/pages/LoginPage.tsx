import { FC, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../auth/AuthContext';

export const LoginPage: FC = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    async function handleLogin(values: Record<string, string>): Promise<void> {
        setError('');
        try {
            await login({
                email: values.email,
                password: values.password,
            });
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="page-gradient screen-center">
            <div>
                {error ? <p className="error-banner">{error}</p> : null}
                <AuthForm
                    title="Welcome back"
                    submitLabel="Sign in"
                    onSubmit={handleLogin}
                    fields={[
                        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                        {
                            name: 'password',
                            label: 'Password',
                            type: 'password',
                            placeholder: 'Enter your password',
                            minLength: 8,
                            maxLength: 72,
                        },
                    ]}
                    footer={
                        <p className="muted-text">
                            Don&apos;t have an account? <Link to="/register">Create one</Link>
                        </p>
                    }
                />
            </div>
        </div>
    );
};

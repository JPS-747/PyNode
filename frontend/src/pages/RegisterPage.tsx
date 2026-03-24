import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../auth/AuthContext';

export const RegisterPage: FC = () => {
    const { register } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleRegister(values: Record<string, string>): Promise<void> {
        setError('');
        try {
            await register({
                email: values.email,
                full_name: values.full_name,
                password: values.password,
            });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <div className="page-gradient screen-center">
            <div>
                {error ? <p className="error-banner">{error}</p> : null}
                <AuthForm
                    title="Create your account"
                    submitLabel="Sign up"
                    onSubmit={handleRegister}
                    fields={[
                        {
                            name: 'full_name',
                            label: 'Full name',
                            type: 'text',
                            placeholder: 'Jane Developer',
                            minLength: 2,
                        },
                        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                        {
                            name: 'password',
                            label: 'Password',
                            type: 'password',
                            placeholder: 'At least 8 characters (max 72)',
                            minLength: 8,
                            maxLength: 72,
                        },
                    ]}
                    footer={
                        <p className="muted-text">
                            Already registered? <Link to="/login">Sign in</Link>
                        </p>
                    }
                />
            </div>
        </div>
    );
};

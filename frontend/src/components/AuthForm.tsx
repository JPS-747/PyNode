import { FC, ReactNode } from 'react';

interface AuthFormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
}

interface AuthFormProps {
    title: string;
    submitLabel: string;
    fields: AuthFormField[];
    onSubmit: (values: Record<string, string>) => Promise<void>;
    footer?: ReactNode;
}

export const AuthForm: FC<AuthFormProps> = ({ title, submitLabel, fields, onSubmit, footer }) => {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries()) as Record<string, string>;
        await onSubmit(values);
    }

    return (
        <div className="card auth-card">
            <h1>{title}</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <label key={field.name} className="field-group">
                        <span>{field.label}</span>
                        <input
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required ?? true}
                            minLength={field.minLength}
                            maxLength={field.maxLength}
                        />
                    </label>
                ))}
                <button type="submit">{submitLabel}</button>
            </form>
            {footer}
        </div>
    );
};

import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { askQuestion, getQuestions, type QuestionResponse } from "../api";
import "./QAPage.css";

export default function QAPage() {
    const { token, isAuthenticated } = useAuth();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load questions on mount
    useEffect(() => {
        if (isAuthenticated && token) {
            loadQuestions();
        }
    }, [isAuthenticated, token]);

    const loadQuestions = async () => {
        if (!token) return;
        try {
            const data = await getQuestions(token);
            setQuestions(data);
        } catch (err) {
            console.error("Failed to load questions:", err);
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !token) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const result = await askQuestion(token, { question: input });
            setQuestions([result, ...questions]);
            setInput("");
            setSuccess("Question asked successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : "Failed to ask question";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="qa-container">
                <div className="qa-message">Please log in to use Q&A feature.</div>
            </div>
        );
    }

    return (
        <div className="qa-container">
            <div className="qa-header">
                <h1>Q&A Dashboard</h1>
                <p>Ask questions and get answers powered by AI</p>
            </div>

            {/* Question Form */}
            <div className="qa-form-wrapper">
                <form onSubmit={handleAskQuestion} className="qa-form">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={loading}
                        className="qa-textarea"
                        rows={4}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="qa-button"
                    >
                        {loading ? "Asking..." : "Ask Question"}
                    </button>
                </form>

                {error && <div className="qa-error">{error}</div>}
                {success && <div className="qa-success">{success}</div>}
            </div>

            {/* Questions List */}
            <div className="qa-list-wrapper">
                {questions.length === 0 ? (
                    <div className="qa-empty">
                        <p>No questions yet. Ask your first question above!</p>
                    </div>
                ) : (
                    <div className="qa-list">
                        {questions.map((q) => (
                            <div key={q.id} className="qa-item">
                                <div className="qa-question">
                                    <strong>Q:</strong> {q.question}
                                </div>
                                <div className="qa-answer">
                                    <strong>A:</strong> {q.answer}
                                </div>
                                <div className="qa-meta">
                                    {new Date(q.created_at).toLocaleDateString()} at{" "}
                                    {new Date(q.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
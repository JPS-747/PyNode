import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
    createDatabaseSkill,
    getDatabaseSkills,
    testDatabaseSkill,
    type DatabaseSkill,
    type CreateDatabaseSkillPayload,
    type TestDatabaseSkillPayload,
} from "../api";
import "./DatabaseSkillsPage.css";

export default function DatabaseSkillsPage() {
    const { token, isAuthenticated } = useAuth();
    const [skills, setSkills] = useState<DatabaseSkill[]>([]);
    const [formData, setFormData] = useState({
        skillName: "",
        db: "sqlite",
        tables: "",
        queries: "",
    });
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [testResults, setTestResults] = useState("");
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

    // Load skills on mount
    useEffect(() => {
        if (isAuthenticated && token) {
            loadSkills();
        }
    }, [isAuthenticated, token]);

    const loadSkills = async () => {
        if (!token) return;
        try {
            const data = await getDatabaseSkills(token);
            setSkills(data);
        } catch (err) {
            console.error("Failed to load skills:", err);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !formData.skillName.trim()) {
            setError("Please fill in the skill name");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload: CreateDatabaseSkillPayload = {
                skill_name: formData.skillName,
                db_type: formData.db,
                tables: formData.tables,
                queries: formData.queries,
            };
            const newSkill = await createDatabaseSkill(token, payload);
            setSkills([newSkill, ...skills]);
            setFormData({
                skillName: "",
                db: "sqlite",
                tables: "",
                queries: "",
            });
            setSuccess("Database skill created successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : "Failed to create skill";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleTestSkill = async (skillId: number) => {
        if (!token) return;

        setTestLoading(true);
        setTestResults("");
        setError("");

        try {
            const payload: TestDatabaseSkillPayload = {
                test_query: "SELECT * LIMIT 5",
            };
            const result = await testDatabaseSkill(token, skillId, payload);
            setSelectedSkillId(skillId);
            setTestResults(result.result);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : "Failed to execute test";
            setError(errorMsg);
        } finally {
            setTestLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="db-container">
                <div className="db-message">Please log in to use Database Skills.</div>
            </div>
        );
    }

    return (
        <div className="db-container">
            <div className="db-header">
                <h1>Database Skills</h1>
                <p>Create and manage database skills with queries and testing</p>
            </div>

            {/* Create Skill Form */}
            <div className="db-form-wrapper">
                <h2>Create New Database Skill</h2>
                <form onSubmit={handleCreateSkill} className="db-form">
                    <div className="db-form-group">
                        <label htmlFor="skillName">Skill Name</label>
                        <input
                            id="skillName"
                            type="text"
                            name="skillName"
                            value={formData.skillName}
                            onChange={handleInputChange}
                            placeholder="e.g., User Analytics"
                            disabled={loading}
                        />
                    </div>

                    <div className="db-form-group">
                        <label htmlFor="db">Database Type</label>
                        <select
                            id="db"
                            name="db"
                            value={formData.db}
                            onChange={handleInputChange}
                            disabled={loading}
                        >
                            <option value="sqlite">SQLite</option>
                            <option value="postgres">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                        </select>
                    </div>

                    <div className="db-form-group">
                        <label htmlFor="tables">Tables (comma-separated)</label>
                        <input
                            id="tables"
                            type="text"
                            name="tables"
                            value={formData.tables}
                            onChange={handleInputChange}
                            placeholder="e.g., users, orders, products"
                            disabled={loading}
                        />
                    </div>

                    <div className="db-form-group">
                        <label htmlFor="queries">Queries</label>
                        <textarea
                            id="queries"
                            name="queries"
                            value={formData.queries}
                            onChange={handleInputChange}
                            placeholder="Enter your SQL queries here..."
                            disabled={loading}
                            rows={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.skillName.trim()}
                        className="db-button"
                    >
                        {loading ? "Creating..." : "Create Skill"}
                    </button>
                </form>

                {error && <div className="db-error">{error}</div>}
                {success && <div className="db-success">{success}</div>}
            </div>

            {/* Skills List */}
            <div className="db-list-wrapper">
                <h2>Your Database Skills</h2>
                {skills.length === 0 ? (
                    <div className="db-empty">
                        <p>No database skills yet. Create your first skill above!</p>
                    </div>
                ) : (
                    <div className="db-list">
                        {skills.map((skill) => (
                            <div key={skill.id} className="db-item">
                                <div className="db-item-header">
                                    <h3>{skill.skill_name}</h3>
                                    <span className="db-type">{skill.db_type.toUpperCase()}</span>
                                </div>

                                <div className="db-item-details">
                                    {skill.tables && (
                                        <div className="db-detail">
                                            <strong>Tables:</strong> {skill.tables}
                                        </div>
                                    )}
                                    {skill.queries && (
                                        <div className="db-detail">
                                            <strong>Queries:</strong>
                                            <pre>{skill.queries}</pre>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleTestSkill(skill.id)}
                                    disabled={testLoading}
                                    className="db-test-button"
                                >
                                    {testLoading && selectedSkillId === skill.id
                                        ? "Testing..."
                                        : "Test Execute"}
                                </button>

                                {selectedSkillId === skill.id && testResults && (
                                    <div className="db-test-results">
                                        <h4>Test Results:</h4>
                                        <pre>{testResults}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { TelegramSettingsPage } from './pages/TelegramSettingsPage';
import { AISettingsPage } from './pages/AISettingsPage';
import QAPage from './pages/QAPage';
import DatabaseSkillsPage from './pages/DatabaseSkillsPage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/telegram-settings"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <TelegramSettingsPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ai-settings"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AISettingsPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/qa"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <QAPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/database-skills"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <DatabaseSkillsPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;
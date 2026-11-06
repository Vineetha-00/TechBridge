import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { DiscussionDetailPage } from './pages/DiscussionDetailPage';
import { ChatPage } from './pages/ChatPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { AICareerGuidancePage } from './pages/AICareerGuidancePage';
import { LearningRoadmapsPage } from './pages/LearningRoadmapsPage';
import { RoadmapDetailPage } from './pages/RoadmapDetailPage';
import { TechUpdatesPage } from './pages/TechUpdatesPage';
import { ResourcesHubPage } from './pages/ResourcesHubPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ProjectHubPage } from './pages/ProjectHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Standard Layout with Navbar, Sidebar, and Content Container
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Clean Layout for Public Homepage / Auth without Sidebar
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing & Auth */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Modules with Sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/mentorship" element={<MentorshipPage />} />
          <Route path="/ai-guidance" element={<AICareerGuidancePage />} />
          <Route path="/roadmaps" element={<LearningRoadmapsPage />} />
          <Route path="/roadmaps/:slug" element={<RoadmapDetailPage />} />
          <Route path="/tech-updates" element={<TechUpdatesPage />} />
          <Route path="/resources" element={<ResourcesHubPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/projects" element={<ProjectHubPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


import { useEffect, useState } from "react";

import LearningProgress from "./components/LearningProgress";
import CareerGoal from "./components/CareerGoal";
import CareerRoadmap from "./components/CareerRoadmap";
import AddApplicationForm from "./components/AddApplicationForm";
import JobAnalyzer from "./components/JobAnalyzer";
import InterviewPractice from "./components/InterviewPractice";
import Analytics from "./components/Analytics";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import RecentApplications from "./components/RecentApplications";
import RecentActivity from "./components/RecentActivity";
import DailyProgress from "./components/DailyProgress";
import StatsCards from "./components/StatsCards";
import QuickActions from "./components/QuickActions";
import GoalCustomizerModal from "./components/GoalCustomizerModal";
import AuthModal from "./components/AuthModal";

import {
  BriefcaseBusiness,
  FileSearch,
  MessagesSquare,
  BarChart3,
  Construction,
} from "lucide-react";

import { getRecentActivities } from "./utils/recentActivity";

const STORAGE_KEY = "skillpilot-applications";

const comingSoonPages = {
  "Job Analyzer": {
    icon: FileSearch,
    description:
      "Analyze job descriptions, discover skill gaps, and prepare for your target roles.",
  },
  "Interview Practice": {
    icon: MessagesSquare,
    description:
      "Practice technical questions and prepare confidently for interviews.",
  },
  Analytics: {
    icon: BarChart3,
    description:
      "Explore your career progress, learning trends, and application statistics.",
  },
};

// Collect searchable information from SkillPilot
function getSkillPilotSearchResults() {
  const results = [];

  // 1. Career roadmap stages and skills
  try {
    const savedRoadmap = localStorage.getItem("skillpilot-custom-roadmap");

    if (savedRoadmap) {
      const roadmap = JSON.parse(savedRoadmap);

      (roadmap.stages || []).forEach((stage) => {
        results.push({
          id: `roadmap-${stage.id}`,
          title: stage.title,
          description:
            stage.subtitle || stage.description || "Career roadmap stage",
          category: "Roadmap",
          page: "Career Roadmap",
        });

        (stage.skills || []).forEach((skill) => {
          results.push({
            id: `skill-${stage.id}-${skill.id}`,
            title: skill.name,
            description: `Skill in ${stage.title}`,
            category: "Skill",
            page: "Career Roadmap",
          });
        });
      });
    }
  } catch (error) {
    console.error("Unable to search roadmap:", error);
  }

  // 2. Daily tasks
  try {
    const savedTasks = localStorage.getItem("skillpilot-daily-tasks");
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach((task) => {
        results.push({
          id: `task-${task.id}`,
          title: task.title,
          description: `${task.category || "Task"} · ${task.due || "Today"}${
            task.completed ? " · Completed" : ""
          }`,
          category: "Task",
          page: "Daily Planner",
        });
      });
    }
  } catch (error) {
    console.error("Unable to search tasks:", error);
  }

  // 3. Recent activities
  try {
    getRecentActivities().forEach((activity) => {
      results.push({
        id: `activity-${activity.id}`,
        title: activity.message,
        description: activity.timestamp
          ? new Date(activity.timestamp).toLocaleDateString()
          : "Recent activity",
        category: "Activity",
        page: "Dashboard",
      });
    });
  } catch (error) {
    console.error("Unable to search activities:", error);
  }

  return results;
}

function PageHeading({ title, description, icon: Icon }) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      {Icon && (
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-400 dark:ring-indigo-900/60">
          <Icon size={22} />
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

function ComingSoon({ page }) {
  const pageInfo = comingSoonPages[page] || {
    icon: Construction,
    description: "This feature is coming soon.",
  };

  const Icon = pageInfo.icon;

  return (
    <div className="mx-auto max-w-3xl py-10">
      <PageHeading
        title={page}
        description={pageInfo.description}
        icon={Icon}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xs">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon size={30} />
        </div>

        <h2 className="text-xl font-bold text-slate-900">Coming Soon</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          We are working on making this section useful for your learning journey
          and career preparation.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Unable to load applications:", error);
      return [];
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);

  // Global search state
  const [searchResults, setSearchResults] = useState(
    getSkillPilotSearchResults,
  );

  // Save application changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error("Unable to save applications:", error);
    }
  }, [applications]);

  // Refresh search results when activities or local storage change
  useEffect(() => {
    function refreshSearchResults() {
      setSearchResults(getSkillPilotSearchResults());
    }

    window.addEventListener(
      "skillpilot-activity-updated",
      refreshSearchResults,
    );
    window.addEventListener("storage", refreshSearchResults);

    return () => {
      window.removeEventListener(
        "skillpilot-activity-updated",
        refreshSearchResults,
      );
      window.removeEventListener("storage", refreshSearchResults);
    };
  }, []);

  function handleSearchSelect(result) {
    setSelectedSearchResult(result);
    setActivePage(result.page);
  }

  function handleStatusChange(id, newStatus) {
    setApplications((currentApplications) =>
      currentApplications.map((app, index) => {
        const appId = app.id || `app-${index}`;
        return appId === id ? { ...app, status: newStatus } : app;
      }),
    );
  }

  function handleDelete(id) {
    setApplications((currentApplications) =>
      currentApplications.filter((app, index) => {
        const appId = app.id || `app-${index}`;
        return appId !== id;
      }),
    );
  }

  function handleAddApplication(newApplication) {
    setApplications((currentApplications) => [
      newApplication,
      ...currentApplications,
    ]);
    setIsFormOpen(false);
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            {/* Top KPI Metrics Row */}
            <StatsCards onNavigate={setActivePage} />

            {/* Hero Goal Command Banner */}
            <CareerGoal
              onNavigate={setActivePage}
              onEditGoal={() => setIsGoalModalOpen(true)}
            />

            {/* Balanced Row 1: Daily Action Plan & Core Competencies */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
              <DailyProgress onNavigate={setActivePage} />
              <LearningProgress onNavigate={setActivePage} />
            </div>

            {/* Balanced Row 2: Quick Tools & Recent Activity Feed */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
              <QuickActions onNavigate={setActivePage} />
              <RecentActivity />
            </div>
          </div>
        );

      case "Career Roadmap":
        return <CareerRoadmap selectedSearchResult={selectedSearchResult} />;

      case "Daily Planner":
        return (
          <div className="mx-auto max-w-5xl space-y-6">
            <PageHeading
              title="Daily Action Planner"
              description="Plan your daily focus, time commitments, and study consistency."
              icon={BriefcaseBusiness}
            />
            <DailyProgress onNavigate={setActivePage} />
          </div>
        );

      case "Job Analyzer":
        return <JobAnalyzer />;

      case "Interview Practice":
        return <InterviewPractice />;

      case "Application Tracker":
        return (
          <div className="space-y-6">
            <PageHeading
              title="Application Tracker"
              description="Manage and track your job & internship applications in one place."
              icon={BriefcaseBusiness}
            />

            <RecentApplications
              applications={applications}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onAddClick={() => setIsFormOpen(true)}
            />
          </div>
        );

      case "Analytics":
        return <Analytics />;

      default:
        return <ComingSoon page={activePage} />;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased dark:bg-[#090d16] dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Workspace */}
      <main className="min-w-0 flex-1">
        <TopNavbar
          activePage={activePage}
          searchResults={searchResults}
          onSearchSelect={handleSearchSelect}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenGoalModal={() => setIsGoalModalOpen(true)}
          onNavigate={setActivePage}
        />

        <div className="p-4 sm:p-6 md:p-8 lg:p-9">{renderPage()}</div>
      </main>

      {/* Add Application Modal */}
      {isFormOpen && (
        <AddApplicationForm
          onClose={() => setIsFormOpen(false)}
          onAdd={handleAddApplication}
        />
      )}

      {/* Goal Customizer Modal */}
      <GoalCustomizerModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

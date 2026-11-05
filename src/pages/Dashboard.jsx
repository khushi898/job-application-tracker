import {
  Bookmark,
  CalendarClock,
  CircleX,
  Inbox,
  PartyPopper,
  Plus,
  Reply,
  Send,
  UsersRound,
} from "lucide-react";
import ApplicationList from "../components/applications/ApplicationList.jsx";
import StatusBreakdown from "../components/applications/StatusBreakdown.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import Panel from "../components/ui/Panel.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import { useApplications } from "../hooks/useApplications.js";
import { useAuth } from "../hooks/useAuth.js";
import {
  getDashboardStats,
  getUpcomingInterviews,
  sortByDate,
} from "../utils/applications.js";
import { formatDate, todayISO } from "../utils/date.js";

function Dashboard() {
  const { user } = useAuth();
  const { applications } = useApplications();

  // Derived from Context on each render. Storing these in state would only
  // create a second copy that could get out of sync.
  const { counts, applied, responded, responseRate } =
    getDashboardStats(applications);
  const upcomingInterviews = getUpcomingInterviews(applications, todayISO());
  const recentApplications = sortByDate(applications).slice(0, 4);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name}`}
        subtitle="Here's where your job hunt stands today."
        action={
          <Button to="/applications/new">
            <Plus size={17} aria-hidden="true" />
            Add application
          </Button>
        }
      />

      <div className="stats-grid">
        <StatCard
          title="Saved"
          value={counts.Saved}
          icon={Bookmark}
          status="Saved"
        />
        <StatCard
          title="Applied"
          value={counts.Applied}
          icon={Send}
          status="Applied"
        />
        <StatCard
          title="Interview"
          value={counts.Interview}
          icon={UsersRound}
          status="Interview"
        />
        <StatCard
          title="Offer"
          value={counts.Offer}
          icon={PartyPopper}
          status="Offer"
        />
        <StatCard
          title="Rejected"
          value={counts.Rejected}
          icon={CircleX}
          status="Rejected"
        />
        <StatCard
          title="Response rate"
          value={`${responseRate}%`}
          icon={Reply}
          hint={`${responded} of ${applied} heard back`}
        />
      </div>

      <div className="dashboard-grid">
        <Panel title="Upcoming Interviews">
          {upcomingInterviews.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No interviews scheduled"
              message="Move an application to Interview and add a date to see it here."
            />
          ) : (
            <ApplicationList
              applications={upcomingInterviews}
              getDetail={(application) =>
                application.interviewDate
                  ? formatDate(application.interviewDate)
                  : "Date not set"
              }
            />
          )}
        </Panel>

        <Panel title="Status Breakdown">
          {applications.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nothing to show yet"
              message="Your pipeline appears here after your first application."
            />
          ) : (
            <StatusBreakdown counts={counts} total={applications.length} />
          )}
        </Panel>
      </div>

      <Panel
        title="Recent Applications"
        action={
          applications.length > 0 && (
            <Button variant="secondary" size="sm" to="/applications">
              View all
            </Button>
          )
        }
      >
        {recentApplications.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No applications yet"
            message="Add your first application, or save a job from Explore Jobs."
            action={<Button to="/explore-jobs">Explore jobs</Button>}
          />
        ) : (
          <ApplicationList
            applications={recentApplications}
            getDetail={(application) =>
              application.dateApplied
                ? formatDate(application.dateApplied)
                : "Not applied yet"
            }
          />
        )}
      </Panel>
    </>
  );
}

export default Dashboard;

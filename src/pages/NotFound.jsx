import { Compass } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

function NotFound() {
  return (
    <div className="panel">
      <EmptyState
        icon={Compass}
        title="Page not found"
        message="That page doesn't exist."
        action={<Button to="/dashboard">Go to dashboard</Button>}
      />
    </div>
  );
}

export default NotFound;

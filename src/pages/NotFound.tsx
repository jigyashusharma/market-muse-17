import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-4xl mx-auto">
          🔍
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to your dashboard.
        </p>
        <Button onClick={() => navigate("/")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
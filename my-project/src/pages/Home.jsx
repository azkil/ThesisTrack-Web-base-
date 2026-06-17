import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thesis Management Portal</CardTitle>
          <CardDescription>
            Choose an action to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3">
          <Button asChild className="w-full" type="button">
            <Link to="/login/student" className="inline-flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full" type="button">
            <Link to="/signUp" className="inline-flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

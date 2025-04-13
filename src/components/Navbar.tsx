
import { Link, useLocation } from "react-router-dom";
import { BookOpen, FilePlus, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", icon: <BookOpen className="mr-2 h-4 w-4" />, path: "/" },
    { name: "Add Student", icon: <FilePlus className="mr-2 h-4 w-4" />, path: "/add-student" },
    { name: "Master Data", icon: <FileText className="mr-2 h-4 w-4" />, path: "/master-data" },
    { name: "Financial Reports", icon: <BarChart3 className="mr-2 h-4 w-4" />, path: "/financial-reports" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-teacher-400" />
          <span className="font-bold text-xl text-teacher-500">Student Manager</span>
        </div>

        <nav className="ml-auto flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-teacher-100 text-teacher-600"
                  : "text-muted-foreground hover:text-foreground hover:bg-teacher-50"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Award,
  Megaphone,
  FileText,
  FormInput,
  Activity,
  Search,
  BarChart3,
  Link2,
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Entities",
    items: [
      { title: "Exams", href: "/admin/exams", icon: GraduationCap },
      { title: "Colleges", href: "/admin/colleges", icon: Building2 },
      { title: "Scholarships", href: "/admin/scholarships", icon: Award },
      { title: "Landing Page Campaigns", href: "/admin/campaigns", icon: Megaphone },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Templates", href: "/admin/templates", icon: FileText },
      { title: "Form Schemas", href: "/admin/form-schemas", icon: FormInput },
      { title: "Trackers", href: "/admin/trackers", icon: Activity },
      { title: "SEO", href: "/admin/seo", icon: Search },
    ],
  },
  {
    title: "Utilities",
    items: [
      { title: "Slug Registry", href: "/admin/slug-registry", icon: Link2 },
      { title: "Redirects", href: "/admin/redirects", icon: ArrowRightLeft },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg admin-gradient">
            <Settings className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigationGroups.map((group) => {
            const isCollapsed = collapsedGroups.includes(group.title);
            const hasActiveItem = group.items.some((item) => isActive(item.href));

            return (
              <div key={group.title} className="mb-4">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground transition-colors"
                >
                  {group.title}
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {!isCollapsed && (
                  <ul className="mt-1 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          className={({ isActive: active }) =>
                            cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                              active || isActive(item.href)
                                ? "bg-sidebar-accent text-sidebar-foreground"
                                : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-foreground">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}


import { AdminDashboard } from "./AdminDashboard";
import { AdminProducts } from "./AdminProducts";
import { AdminCategories } from "./AdminCategories";
import { AdminBrochures } from "./AdminBrochures";
import { AdminUsers } from "./AdminUsers";
import { AdminSettings } from "./AdminSettings";
import { AdminGoogleDrive } from "./AdminGoogleDrive";

interface AdminContentProps {
  activeSection: string;
  userRole: string;
}

export function AdminContent({ activeSection, userRole }: AdminContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "products":
        return <AdminProducts />;
      case "categories":
        return <AdminCategories />;
      case "brochures":
        return <AdminBrochures />;
      case "users":
        return userRole === 'super_admin' ? <AdminUsers /> : null;
      case "settings":
        return <AdminSettings />;
      case "google-drive":
        return <AdminGoogleDrive />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {renderContent()}
    </div>
  );
}

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AppUserLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["attendee", "organizer", "admin"]}>
      {children}
    </RoleGuard>
  );
}

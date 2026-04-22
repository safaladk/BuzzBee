import { RoleGuard } from "@/components/auth/RoleGuard";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["organizer", "admin"]}>
      {children}
    </RoleGuard>
  );
}

"use client";

import StaffProfile from "@/components/Staff/StaffProfile";

export default function StaffProfilePage({ onMenuClick }: { onMenuClick?: () => void }) {
    return <StaffProfile onMenuClick={onMenuClick} />;
}

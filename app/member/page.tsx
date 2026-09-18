import type { Metadata } from "next";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { MemberDashboard } from "@/components/member-dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Member Account",
  description: "Manage your ReKnott profile, photographs, ranked matches and private conversations.",
};

export default async function MemberPage() {
  await requireChatGPTUser("/member");
  return <main className="member-page"><div className="container"><MemberDashboard /></div></main>;
}

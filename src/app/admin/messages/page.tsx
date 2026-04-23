import { getMessages } from "@/lib/data";
import MessageManager from "@/components/admin/MessageManager";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  const messages = getMessages();
  return <MessageManager initialMessages={messages} />;
}

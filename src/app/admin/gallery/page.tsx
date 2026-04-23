import { getGallery } from "@/lib/data";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  const items = getGallery();
  return <GalleryManager initialItems={items} />;
}

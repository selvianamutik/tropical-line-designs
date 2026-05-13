"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";

interface DeleteResourceFormProps {
  id: string;
  label: string;
  action: (formData: FormData) => Promise<void>;
}

export function DeleteResourceForm({
  id,
  label,
  action,
}: DeleteResourceFormProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();

  return (
    <form
      action={async (formData) => {
        try {
          await action(formData);
          showToast({
            tone: "success",
            title: "Data berhasil dihapus.",
          });
          router.refresh();
        } catch (error) {
          showToast({
            tone: "error",
            title: "Gagal menghapus data.",
            description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data.",
          });
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title={label}
        onClick={(event) => {
          if (!window.confirm(`Delete this item?\n\n${label}`)) {
            event.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4 text-[#e86654]" />
      </Button>
    </form>
  );
}

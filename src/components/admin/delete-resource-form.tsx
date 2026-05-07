import { Trash2 } from "lucide-react";
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
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        formAction={action}
        title={label}
      >
        <Trash2 className="w-4 h-4 text-[#e86654]" />
      </Button>
    </form>
  );
}

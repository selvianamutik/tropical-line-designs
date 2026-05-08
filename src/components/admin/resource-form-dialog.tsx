"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Modal } from "@/components/admin/ui/Modal";
import { cn } from "@/lib/utils";

interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "month" | "textarea" | "select" | "file";
  placeholder?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[];
  accept?: string;
  helpText?: string;
}

interface ResourceFormDialogProps {
  title: string;
  description: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  fields: FormField[];
  triggerLabel?: string;
  initialId?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : label}</Button>;
}

export function ResourceFormDialog({
  title,
  description,
  submitLabel,
  action,
  fields,
  triggerLabel,
  initialId,
}: ResourceFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {triggerLabel ? (
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(true)}>
          <Pencil className="w-4 h-4 text-[#a5a098]" />
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title} description={description}>
        <form
          encType="multipart/form-data"
          action={async (formData) => {
            await action(formData);
            setIsOpen(false);
          }}
        >
          {initialId ? <input type="hidden" name="id" value={initialId} /> : null}
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.1em] text-[#8a867f] uppercase">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    defaultValue={field.defaultValue?.toString() ?? ""}
                    placeholder={field.placeholder}
                    className={cn(
                      "flex w-full rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:outline-none focus-visible:border-[#d97706] min-h-[100px] resize-y",
                    )}
                  />
                ) : field.type === "select" ? (
                  <div className="relative">
                    <select
                      name={field.name}
                      required={field.required}
                      defaultValue={field.defaultValue?.toString() ?? ""}
                      className={cn(
                        "flex h-10 w-full rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors focus-visible:outline-none focus-visible:border-[#d97706] appearance-none cursor-pointer pr-10",
                      )}
                    >
                      {field.placeholder && <option value="" disabled>{field.placeholder}</option>}
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#a5a098]">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                ) : field.type === "file" ? (
                  <div className="space-y-2">
                    <Input
                      name={field.name}
                      type="file"
                      required={field.required}
                      accept={field.accept}
                    />
                    {field.helpText ? (
                      <p className="text-[11px] text-[#8a867f]">{field.helpText}</p>
                    ) : null}
                  </div>
                ) : (
                  <Input
                    name={field.name}
                    type={field.type ?? "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue?.toString() ?? ""}
                    min={field.min}
                    max={field.max}
                  />
                )}
                {field.type !== "file" && field.helpText ? (
                  <p className="text-[11px] text-[#8a867f]">{field.helpText}</p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SubmitButton label={submitLabel} />
          </div>
        </form>
      </Modal>
    </>
  );
}

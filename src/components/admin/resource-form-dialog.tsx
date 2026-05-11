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
  previewKind?: "gallery-layout";
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

function GalleryLayoutPreview({ layout }: { layout: string }) {
  const cell = "rounded-[2px] bg-[#383532]";
  const frame = "grid h-28 w-36 gap-1 rounded-sm border border-[#d9d4ca] bg-[#f4efe6] p-2";

  if (layout === "A") {
    return (
      <div className={`${frame} grid-cols-2 grid-rows-2`}>
        <div className={`${cell} col-span-2`} />
        <div className={cell} />
        <div className="grid gap-1">
          <div className={cell} />
          <div className={cell} />
        </div>
      </div>
    );
  }

  if (layout === "B") {
    return (
      <div className={`${frame} grid-cols-3 grid-rows-3`}>
        <div className={`${cell} col-span-2`} />
        <div className={cell} />
        <div className="col-span-3" />
        <div className="col-span-1" />
        <div className={`${cell} col-span-2 row-span-2`} />
      </div>
    );
  }

  if (layout === "C") {
    return (
      <div className={`${frame} grid-cols-2 grid-rows-3`}>
        <div className={`${cell} col-span-2 row-span-2`} />
        <div className={cell} />
        <div className={cell} />
      </div>
    );
  }

  if (layout === "D") {
    return (
      <div className={`${frame} grid-cols-1 grid-rows-1`}>
        <div className={cell} />
      </div>
    );
  }

  if (layout === "E") {
    return (
      <div className={`${frame} grid-cols-2 grid-rows-2`}>
        <div className={`${cell} col-span-2`} />
        <div className={cell} />
        <div className="grid gap-1">
          <div className={cell} />
          <div className="ml-4 h-full rounded-[2px] bg-[#383532]" />
        </div>
      </div>
    );
  }

  if (layout === "F") {
    return (
      <div className={`${frame} grid-cols-2 grid-rows-2`}>
        <div className={`${cell} col-span-2`} />
        <div className={`${cell} col-span-2`} />
        <div className="absolute" />
      </div>
    );
  }

  if (layout === "G") {
    return (
      <div className={`${frame} grid-cols-2 grid-rows-3`}>
        <div className={`${cell} col-span-2`} />
        <div className={cell} />
        <div className={cell} />
        <div className={`${cell} col-span-2`} />
      </div>
    );
  }

  if (layout === "H") {
    return (
      <div className={`${frame} grid-cols-1 grid-rows-3`}>
        <div className={cell} />
        <div className={cell} />
        <div className={cell} />
      </div>
    );
  }

  if (layout === "I") {
    return (
      <div className={`${frame} grid-cols-3 grid-rows-3`}>
        <div className={`${cell} col-span-2`} />
        <div className={cell} />
        <div className={`${cell} col-span-3 row-span-2`} />
      </div>
    );
  }

  if (layout === "J") {
    return (
      <div className={`${frame} grid-cols-3 grid-rows-3`}>
        <div className={cell} />
        <div className={`${cell} col-span-2`} />
        <div className={`${cell} col-span-3 row-span-2`} />
      </div>
    );
  }

  return (
    <div className={`${frame} grid-cols-1 grid-rows-1`}>
      <div className={cell} />
    </div>
  );
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
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const currentValue = (field: FormField) =>
    fieldValues[field.name] ?? field.defaultValue?.toString() ?? "";

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
                  <div className={cn(field.previewKind === "gallery-layout" && "md:flex md:items-start md:gap-4")}>
                    <div className="relative flex-1">
                      <select
                        name={field.name}
                        required={field.required}
                        defaultValue={field.defaultValue?.toString() ?? ""}
                        onChange={(event) => setFieldValues((current) => ({ ...current, [field.name]: event.target.value }))}
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
                    {field.previewKind === "gallery-layout" ? (
                      <div className="mt-3 flex shrink-0 flex-col gap-2 md:mt-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#a5a098]">
                          Preview
                        </span>
                        <GalleryLayoutPreview layout={currentValue(field) || "D"} />
                      </div>
                    ) : null}
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

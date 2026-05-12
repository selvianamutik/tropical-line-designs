"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Modal } from "@/components/admin/ui/Modal";
import { cn } from "@/lib/utils";

type FormFieldOption = {
  label: string;
  value: string;
};

interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "month" | "textarea" | "select" | "file";
  placeholder?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  min?: number;
  max?: number;
  options?: FormFieldOption[];
  accept?: string;
  helpText?: string;
  currentMediaUrl?: string | null;
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

const galleryLayoutPreviewMap: Record<string, string[]> = {
  A: ["col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-2"],
  B: ["row-span-2", "col-span-2", "col-span-1", "col-span-1"],
  C: ["col-span-3", "col-span-1", "col-span-1", "col-span-1"],
  D: ["col-span-2", "col-span-1 row-span-2", "col-span-1", "col-span-2"],
  E: ["col-span-1 row-span-2", "col-span-2", "col-span-2", "col-span-1"],
  F: ["col-span-1", "col-span-1", "col-span-1 row-span-2", "col-span-2"],
  G: ["col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-1", "col-span-1"],
  H: ["col-span-1 row-span-2", "col-span-2 row-span-2", "col-span-1", "col-span-1"],
  I: ["col-span-3", "col-span-1", "col-span-1", "col-span-1", "col-span-3"],
  J: ["col-span-1", "col-span-2", "col-span-1", "col-span-2", "col-span-1"],
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : label}</Button>;
}

function isSupabaseStorageUrl(value: string) {
  return value.includes("/storage/v1/object/public/");
}

function GalleryLayoutPreview({ layout }: { layout: string }) {
  const blocks = galleryLayoutPreviewMap[layout] ?? galleryLayoutPreviewMap.D;

  return (
    <div className="rounded-sm border border-[#d9d4ca] bg-[#fbf7f0] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a867f]">
          Layout {layout}
        </span>
        <span className="text-[10px] text-[#a5a098]">Preview</span>
      </div>
      <div className="grid h-28 grid-cols-3 gap-1.5">
        {blocks.map((blockClass, index) => (
          <div
            key={`${layout}-${index}`}
            className={cn(
              "relative overflow-hidden rounded-[2px] border border-[#eadfcd] bg-gradient-to-br from-[#efe3cf] to-[#f7efe2]",
              blockClass,
            )}
          >
            <span className="absolute left-1.5 top-1.5 text-[9px] font-bold text-[#9a5f0c]">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
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
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImageLabel, setPreviewImageLabel] = useState("");
  const [selectValues, setSelectValues] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        fields
          .filter((field) => field.type === "select")
          .map((field) => [field.name, field.defaultValue?.toString() ?? ""]),
      ),
  );

  return (
    <>
      {triggerLabel ? (
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(true)}>
          <Pencil className="h-4 w-4 text-[#a5a098]" />
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
            {fields.map((field) => {
              const selectPreviewValue = selectValues[field.name] ?? field.defaultValue?.toString() ?? "";

              return (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      defaultValue={field.defaultValue?.toString() ?? ""}
                      placeholder={field.placeholder}
                      className={cn(
                        "min-h-[100px] w-full resize-y rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:border-[#d97706] focus-visible:outline-none",
                      )}
                    />
                  ) : field.type === "select" ? (
                    <div className={cn(field.previewKind ? "grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]" : "space-y-0")}>
                      <div className="relative">
                        <select
                          name={field.name}
                          required={field.required}
                          defaultValue={field.defaultValue?.toString() ?? ""}
                          onChange={(event) =>
                            setSelectValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                          className={cn(
                            "flex h-10 w-full cursor-pointer appearance-none rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 pr-10 text-sm text-[#383532] transition-colors focus-visible:border-[#d97706] focus-visible:outline-none",
                          )}
                        >
                          {field.placeholder ? <option value="" disabled>{field.placeholder}</option> : null}
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#a5a098]">
                          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95 10 13.657 15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                      {field.previewKind === "gallery-layout" ? (
                        <GalleryLayoutPreview layout={selectPreviewValue || "D"} />
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
                      {field.currentMediaUrl ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImageUrl(field.currentMediaUrl ?? null);
                            setPreviewImageLabel(field.label);
                          }}
                          className="flex items-center gap-3 rounded-sm border border-[#eadfcd] bg-[#fbf7f0] p-2 text-left transition-colors hover:border-[#d97706]"
                        >
                          <div className="relative h-14 w-20 overflow-hidden rounded-[2px] bg-[#efe7dc]">
                            <Image
                              src={field.currentMediaUrl}
                              alt={`Current ${field.label}`}
                              fill
                              sizes="80px"
                              className="object-cover"
                              unoptimized={isSupabaseStorageUrl(field.currentMediaUrl)}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a867f]">
                              Current image
                            </p>
                            <p className="truncate text-sm text-[#383532]">Open image preview</p>
                          </div>
                        </button>
                      ) : null}
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
              );
            })}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SubmitButton label={submitLabel} />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(previewImageUrl)}
        onClose={() => {
          setPreviewImageUrl(null);
          setPreviewImageLabel("");
        }}
        title={previewImageLabel || "Image Preview"}
        description="Current stored image preview."
      >
        {previewImageUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#efe7dc]">
            <Image
              src={previewImageUrl}
              alt={previewImageLabel || "Preview image"}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-contain"
              unoptimized={isSupabaseStorageUrl(previewImageUrl)}
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}

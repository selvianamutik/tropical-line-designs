"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Modal } from "@/components/admin/ui/Modal";
import {
  getAdminFieldInputAttributes,
  validateAdminFields,
  type AdminFormFieldType,
} from "@/lib/admin/form-field-validation";
import { IMAGE_UPLOAD_ACCEPT, IMAGE_UPLOAD_HELP_TEXT, validateImageFile } from "@/lib/admin/image-validation";
import { cn } from "@/lib/utils";

type FormFieldOption = {
  label: string;
  value: string;
};

interface FormField {
  name: string;
  label: string;
  type?: AdminFormFieldType;
  placeholder?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  options?: FormFieldOption[];
  accept?: string;
  helpText?: string;
  currentMediaUrl?: string | null;
}

interface ResourceFormDialogProps {
  title: string;
  description: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  fields: FormField[];
  triggerLabel?: string;
  initialId?: string;
  successMessage?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : label}</Button>;
}

function isSupabaseStorageUrl(value: string) {
  return value.includes("/storage/v1/object/public/");
}

export function ResourceFormDialog({
  title,
  description,
  submitLabel,
  action,
  fields,
  triggerLabel,
  initialId,
  successMessage,
}: ResourceFormDialogProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [isOpen, setIsOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImageLabel, setPreviewImageLabel] = useState("");
  const [selectedFilePreviews, setSelectedFilePreviews] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const clearFileState = () => {
    Object.values(selectedFilePreviews).forEach((url) => URL.revokeObjectURL(url));
    setSelectedFilePreviews({});
    setFieldErrors({});
    setFileErrors({});
    setPreviewImageUrl(null);
    setPreviewImageLabel("");
  };

  const openDialog = () => {
    clearFileState();
    setIsOpen(true);
  };

  const clearFieldError = (name: string) => {
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const closeDialog = () => {
    clearFileState();
    setIsOpen(false);
  };

  return (
    <>
      {triggerLabel ? (
        <Button onClick={openDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openDialog}>
          <Pencil className="h-4 w-4 text-[#a5a098]" />
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={closeDialog} title={title} description={description}>
        <form
          noValidate
          action={async (formData) => {
            const nextFieldErrors = validateAdminFields(fields, formData);
            setFieldErrors(nextFieldErrors);

            if (Object.keys(nextFieldErrors).length > 0 || Object.keys(fileErrors).length > 0) {
              const allErrors = [
                ...Object.values(fileErrors),
                ...Object.values(nextFieldErrors),
              ];
              showToast({
                tone: "error",
                title: "Input belum valid.",
                description: allErrors[0] || "Periksa kembali field yang ditandai sebelum menyimpan.",
              });
              return;
            }

            try {
              await action(formData);
              showToast({
                tone: "success",
                title: successMessage ?? (initialId ? "Perubahan berhasil disimpan." : "Data berhasil ditambahkan."),
              });
              router.refresh();
              closeDialog();
            } catch (error) {
              showToast({
                tone: "error",
                title: "Gagal menyimpan data.",
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat memproses permintaan.",
              });
            }
          }}
        >
          {initialId ? <input type="hidden" name="id" value={initialId} /> : null}
          <div className="space-y-4">
            {fields.map((field) => {
              const inputAttributes = getAdminFieldInputAttributes(field);
              const errorMessage = fieldErrors[field.name];

              return (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                    {field.label}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      minLength={inputAttributes.minLength}
                      maxLength={inputAttributes.maxLength}
                      aria-invalid={Boolean(errorMessage)}
                      onChange={() => clearFieldError(field.name)}
                      defaultValue={field.defaultValue?.toString() ?? ""}
                      placeholder={field.placeholder}
                      className={cn(
                        "min-h-[100px] w-full resize-y rounded-sm border border-[#d9d4ca] bg-transparent px-3 py-2 text-sm text-[#383532] transition-colors placeholder:text-[#a5a098] focus-visible:border-[#d97706] focus-visible:outline-none",
                      )}
                    />
                  ) : field.type === "select" ? (
                    <div className="relative">
                      <select
                        name={field.name}
                        required={field.required}
                        aria-invalid={Boolean(errorMessage)}
                        onChange={() => clearFieldError(field.name)}
                        defaultValue={field.defaultValue?.toString() ?? ""}
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
                  ) : field.type === "file" ? (
                    <div className="space-y-2">
                      <Input
                        name={field.name}
                        type="file"
                        required={field.required}
                        accept={IMAGE_UPLOAD_ACCEPT}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setFileErrors((current) => {
                            const next = { ...current };
                            delete next[field.name];
                            return next;
                          });
                          setSelectedFilePreviews((current) => {
                            if (!current[field.name]) {
                              return file ? current : current;
                            }

                            URL.revokeObjectURL(current[field.name]);
                            const next = { ...current };
                            delete next[field.name];
                            return next;
                          });

                          if (!file) {
                            return;
                          }

                          const validation = validateImageFile(file);
                          if (!validation.valid) {
                            event.target.value = "";
                            setFileErrors((current) => ({
                              ...current,
                              [field.name]: validation.message,
                            }));
                            return;
                          }

                          const objectUrl = URL.createObjectURL(file);
                          setSelectedFilePreviews((current) => ({
                            ...current,
                            [field.name]: objectUrl,
                          }));
                        }}
                      />
                      {fileErrors[field.name] ? (
                        <p className="text-[11px] font-medium text-[#a13c2f]">{fileErrors[field.name]}</p>
                      ) : null}
                      {selectedFilePreviews[field.name] ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImageUrl(selectedFilePreviews[field.name]);
                            setPreviewImageLabel(`${field.label} preview`);
                          }}
                          className="flex items-center gap-3 rounded-sm border border-[#eadfcd] bg-[#fbf7f0] p-2 text-left transition-colors hover:border-[#d97706]"
                        >
                          <div className="relative h-14 w-20 overflow-hidden rounded-[2px] bg-[#efe7dc]">
                            <Image
                              src={selectedFilePreviews[field.name]}
                              alt={`${field.label} preview`}
                              fill
                              sizes="80px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a867f]">
                              Selected image
                            </p>
                            <p className="truncate text-sm text-[#383532]">Open selected image preview</p>
                          </div>
                        </button>
                      ) : null}
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
                      <p className="text-[11px] text-[#8a867f]">{IMAGE_UPLOAD_HELP_TEXT}</p>
                    </div>
                  ) : (
                    <Input
                      name={field.name}
                      type={field.type ?? "text"}
                      required={field.required}
                      placeholder={field.placeholder}
                      defaultValue={field.defaultValue?.toString() ?? ""}
                      min={inputAttributes.min}
                      max={inputAttributes.max}
                      minLength={inputAttributes.minLength}
                      maxLength={inputAttributes.maxLength}
                      pattern={inputAttributes.pattern}
                      step={inputAttributes.step}
                      title={inputAttributes.title}
                      aria-invalid={Boolean(errorMessage)}
                      onChange={() => clearFieldError(field.name)}
                    />
                  )}

                  {errorMessage ? (
                    <p className="text-[11px] font-medium text-[#a13c2f]">{errorMessage}</p>
                  ) : null}

                  {field.type !== "file" && field.helpText ? (
                    <p className="text-[11px] text-[#8a867f]">{field.helpText}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeDialog}>
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

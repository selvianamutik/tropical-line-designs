"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { GripVertical, Images, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { addPortfolioGalleryImage, deletePortfolioGalleryImage, updatePortfolioGalleryOrder } from "@/app/admin/actions";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Modal } from "@/components/admin/ui/Modal";
import type { PortfolioGalleryItemRecord, PortfolioRecord } from "@/lib/admin/types";

type ProjectGalleryDialogProps = {
  project: PortfolioRecord;
  portfolioGalleryItems: PortfolioGalleryItemRecord[];
};

function moveItem(items: PortfolioGalleryItemRecord[], fromId: string, toId: string) {
  const nextItems = [...items];
  const fromIndex = nextItems.findIndex((item) => item.id === fromId);
  const toIndex = nextItems.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const [moved] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, moved);
  return nextItems;
}

function isSupabaseStorageUrl(value: string) {
  return value.includes(".supabase.co/storage/v1/object/public/");
}

export function ProjectGalleryDialog({ project, portfolioGalleryItems }: ProjectGalleryDialogProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [portfolioGalleryItemState, setPortfolioGalleryItemState] = useState(portfolioGalleryItems);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasChanges = useMemo(
    () => portfolioGalleryItemState.some((item, index) => item.id !== portfolioGalleryItems[index]?.id),
    [portfolioGalleryItemState, portfolioGalleryItems],
  );
  // const [showDebug, setShowDebug] = useState(false);

  // const debugSnapshot = useMemo(() => ({
  //   project: {
  //     id: project.id,
  //     title: project.title,
  //     slug: project.slug,
  //     gallery_layout: project.gallery_layout,
  //   },
  //   portfolioGalleryItemsFromServer: portfolioGalleryItems.map((item) => ({
  //     id: item.id,
  //     portfolio_id: item.portfolio_id,
  //     media_asset_id: item.media_asset_id,
  //     sort_order: item.sort_order,
  //     caption: item.caption,
  //     media_asset_url: item.media_asset_url,
  //     media_asset_path: item.media_asset_path,
  //   })),
  //   portfolioGalleryItemsInDialogState: portfolioGalleryItemState.map((item, index) => ({
  //     index,
  //     id: item.id,
  //     sort_order: item.sort_order,
  //     media_asset_url: item.media_asset_url,
  //     media_asset_path: item.media_asset_path,
  //   })),
  //   counts: {
  //     fromServer: portfolioGalleryItems.length,
  //     inDialogState: portfolioGalleryItemState.length,
  //   },
  // }), [portfolioGalleryItemState, portfolioGalleryItems, project.gallery_layout, project.id, project.slug, project.title]);

  const resetState = () => {
    setPortfolioGalleryItemState(portfolioGalleryItems);
    setDraggedId(null);
    setSelectedFile(null);
    setSelectedFilePreviewUrl(null);
    setErrorMessage(null);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.set("portfolio_id", project.id);
    formData.set("ordered_item_ids", JSON.stringify(portfolioGalleryItemState.map((item) => item.id)));

    startTransition(async () => {
      try {
        setErrorMessage(null);
        await updatePortfolioGalleryOrder(formData);
        showToast({
          tone: "success",
          title: "Urutan galeri berhasil disimpan.",
        });
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal menyimpan urutan galeri.";
        setErrorMessage(message);
        showToast({
          tone: "error",
          title: "Gagal menyimpan urutan galeri.",
          description: message,
        });
      }
    });
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.set("portfolio_id", project.id);
    formData.set("portfolio_title", project.title);
    formData.set("image_file", selectedFile);

    startUploadTransition(async () => {
      try {
        setErrorMessage(null);
        await addPortfolioGalleryImage(formData);
        showToast({
          tone: "success",
          title: "Foto galeri berhasil diunggah.",
        });
        router.refresh();
        setSelectedFile(null);
        setIsOpen(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal mengunggah foto galeri.";
        setErrorMessage(message);
        showToast({
          tone: "error",
          title: "Gagal mengunggah foto galeri.",
          description: message,
        });
      }
    });
  };

  

  const handleDelete = (galleryItemId: string) => {
    const formData = new FormData();
    formData.set("portfolio_id", project.id);
    formData.set("gallery_item_id", galleryItemId);

    startDeleteTransition(async () => {
      try {
        setErrorMessage(null);
        await deletePortfolioGalleryImage(formData);
        showToast({
          tone: "success",
          title: "Foto galeri berhasil dihapus.",
        });
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal menghapus foto galeri.";
        setErrorMessage(message);
        showToast({
          tone: "error",
          title: "Gagal menghapus foto galeri.",
          description: message,
        });
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          resetState();
          setIsOpen(true);
        }}
      >
        <Images className="mr-2 h-3.5 w-3.5" />
        Gallery
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (isPending) return;
          setIsOpen(false);
          resetState();
        }}
        title={`Gallery Order: ${project.title}`}
        description="Drag dan drop thumbnail untuk mengubah urutan foto di overlay project."
      >
        <div className="space-y-6 overflow-x-hidden">
          {errorMessage ? (
            <div className="rounded-sm border border-[#e7b4ad] bg-[#fff0ee] px-4 py-3 text-sm text-[#9a3c2f]">
              {errorMessage}
            </div>
          ) : null}

          {/* <div className="rounded-sm border border-[#e9e6df] bg-[#f7f3eb] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                  Debug Gallery Data
                </p>
                <p className="mt-1 text-[11px] text-[#8a867f]">
                  Cek apakah dialog menerima data dari field yang benar.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDebug((current) => !current)}
              >
                {showDebug ? "Hide Debug" : "Show Debug"}
              </Button>
            </div>

            {showDebug ? (
              <pre className="mt-4 overflow-x-auto rounded-sm border border-[#e9e6df] bg-white p-3 text-[11px] leading-5 text-[#383532]">
                {JSON.stringify(debugSnapshot, null, 2)}
              </pre>
            ) : null}
          </div> */}

          <div className="rounded-sm border border-[#e9e6df] bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                  Add Gallery Image
                </label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (selectedFilePreviewUrl) {
                      URL.revokeObjectURL(selectedFilePreviewUrl);
                    }
                    setSelectedFile(file);
                    setSelectedFilePreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                />
                {selectedFilePreviewUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImageUrl(selectedFilePreviewUrl)}
                    className="flex items-center gap-3 rounded-sm border border-[#eadfcd] bg-[#fbf7f0] p-2 text-left transition-colors hover:border-[#d97706]"
                  >
                    <div className="relative h-16 w-24 overflow-hidden rounded-[2px] bg-[#efe7dc]">
                      <Image
                        src={selectedFilePreviewUrl}
                        alt="Selected gallery image preview"
                        fill
                        sizes="96px"
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
                <p className="text-[11px] text-[#8a867f]">
                  Upload JPG, PNG, WebP, atau AVIF hingga 10MB. File akan dikonversi otomatis ke WebP.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isPending || isUploading || isDeleting}
              >
                <Upload className="mr-2 h-3.5 w-3.5" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          {portfolioGalleryItemState.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[#d9d4ca] bg-white px-4 py-8 text-sm text-[#8a867f]">
              Project ini belum memiliki foto galeri.
            </div>
          ) : (
            <div className="space-y-4">
            <div className="grid gap-3">
              {portfolioGalleryItemState.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedId(item.id)}
                  onDragEnd={() => setDraggedId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (!draggedId || draggedId === item.id) return;
                    setPortfolioGalleryItemState((current) => moveItem(current, draggedId, item.id));
                    setDraggedId(null);
                  }}
                  className="flex min-w-0 items-center gap-3 rounded-sm border border-[#e9e6df] bg-white p-3 transition-colors hover:border-[#d9d4ca] md:gap-4"
                >
                  <div className="flex w-8 shrink-0 items-center justify-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a867f]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-[#f4efe6]">
                    <Image
                      src={item.media_asset_url}
                      alt={`${project.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={isSupabaseStorageUrl(item.media_asset_url)}
                    />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden pr-1">
                    <p className="block max-w-full truncate text-sm font-semibold text-[#383532]">
                      {item.caption || item.media_asset_path}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-[#8a867f]">
                      Drag untuk memindahkan posisi foto pada overlay.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-[#a85b50] hover:bg-[#fff0ee] hover:text-[#a13c2f]"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending || isUploading || isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#d9d4ca] bg-[#fdfbf7] text-[#8a867f]">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#e9e6df] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={resetState}
                disabled={isPending || isUploading || isDeleting || !hasChanges}
                className="w-full sm:w-auto"
              >
                Reset Order
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetState();
                  }}
                  disabled={isPending || isUploading || isDeleting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending || isUploading || isDeleting || !hasChanges}
                  className="w-full sm:w-auto"
                >
                  {isPending ? "Saving..." : "Save Order"}
                </Button>
              </div>
            </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(previewImageUrl)}
        onClose={() => setPreviewImageUrl(null)}
        title="Gallery Image Preview"
        description="Selected image preview."
      >
        {previewImageUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#efe7dc]">
            <Image
              src={previewImageUrl}
              alt="Selected gallery image preview"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-contain"
              unoptimized
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}

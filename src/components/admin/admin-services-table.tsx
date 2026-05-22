"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { GripVertical, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteService, updateServiceSortOrder, upsertService } from "@/app/admin/actions";
import { DeleteResourceForm } from "@/components/admin/delete-resource-form";
import { ResourceFormDialog } from "@/components/admin/resource-form-dialog";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/admin/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/Table";
import type { ServiceRecord } from "@/lib/admin/types";

type AdminServicesTableProps = {
  services: ServiceRecord[];
};

const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Hidden", value: "false" },
] as const;

function isSupabaseStorageUrl(value: string) {
  return value.includes("/storage/v1/object/public/");
}

function moveService(items: ServiceRecord[], fromId: string, toId: string) {
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

export function AdminServicesTable({ services }: AdminServicesTableProps) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [orderedServices, setOrderedServices] = useState(services);
  const [draggedServiceId, setDraggedServiceId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrderedServices(services);
  }, [services]);

  const hasOrderChanges = orderedServices.some((service, index) => service.id !== services[index]?.id);

  const handleSaveServiceOrder = () => {
    const formData = new FormData();
    formData.set("ordered_service_ids", JSON.stringify(orderedServices.map((service) => service.id)));

    startTransition(async () => {
      try {
        await updateServiceSortOrder(formData);
        showToast({
          tone: "success",
          title: "Urutan service berhasil disimpan.",
        });
        router.refresh();
      } catch (error) {
        showToast({
          tone: "error",
          title: "Gagal menyimpan urutan service.",
          description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan urutan service.",
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-sm border border-[#e9e6df] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a867f]">Service Order</p>
          <p className="mt-1 text-sm text-[#6b6762]">Drag baris service untuk mengubah urutan tampil di halaman publik.</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!hasOrderChanges || isPending}
            onClick={() => setOrderedServices(services)}
          >
            Reset Order
          </Button>
          <Button type="button" disabled={!hasOrderChanges || isPending} onClick={handleSaveServiceOrder}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save Service Order"}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[72px]">Move</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderedServices.map((service, index) => (
            <TableRow
              key={service.id}
              draggable
              onDragStart={() => setDraggedServiceId(service.id)}
              onDragEnd={() => setDraggedServiceId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (!draggedServiceId || draggedServiceId === service.id) return;
                setOrderedServices((current) => moveService(current, draggedServiceId, service.id));
                setDraggedServiceId(null);
              }}
            >
              <TableCell>
                <div className="flex items-center gap-3 text-[#8a867f]">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-semibold">{service.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#6b6762]">{service.description ?? "-"}</p>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {[service.image_1_public_url, service.image_2_public_url].filter(Boolean).map((imageUrl, imageIndex) => (
                    <div
                      key={`${service.id}-image-${imageIndex}`}
                      className="relative h-14 w-20 overflow-hidden rounded-[2px] bg-[#efe7dc]"
                    >
                      <Image
                        src={imageUrl as string}
                        alt={`${service.title} image ${imageIndex + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized={isSupabaseStorageUrl(imageUrl as string)}
                      />
                    </div>
                  ))}
                  {!service.image_1_public_url && !service.image_2_public_url ? (
                    <span className="text-sm text-[#8a867f]">-</span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-[#6b6762]">{index}</TableCell>
              <TableCell>
                <span className="rounded-sm bg-[#f4efe6] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a867f]">
                  {service.is_active ? "Active" : "Hidden"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ResourceFormDialog
                    title="Edit Service"
                    description="Update the service entry."
                    submitLabel="Save Changes"
                    action={upsertService}
                    initialId={service.id}
                    fields={[
                      { name: "title", label: "Service Title", required: true, defaultValue: service.title },
                      { name: "description", label: "Description", type: "textarea", maxLength: 1200, defaultValue: service.description },
                      {
                        name: "image_1_file",
                        label: "Image 1",
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp",
                        currentMediaUrl: service.image_1_public_url,
                        helpText: service.image_1_public_url
                          ? "Leave empty to keep the current image. New uploads will be converted to WebP automatically."
                          : "Leave empty if you do not want to add an image yet. New uploads will be converted to WebP automatically.",
                      },
                      {
                        name: "image_2_file",
                        label: "Image 2",
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp",
                        currentMediaUrl: service.image_2_public_url,
                        helpText: service.image_2_public_url
                          ? "Leave empty to keep the current image. New uploads will be converted to WebP automatically."
                          : "Leave empty if you do not want to add an image yet. New uploads will be converted to WebP automatically.",
                      },
                      {
                        name: "is_active",
                        label: "Visibility",
                        type: "select",
                        required: true,
                        defaultValue: service.is_active ? "true" : "false",
                        options: [...statusOptions],
                      },
                    ]}
                  />
                  <DeleteResourceForm id={service.id} label={`Delete ${service.title}`} action={deleteService} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

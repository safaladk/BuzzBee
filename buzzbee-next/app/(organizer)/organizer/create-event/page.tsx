"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateEvent, useUpdateEvent } from "@/features/events/queries";
import { useSearchParams, useRouter } from "next/navigation";
import { eventService } from "@/features/events/services";
import { CreateEventPayload, TicketTier } from "@/lib/types";
import { EventBasicInfo } from "@/features/events/components/create-event/EventBasicInfo";
import { EventLogistics } from "@/features/events/components/create-event/EventLogistics";
import { EventTicketing } from "@/features/events/components/create-event/EventTicketing";
import { EventImageUpload } from "@/features/events/components/create-event/EventImageUpload";
import { EventFormActions } from "@/features/events/components/create-event/EventFormActions";

function CreateEventContent() {
  const {
    mutate: createEvent,
    isPending: isCreating,
    isError,
    error,
  } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const isPending = isCreating || isUpdating;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const editingId = searchParams?.get("id") || null;
  const isEditing = !!editingId;

  const [formData, setFormData] = useState<CreateEventPayload>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    district: "",
    category: "Music",
    price: 0,
    image: "",
    capacity: 0,
    serviceFee: 0,
    maxTicketsPerUser: 0,
    highlights: "",
    ticketTiers: [],
  });

  const handleUpdateTiers = (tiers: TicketTier[]) => {
    setFormData((prev) => {
      const newPrice = tiers.length > 0 ? Math.min(...tiers.map((t) => t.price)) : prev.price;
      const newCapacity = tiers.length > 0 ? tiers.reduce((acc, t) => acc + t.capacity, 0) : prev.capacity;
      return {
        ...prev,
        ticketTiers: tiers,
        price: newPrice,
        capacity: newCapacity,
      };
    });
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setLocalError(null);
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "capacity" || name === "serviceFee" || name === "maxTicketsPerUser"
          ? value === ""
            ? 0
            : parseFloat(value)
          : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setLocalError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${editingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        // populate form
        setFormData((prev) => ({
          ...prev,
          title: data.title || "",
          description: data.description || "",
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
          time: data.time || "",
          location: data.location || "",
          district: data.district || "",
          category: data.category || "Music",
          price: Number(data.price) || 0,
          image: data.image || "",
          capacity: Number(data.capacity) || 0,
          serviceFee: Number(data.serviceFee) || 0,
          maxTicketsPerUser: Number(data.maxTicketsPerUser) || 0,
          highlights: data.highlights || "",
          ticketTiers: data.ticketTiers || [],
        }));

        if (data.image) {
          if (typeof data.image === "string" && data.image.startsWith("http")) {
            setImageMode("url");
            setImagePreview(null);
          } else {
            setImageMode("file");
            setImagePreview(data.image as string);
          }
        }
      } catch (err) {
        // ignore
      }
    };

    fetchEvent();
  }, [isEditing, editingId]);

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setLocalError("Event title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setLocalError("Description is required");
      return false;
    }
    if (!formData.date) {
      setLocalError("Date is required");
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setLocalError("Event date cannot be in the past");
      return false;
    }
    if (!formData.time) {
      setLocalError("Time is required");
      return false;
    }
    if (!formData.location.trim()) {
      setLocalError("Location is required");
      return false;
    }
    if (!formData.district) {
      setLocalError("District is required");
      return false;
    }
    if ((Number(formData.price) ?? 0) < 0) {
      setLocalError("Price must be 0 or greater");
      return false;
    }
    if ((Number(formData.capacity) ?? 0) <= 0) {
      setLocalError("Total Tickets must be at least 1");
      return false;
    }
    if ((Number(formData.serviceFee) ?? 0) < 0) {
      setLocalError("Service Fee must be 0 or greater");
      return false;
    }
    if ((Number(formData.maxTicketsPerUser) ?? 0) < 0) {
      setLocalError("Max tickets per user must be 0 or greater");
      return false;
    }
    return true;
  };

  const handleSubmit = async (isPublished: boolean) => {
    setLocalError(null);
    if (!validateForm()) {
      return;
    }

    let finalFormData = { ...formData, isPublished };

    // Handle file upload
    if (imageFile) {
      try {
        const fileFormData = new FormData();
        fileFormData.append("file", imageFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
          {
            method: "POST",
            body: fileFormData,
          },
        );

        if (!response.ok) {
          // If upload endpoint doesn't exist, use base64 for now
          finalFormData.image = imagePreview || "";
        } else {
          const data = await response.json();
          finalFormData.image = data.url || imagePreview || "";
        }
      } catch (err) {
        // Fallback: use base64 encoded image
        finalFormData.image = imagePreview || "";
      }
    } else if (imageMode === "url" && formData.image) {
      finalFormData.image = formData.image;
    }

    // Ensure numeric fields are numbers
    finalFormData = {
      ...finalFormData,
      price: Number(formData.price) || 0,
      capacity: Number(formData.capacity) || 0,
      serviceFee: Number(formData.serviceFee) || 0,
      maxTicketsPerUser: Number(formData.maxTicketsPerUser) || 0,
      highlights: formData.highlights ?? "",
    } as any;

    if (isEditing && editingId) {
      updateEvent({ id: editingId, data: finalFormData });
    } else {
      createEvent(finalFormData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to create and publish your event
          </p>

          <form className="space-y-6">
            {(localError || (isError && error)) && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <p className="font-medium">Error</p>
                <p>
                  {localError ||
                    (error as any)?.message ||
                    "Failed to create event"}
                </p>
              </div>
            )}

            <EventBasicInfo formData={formData} onChange={handleChange} />

            <EventLogistics formData={formData} onChange={handleChange} />

            <EventTicketing
              formData={formData}
              onChange={handleChange}
              onUpdateTiers={handleUpdateTiers}
            />

            <EventImageUpload
              formData={formData}
              imageMode={imageMode}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              onChange={handleChange}
              onFileSelect={handleFileSelect}
              onClearImage={clearImage}
              onSetImageMode={setImageMode}
            />

            <EventFormActions
              isPending={isPending}
              isEditing={isEditing}
              onSaveDraft={() => handleSubmit(false)}
              onPublish={() => handleSubmit(true)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}


export default function CreateEventPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CreateEventContent />
    </Suspense>
  );
}
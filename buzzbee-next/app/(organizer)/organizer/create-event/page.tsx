"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateEvent, useUpdateEvent } from "@/features/events/queries";
import { useSearchParams, useRouter } from "next/navigation";
import { eventService } from "@/features/events/services";
import { CreateEventPayload } from "@/lib/types";

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
  });

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
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Music Festival 2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={18} />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                >
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Food">Food</option>
                  <option value="Sports">Sports</option>
                  <option value="Technology">Technology</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={18} />
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0 for free event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              {/* Capacity */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={18} />
                  Total Tickets
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Service Fee */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={18} />
                  Service Fee (Rs.)
                </label>
                <input
                  type="number"
                  name="serviceFee"
                  min="0"
                  step="0.01"
                  value={formData.serviceFee}
                  onChange={handleChange}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Max Tickets Per User */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={18} />
                  Max Tickets Per User
                </label>
                <input
                  type="number"
                  name="maxTicketsPerUser"
                  min="0"
                  value={formData.maxTicketsPerUser}
                  onChange={handleChange}
                  placeholder="0 for unlimited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Highlights */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Event Highlights (comma separated)
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  placeholder="Live Music, Food Stalls, Cultural Dance"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Thamel, Kathmandu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  required
                >
                  <option value="">Select a district</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Biratnagar">Biratnagar</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Event Image
              </label>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode("url");
                    clearImage();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    imageMode === "url"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode("file");
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    imageMode === "file"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Upload
                </button>
              </div>

              {/* URL Input */}
              {imageMode === "url" && (
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              )}

              {/* File Upload */}
              {imageMode === "file" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-600 hover:bg-indigo-50 transition flex flex-col items-center gap-2"
                  >
                    <Upload size={24} />
                    <span className="text-sm font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </button>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => handleSubmit(false)}
                icon={null}
                type="button"
                disabled={isPending}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                icon={null}
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isPending}
              >
                {isPending
                  ? isEditing
                    ? "Updating..."
                    : "Publishing..."
                  : isEditing
                    ? "Update Event"
                    : "Publish Event"}
              </Button>
            </div>
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

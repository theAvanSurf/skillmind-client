"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Loader2, Plus, ImageIcon, Upload } from "lucide-react"
import { useCreateCourse } from "../hooks/useProfessor"

const schema = z.object({
  title: z.string().min(5, "At least 5 characters").max(120, "Max 120 characters"),
  description: z.string().min(20, "At least 20 characters"),
  price: z.coerce.number().min(0, "Cannot be negative"),
  tags: z.string(),
})

type FormData = z.infer<typeof schema>

const field = (err?: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition bg-white/[0.04] focus:bg-white/[0.07] focus:ring-2 ${
    err
      ? "border-red-500/50 focus:ring-red-500/15"
      : "border-white/10 focus:border-blue-500/40 focus:ring-blue-500/10"
  }`

interface Props {
  onClose: () => void
  onCreated: (courseId: string) => void
}

export default function CreateCourseModal({ onClose, onCreated }: Props) {
  const createCourse = useCreateCourse()
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    mode: "onTouched",
    defaultValues: { price: 0, tags: "" },
  })

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/media-upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok && data.secure_url) {
        setThumbnailUrl(data.secure_url)
      }
    } catch {
      // silent — user can paste a URL manually
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const onSubmit = async (data: FormData) => {
    const course = await createCourse.mutateAsync({
      title: data.title,
      description: data.description,
      price: data.price,
      tags: data.tags || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
    })
    onCreated(course.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#11111a] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">New Course</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input {...register("title")} placeholder="Course title" className={field(!!errors.title)} />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="What will students learn?"
              rows={3}
              className={`${field(!!errors.description)} resize-none`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-white/40">Thumbnail <span className="text-white/20">(optional)</span></p>
            <div className="flex gap-3">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={20} className="text-white/15" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 size={16} className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.07] hover:text-white/80">
                  <Upload size={13} />
                  {uploading ? "Uploading…" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                    disabled={uploading}
                  />
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Or paste an image URL"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition focus:border-blue-500/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          <div>
            <input {...register("price")} type="number" step="0.01" placeholder="Price (0 = free)" className={field(!!errors.price)} />
            {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
          </div>

          <div>
            <input {...register("tags")} placeholder="Tags (comma-separated, e.g. React, TypeScript)" className={field()} />
          </div>

          {createCourse.error && (
            <p className="text-xs text-red-400">
              {createCourse.error instanceof Error ? createCourse.error.message : "Failed to create course"}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || createCourse.isPending || uploading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition ${
                isValid && !createCourse.isPending && !uploading
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "cursor-not-allowed bg-white/10 text-white/30"
              }`}
            >
              {createCourse.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Plus size={14} /> Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

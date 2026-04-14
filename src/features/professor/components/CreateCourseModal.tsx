"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Loader2, Plus } from "lucide-react"
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    mode: "onTouched",
    defaultValues: { price: 0, tags: "" },
  })

  const onSubmit = async (data: FormData) => {
    const course = await createCourse.mutateAsync({
      title: data.title,
      description: data.description,
      price: data.price,
      tags: data.tags || undefined,
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
              disabled={!isValid || createCourse.isPending}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition ${
                isValid && !createCourse.isPending
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

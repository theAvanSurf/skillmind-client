import httpClientBrowser from "@/configurations/httpClientBrowser"
import type { BrowseCoursesQuery, BrowseCoursesResult, CourseSuggestion } from "../types/course.types"

export async function browseCourses(query: BrowseCoursesQuery): Promise<BrowseCoursesResult> {
    const params = new URLSearchParams()
    if (query.search)                params.set("search", query.search)
    if (query.category)              params.set("category", query.category)
    if (query.freeOnly !== undefined) params.set("freeOnly", String(query.freeOnly))
    if (query.page !== undefined)    params.set("page", String(query.page))
    if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize))
    if (query.sort)                  params.set("sort", query.sort)

    const qs = params.toString()
    return httpClientBrowser.get(`/courses${qs ? `?${qs}` : ""}`) as unknown as Promise<BrowseCoursesResult>
}

export async function getCourseSuggestions(q: string): Promise<CourseSuggestion[]> {
    if (!q || q.trim().length < 2) return []
    return httpClientBrowser.get(`/courses/search?q=${encodeURIComponent(q)}`) as unknown as Promise<CourseSuggestion[]>
}

export async function getCourseCategories(): Promise<string[]> {
    return httpClientBrowser.get("/courses/categories") as unknown as Promise<string[]>
}

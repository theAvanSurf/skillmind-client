import { useQuery } from "@tanstack/react-query";
import CoursesService from "@/features/courses/services/courses.service";

const coursesService = new CoursesService();

export function useCourse(id: string) {
    return useQuery({
        queryKey: ["course", id],
        queryFn: () => coursesService.getCourseById(id),
        enabled: !!id,
    });
}

export function useRelatedCourses(id: string) {
    return useQuery({
        queryKey: ["related-courses", id],
        queryFn: () => coursesService.getRelatedCourses(id),
        enabled: !!id,
    });
}
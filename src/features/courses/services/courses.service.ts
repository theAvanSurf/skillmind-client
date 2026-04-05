import httpClientBrowser from "@/configurations/httpClientBrowser";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { CourseDto, CourseCardDto, UpdateProgressDto } from "@/features/courses/types/course.types";
import { getMockCourse, mockRelatedCourses } from "@/features/courses/mock-courses";

const USE_MOCK = true; // cambia a false cuando conectes la API real

export default class CoursesService {
    async getCourseById(id: string): Promise<CourseDto> {
        if (USE_MOCK) return getMockCourse(id);
        const response = await httpClientBrowser.get<CourseDto>(API_ENDPOINTS.COURSES.GET_BY_ID(id));
        return response as unknown as CourseDto;
    }

    async getRelatedCourses(id: string): Promise<CourseCardDto[]> {
        if (USE_MOCK) return mockRelatedCourses.filter(c => c.id !== id);
        const response = await httpClientBrowser.get<CourseCardDto[]>(API_ENDPOINTS.COURSES.GET_RELATED(id));
        return response as unknown as CourseCardDto[];
    }

    async updateProgress(id: string, dto: UpdateProgressDto): Promise<void> {
        await httpClientBrowser.post(API_ENDPOINTS.COURSES.UPDATE_PROGRESS(id), dto);
    }
}
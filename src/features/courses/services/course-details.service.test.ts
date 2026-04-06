import { describe, expect, it } from "vitest";
import {
  fetchCourseDetails,
  resolveSeason,
} from "@/features/courses/services/course-details.service";

describe("course-details service", () => {
  it("returns course details with seasons and related courses max 15", async () => {
    const details = await fetchCourseDetails("1");

    expect(details).not.toBeNull();
    expect(details?.seasons.length).toBeGreaterThan(0);
    expect(details?.relatedCourses.length).toBeLessThanOrEqual(15);
    expect(details?.relatedCourses.some((course) => course.id === details.id)).toBe(false);
  });

  it("returns null for missing course", async () => {
    const details = await fetchCourseDetails("__missing__");
    expect(details).toBeNull();
  });

  it("throws when failure is simulated", async () => {
    await expect(fetchCourseDetails("1", { simulateFailure: true })).rejects.toThrow(
      "Unable to load course"
    );
  });

  it("falls back to first season when selected season is invalid", async () => {
    const details = await fetchCourseDetails("1");
    expect(details).not.toBeNull();

    const selected = resolveSeason(details!.seasons, "invalid-season");
    expect(selected.id).toBe(details!.seasons[0].id);
  });
});

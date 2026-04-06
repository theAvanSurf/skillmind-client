import { describe, expect, it } from "vitest";
import { parseDurationToSeconds } from "@/features/courses/utils/course-progress";

describe("course-progress utils", () => {
  it("parses hour/minute durations into seconds", () => {
    expect(parseDurationToSeconds("2h 30m")).toBe(9000);
    expect(parseDurationToSeconds("45 mins")).toBe(2700);
    expect(parseDurationToSeconds("1 hour")).toBe(3600);
  });

  it("returns safe fallback when duration is not parseable", () => {
    expect(parseDurationToSeconds("unknown")).toBe(3600);
  });
});

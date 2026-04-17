import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; examId: string }> }) {
    try {
        const { id, examId } = await params;
        const data = await httpClient.get(`/courses/${id}/exams/${examId}/my-result`);
        return NextResponse.json(data);
    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        const message = err?.message ?? "Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}

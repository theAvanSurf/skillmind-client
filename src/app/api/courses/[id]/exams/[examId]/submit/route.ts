import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/configurations/httpClient";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; examId: string }> }) {
    try {
        const { id, examId } = await params;
        const body = await req.json();
        const data = await httpClient.post(`/courses/${id}/exams/${examId}/submit`, body);
        return NextResponse.json(data);
    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        const message = err?.message ?? "Error";
        return NextResponse.json({ message }, { status: status >= 100 && status < 600 ? status : 500 });
    }
}

import httpClient from '@/configurations/httpClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
  ): Promise<NextResponse> {
    const courseId = (await params).courseId;
    try {
      const data = await httpClient.get(`/professor/certificates/course/${courseId}`);
      return NextResponse.json(data);
    } catch (error: any) {
      console.error(`Fetch error proxying /professor/certificates/course/${courseId}:`, error);
      const status = error?.response?.status ?? (Number(error?.code) || 500);
      const message = error?.message ?? 'Internal Server Error';
      return NextResponse.json(
        { message },
        { status: status >= 100 && status < 600 ? status : 500 }
      );
    }
  }
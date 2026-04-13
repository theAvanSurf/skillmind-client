import { useCallback } from 'react';
import type { TrackEventType } from '@/types/recommendations.types';

export function useTracking() {
    const trackEvent = useCallback(async (
        courseId: string,
        eventType: TrackEventType,
        category?: string,
        tags?: string
    ) => {
        try {
            // Note: fire and forget, we don't await blocking UI
            fetch('/api/recommendations/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id: courseId,
                    event_type: eventType,
                    category,
                    tags,
                }),
            }).catch(console.error);
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }, []);

    return { trackEvent };
}

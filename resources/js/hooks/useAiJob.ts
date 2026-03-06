import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export type AiJobStatus = "pending" | "processing" | "done" | "failed";

export interface AiJobState {
    status: AiJobStatus;
    result: string | null;
    error: string | null;
    isPolling: boolean;
}

/* ─────────────────────────────────────────────
   Hook
   ───────────────────────────────────────────── */
/**
 * Polls GET /admin/ai/jobs/{jobId}/status every 2 seconds.
 * Automatically stops polling when status is 'done' or 'failed'.
 * Cleans up interval on unmount.
 */
export function useAiJob(jobId: string | null): AiJobState {
    const [status, setStatus] = useState<AiJobStatus>("pending");
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPolling(false);
    }, []);

    useEffect(() => {
        if (!jobId) {
            // Reset state when jobId becomes null
            setStatus("pending");
            setResult(null);
            setError(null);
            setIsPolling(false);
            return;
        }

        setStatus("processing");
        setResult(null);
        setError(null);
        setIsPolling(true);

        const poll = async () => {
            try {
                const response = await fetch(`/admin/ai/jobs/${jobId}/status`, {
                    headers: { Accept: "application/json" },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = (await response.json()) as {
                    status: AiJobStatus;
                    output?: string;
                    error?: string;
                };

                setStatus(data.status);

                if (data.status === "done") {
                    setResult(data.output ?? null);
                    stopPolling();
                } else if (data.status === "failed") {
                    setError(
                        data.error ??
                            "AI gagal memproses permintaan. Silakan coba lagi.",
                    );
                    stopPolling();
                }
            } catch (err) {
                // Network error — don't stop polling, just record error
                console.error("[useAiJob] Poll error:", err);
                setError("Koneksi bermasalah. Memeriksa ulang...");
            }
        };

        // Run immediately, then every 2 seconds
        void poll();
        intervalRef.current = setInterval(() => void poll(), 2000);

        return () => stopPolling();
    }, [jobId, stopPolling]);

    return { status, result, error, isPolling };
}

export default useAiJob;

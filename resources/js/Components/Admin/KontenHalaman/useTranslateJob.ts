import { useState, useCallback, useRef } from 'react';

export type AiPollStatus = 'idle' | 'pending' | 'processing' | 'done' | 'failed';

export function useTranslateJob() {
    const [status, setStatus] = useState<AiPollStatus>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startPolling = useCallback((jobId: number, onDone: () => void) => {
        setStatus('pending');
        setErrorMsg(null);
        stopPolling();

        const poll = async () => {
            try {
                const res = await fetch(`/admin/ai/jobs/${jobId}/status`, {
                    headers: { Accept: 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json() as {
                    status: string;
                    output?: string;
                    error_message?: string;
                };

                if (data.status === 'processing') {
                    setStatus('processing');
                } else if (data.status === 'done') {
                    stopPolling();
                    setStatus('done');
                    onDone();
                } else if (data.status === 'failed') {
                    stopPolling();
                    setStatus('failed');
                    setErrorMsg(data.error_message ?? 'Terjemahan gagal.');
                }
            } catch {
                // keep polling
            }
        };

        void poll();
        intervalRef.current = setInterval(() => void poll(), 2000);
    }, [stopPolling]);

    const reset = useCallback(() => {
        stopPolling();
        setStatus('idle');
        setErrorMsg(null);
    }, [stopPolling]);

    return { status, errorMsg, startPolling, reset };
}

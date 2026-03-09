<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class HealthController extends Controller
{
    /**
     * Endpoint untuk monitoring production.
     * Mengembalikan status kesehatan berbagai komponen aplikasi.
     */
    public function check(): JsonResponse
    {
        $checks = [];
        $status = 'ok';

        // 1. Database Check
        $dbStatus = 'ok';
        $dbTime = 0;
        try {
            $start = microtime(true);
            DB::select('SELECT 1');
            $dbTime = round((microtime(true) - $start) * 1000);
        } catch (\Exception $e) {
            $dbStatus = 'down';
            $status = 'degraded';
        }
        $checks['database'] = ['status' => $dbStatus, 'response_ms' => $dbTime];

        // 2. Redis Check
        $redisStatus = 'ok';
        $redisTime = 0;
        try {
            $start = microtime(true);
            Redis::ping();
            $redisTime = round((microtime(true) - $start) * 1000);
        } catch (\Exception $e) {
            $redisStatus = 'down';
            $status = 'degraded';
        }
        $checks['redis'] = ['status' => $redisStatus, 'response_ms' => $redisTime];

        // 3. Storage Check
        $storageStatus = 'ok';
        $isWritable = is_writable(storage_path('app'));
        if (!$isWritable) {
            $storageStatus = 'down';
            $status = 'degraded';
        }
        $checks['storage'] = ['status' => $storageStatus, 'writable' => $isWritable];

        // 4. Queue Check
        $queueStatus = 'ok';
        $pendingJobs = 0;
        try {
            $pendingJobs = DB::table('jobs')->count();
        } catch (\Exception $e) {
            $queueStatus = 'down';
            $status = 'degraded';
        }
        $checks['queue'] = ['status' => $queueStatus, 'pending_jobs' => $pendingJobs];

        // Jika semua layanan down, tandai sebagai down total
        if ($dbStatus === 'down' && $redisStatus === 'down' && $storageStatus === 'down' && $queueStatus === 'down') {
            $status = 'down';
        }

        // Response code: 200 untuk ok/degraded, 503 untuk down
        $statusCode = $status === 'down' ? 503 : 200;

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks
        ], $statusCode);
    }
}

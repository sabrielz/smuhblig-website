<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class AktivitasController extends Controller
{
    /**
     * Tampilkan riwayat log aktivitas (Admin only).
     */
    public function index(Request $request): Response
    {
        $query = Activity::query()
            ->with(['causer'])
            ->latest();

        // Filter pengguna (causer_id)
        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->input('user_id'));
        }

        // Filter log_name / modul (mis. auth, default, dll.)
        if ($request->filled('log_name')) {
            $query->where('log_name', $request->input('log_name'));
        }

        // Filter tipe event / aksi (created, updated, deleted, dll.)
        if ($request->filled('event')) {
            $query->where('event', $request->input('event'));
        }

        // Filter rentang tanggal
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        $activities = $query->paginate(25)->withQueryString();

        $formattedActivities = $activities->through(function (Activity $act) {
            $causer = $act->causer;
            $subjectType = $act->subject_type ? class_basename($act->subject_type) : null;

            return [
                'id' => $act->id,
                'log_name' => $act->log_name,
                'description' => $act->description,
                'event' => $act->event,
                'subject_type' => $subjectType,
                'subject_id' => $act->subject_id,
                'causer' => $causer ? [
                    'id' => $causer->getKey(),
                    'name' => $causer->getAttribute('name'),
                    'email' => $causer->getAttribute('email'),
                ] : null,
                'properties' => $act->properties,
                'created_at' => $act->created_at?->format('Y-m-d H:i:s'),
                'human_time' => $act->created_at?->diffForHumans(),
            ];
        });

        // Daftar operator untuk filter dropdown
        $users = User::query()->orderBy('name')->get(['id', 'name', 'email']);

        // Daftar unique log_name
        $logNames = Activity::query()
            ->distinct()
            ->pluck('log_name')
            ->filter()
            ->values();

        return Inertia::render('Admin/Aktivitas/Index', [
            'activities' => $formattedActivities,
            'users' => $users,
            'log_names' => $logNames,
            'filters' => [
                'user_id' => $request->input('user_id', ''),
                'log_name' => $request->input('log_name', ''),
                'event' => $request->input('event', ''),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
            ],
        ]);
    }
}

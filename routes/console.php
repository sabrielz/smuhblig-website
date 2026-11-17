<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('smk:cleanup')->weekly()->at('02:00');
Schedule::command('sitemap:generate')->dailyAt('01:00');
Schedule::command('activitylog:clean')->dailyAt('02:30');
Schedule::command('smk:lapor-job-gagal')->hourly();

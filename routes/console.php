<?php

use App\Jobs\SendDailyOrderReport;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily order report to run every evening at 8 PM
Schedule::job(new SendDailyOrderReport)->dailyAt('20:00');

// Test command to manually trigger the daily report
Artisan::command('report:daily', function () {
    $this->info('Dispatching daily order report job...');
    dispatch(new SendDailyOrderReport);
    $this->info('Daily order report job dispatched successfully!');
})->purpose('Manually trigger the daily order report');

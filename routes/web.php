<?php

use Illuminate\Support\Facades\Route;

// Catch-all route: Semua URL bakalan diarahkan ke welcome.blade.php
// Nanti Vue Router yang ambil alih buat nampilin halamannya
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
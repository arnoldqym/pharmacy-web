<?php

namespace App\Http\Controllers\Overview;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OverviewController extends Controller
{
    //
    public function index()
    {
        return response()->json(['message' => 'Overview data goes here']);
    }
}

<?php

namespace App\Http\Controllers\Upload;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    //
    public function uploadCSV(Request $request)
    {
        // Handle CSV upload logic here
        return response()->json(['message' => 'CSV uploaded successfully']);
    }

    public function uploadSingleDrug(Request $request)
    {
        // Handle single drug upload logic here
        return response()->json(['message' => 'Single drug uploaded successfully']);
    }
}

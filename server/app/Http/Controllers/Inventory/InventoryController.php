<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Drug;

class InventoryController extends Controller
{
    public function index()
    {
        // Fetch all drugs, and calculate the sum of 'quantity' from batches
        // that are NOT expired, aliasing it as 'total_stock'.
        // We also eager load the unexpired batches for detailed viewing if needed.
        $inventory = Drug::with([
            'batches' => function ($query) {
                $query->notExpired();
            }
        ])
            ->withSum([
                'batches as total_stock' => function ($query) {
                    $query->notExpired();
                }
            ], 'quantity')
            ->get();

        // Return a standardized JSON response
        return response()->json([
            'success' => true,
            'data' => $inventory
        ]);
    }
}

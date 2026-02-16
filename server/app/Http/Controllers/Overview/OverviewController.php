<?php

namespace App\Http\Controllers\Overview;

use App\Http\Controllers\Controller;
use App\Models\Drug;
use App\Models\Batch; // Assuming you have a Batch model
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OverviewController extends Controller
{
    public function index()
    {
        // 1. Total Drugs (Unique products)
        $totalDrugs = Drug::count();

        // 2. Fetch drugs with their total unexpired stock
        $inventory = Drug::withSum([
            'batches as total_stock' => function ($query) {
                $query->where('expiry_date', '>', Carbon::now());
            }
        ], 'quantity')->get();

        // 3. Low Stock Count
        $lowStockCount = $inventory->filter(function ($drug) {
            return $drug->total_stock <= $drug->min_stock_level;
        })->count();

        // 4. Most and Least Stocked
        $mostStocked = $inventory->sortByDesc('total_stock')->first();
        $leastStocked = $inventory->where('total_stock', '>', 0)->sortBy('total_stock')->first();

        // 5. Nearing Expiry (e.g., within 90 days)
        $nearingExpiry = Batch::where('expiry_date', '>', Carbon::now())
            ->where('expiry_date', '<=', Carbon::now()->addDays(90))
            ->with('drug')
            ->orderBy('expiry_date', 'asc')
            ->get()
            ->map(function ($batch) {
                return [
                    'drug_name' => $batch->drug->brand_name ?? $batch->drug->generic_name,
                    'expiry' => $batch->expiry_date,
                    'days_left' => Carbon::now()->diffInDays($batch->expiry_date),
                ];
            });

        // 6. Last Inventory Update
        $lastUpdate = Batch::latest('updated_at')->first()?->updated_at->diffForHumans() ?? 'Never';

        return response()->json([
            'success' => true,
            'stats' => [
                'total_drugs' => $totalDrugs,
                'low_stock_alerts' => $lowStockCount,
                'most_stocked' => $mostStocked ? ($mostStocked->brand_name ?? $mostStocked->generic_name) . " ({$mostStocked->total_stock})" : 'N/A',
                'least_stocked' => $leastStocked ? ($leastStocked->brand_name ?? $leastStocked->generic_name) . " ({$leastStocked->total_stock})" : 'N/A',
                'last_update' => $lastUpdate,
                'nearing_expiry' => $nearingExpiry,
            ]
        ]);
    }
}

<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Drug;

class InventoryController extends Controller
{
    /**
     * Display a paginated, searchable list of inventory items.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Get query parameters
        $search = $request->query('search');
        $perPage = $request->query('per_page', 15);          // default 15 per page
        $lowStockOnly = $request->boolean('low_stock');     // ?low_stock=1

        // Base query with eager loading and total stock calculation
        $query = Drug::with([
            'batches' => function ($q) {
                $q->notExpired();                       // scope from your Batch model
            }
        ])
            ->withSum([
                'batches as total_stock' => function ($q) {
                    $q->notExpired();
                }
            ], 'quantity');

        // Apply search filter (brand, generic, NDC)
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('brand_name', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%")
                    ->orWhere('ndc', 'like', "%{$search}%");
            });
        }

        // Apply low stock filter (total_stock <= min_stock_level)
        if ($lowStockOnly) {
            $query->havingRaw('total_stock <= min_stock_level');
        }

        // Paginate the results
        $inventory = $query->paginate($perPage);

        // Return structured JSON with pagination metadata
        return response()->json([
            'success' => true,
            'data' => $inventory->items(),
            'pagination' => [
                'current_page' => $inventory->currentPage(),
                'per_page' => $inventory->perPage(),
                'total' => $inventory->total(),
                'last_page' => $inventory->lastPage(),
            ]
        ]);
    }
}

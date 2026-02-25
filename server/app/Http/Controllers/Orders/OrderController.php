<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Drug;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * List all orders with their items.
     */
    public function index()
    {
        $orders = Order::with('items.drug', 'items.batch')->latest()->get();
        return response()->json($orders);
    }

    /**
     * Process a new order from the pharmacy.
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.drug_id' => 'required|exists:drugs,id',
            'items.*.batch_no' => 'required|exists:batches,batch_no',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        try {
            // 2. Use a transaction to ensure data integrity
            return DB::transaction(function () use ($validated) {

                // 3. Create the Parent Order
                $order = Order::create([
                    'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                    'status' => 'pending',
                    'notes' => $validated['notes'] ?? null,
                    'total_amount' => 0, // Will update this after calculating items
                ]);

                $totalAmount = 0;

                // 4. Create Order Items and update stock
                foreach ($validated['items'] as $item) {
                    $batch = Batch::where('batch_no', $item['batch_no'])->firstOrFail();


                    // Logic check: Is there enough stock?
                    if ($batch->quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for batch: {$batch->batch_no}");
                    }

                    $subtotal = $batch->drug->selling_price * $item['quantity'];
                    $totalAmount += $subtotal;

                    $order->items()->create([
                        'drug_id' => $item['drug_id'],
                        'batch_no' => $item['batch_no'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $batch->drug->selling_price,
                        'subtotal' => $subtotal,
                    ]);

                    // 5. Decrement the batch quantity
                    $batch->decrement('quantity', $item['quantity']);
                }

                // 6. Update the final total
                $order->update(['total_amount' => $totalAmount]);

                return response()->json([
                    'message' => 'Order created successfully!',
                    'order' => $order->load('items')
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Order failed: ' . $e->getMessage()
            ], 422);
        }
    }

    public function fetchSpecificDrug(Request $request): JsonResponse
    {
        // 1. Validate & Sanitize
        $validated = $request->validate([
            'query' => 'required|string|min:2' // Don't search for a single character
        ]);

        $searchTerm = $validated['query'];

        // 2. Search Drugs (Generic or Brand Name)
        // We limit results to 10 to keep the response snappy.
        $drugs = Drug::query()
            ->where('generic_name', 'like', "%{$searchTerm}%")
            ->orWhere('brand_name', 'like', "%{$searchTerm}%")
            ->with([
                'batches' => function ($query) {
                    $query->where('expiry_date', '>', now()); // Optional: only show valid batches
                }
            ])
            ->limit(10)
            ->get();

        // 3. Search specifically by Batch Number
        // If the user types a specific batch code, they want that exact item.
        $batches = Batch::query()
            ->where('batch_no', 'like', "%{$searchTerm}%")
            ->with('drug')
            ->limit(10)
            ->get();

        // 4. Return a structured response
        return response()->json([
            'results' => [
                'drugs' => $drugs,
                'batches' => $batches,
            ],
            'meta' => [
                'search_term' => $searchTerm // Useful for the frontend to verify "freshness"
            ]
        ]);
    }
}

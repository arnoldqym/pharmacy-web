<?php

namespace App\Http\Controllers\Upload;

use App\Http\Controllers\Controller;
use App\Models\Drug;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;
use League\Csv\Statement;

class UploadController extends Controller
{
    /**
     * Handle CSV upload.
     */
    public function uploadCSV(Request $request)
    {
        // 1. Strict File Validation
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240', // 10MB limit
        ]);

        $file = $request->file('csv_file');

        try {
            // 2. Load CSV using League/Csv for robustness
            $csv = Reader::createFromPath($file->getRealPath(), 'r');
            $csv->setHeaderOffset(0); // Set header offset

            // Optional: Skip empty lines
            $csv->skipEmptyRecords();

            // Normalize headers (trim whitespace, lowercase)
            // This prevents issues if user uploads " NDC " instead of "ndc"
            $headers = $csv->getHeader();
            $normalizedHeaders = array_map(function ($h) {
                return strtolower(trim($h));
            }, $headers);

            // We can't rename headers in the reader directly easily,
            // so we will map them during processing below.

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to read CSV file: ' . $e->getMessage()], 400);
        }

        $successCount = 0;
        $failures = [];
        $rowIndex = 1; // Start at 1 for the header

        // 3. Process Records
        // Using getRecords returns an iterator, which is memory efficient
        foreach ($csv->getRecords($normalizedHeaders) as $record) {
            $rowIndex++;

            // Clean data (trim whitespace from values)
            $record = array_map('trim', $record);

            // Validate Row
            $validator = Validator::make($record, $this->getValidationRules());

            if ($validator->fails()) {
                $failures[] = [
                    'row' => $rowIndex,
                    'errors' => $validator->errors()->all(),
                ];
                continue;
            }

            // Process DB Logic
            try {
                $this->processDrugRow($record);
                $successCount++;
            } catch (\Exception $e) {
                Log::error("CSV row {$rowIndex} processing failed: " . $e->getMessage());
                $failures[] = [
                    'row' => $rowIndex,
                    'errors' => ['Database error occurred.'], // Don't expose raw SQL error to user
                ];
            }
        }

        return response()->json([
            'message' => 'CSV processing completed.',
            'success_count' => $successCount,
            'failure_count' => count($failures),
            'failures' => $failures, // Frontend can display these errors
        ]);
    }

    /**
     * Handle Single Drug Upload (Reuses logic!).
     */
    public function uploadSingleDrug(Request $request)
    {
        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $this->processDrugRow($request->all());
            return response()->json(['message' => 'Drug uploaded successfully']);
        } catch (\Exception $e) {
            Log::error("Single Upload Error: " . $e->getMessage());
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    /**
     * Centralized Validation Rules.
     */
    private function getValidationRules(): array
    {
        return [
            // Drug Fields
            'ndc' => 'required|string|max:50',
            'brand_name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'dosage_form' => 'nullable|string|max:100',
            'strength' => 'nullable|string|max:100',
            'package_size' => 'nullable|integer|min:0',
            'uom' => 'nullable|string|max:50',
            'selling_price' => 'nullable|numeric|min:0',
            'rx_status' => 'nullable|string|in:Rx,OTC',
            'schedule' => 'nullable|string|max:50',
            'storage' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:100',
            'min_stock_level' => 'nullable|integer|min:0',

            // Batch Fields
            'batch_no' => 'required|string|max:100',
            'expiry_date' => 'required|date_format:Y-m-d',
            'quantity' => 'required|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
        ];
    }

    /**
     * Core Database Logic (Transaction Safe).
     */
    private function processDrugRow(array $data): void
    {
        DB::transaction(function () use ($data) {
            // 1. Create or Update Drug
            $drug = Drug::updateOrCreate(
                ['ndc' => $data['ndc']], // Unique Identifier
                [
                    'brand_name' => $data['brand_name'],
                    'generic_name' => $data['generic_name'] ?? null,
                    'manufacturer' => $data['manufacturer'] ?? null,
                    'dosage_form' => $data['dosage_form'] ?? null,
                    'strength' => $data['strength'] ?? null,
                    'package_size' => $data['package_size'] ?? null,
                    'uom' => $data['uom'] ?? null,
                    'selling_price' => $data['selling_price'] ?? null,
                    'rx_status' => $data['rx_status'] ?? null,
                    'schedule' => $data['schedule'] ?? null,
                    'storage' => $data['storage'] ?? null,
                    'location' => $data['location'] ?? null,
                    'min_stock_level' => $data['min_stock_level'] ?? null,
                ]
            );

            // 2. Create or Update Batch
            // Note: If the batch exists, this overwrites the quantity.
            // If you want to ADD to the quantity, use explicit logic:
            // $batch = Batch::firstOrNew(...); $batch->quantity += $data['quantity']; $batch->save();
            Batch::updateOrCreate(
                [
                    'drug_id' => $drug->id,
                    'batch_no' => $data['batch_no'],
                ],
                [
                    'expiry_date' => $data['expiry_date'],
                    'quantity' => $data['quantity'],
                    'cost_price' => $data['cost_price'],
                ]
            );
        });
    }
}

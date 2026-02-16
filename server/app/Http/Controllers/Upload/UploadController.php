<?php

namespace App\Http\Controllers\Upload;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\Drug;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;

class UploadController extends Controller
{
    public function uploadCSV(Request $request)
    {
        // [LOG 1] Entry Point - Log the IP and all incoming keys (excluding file content)
        Log::info("CSV Upload Initiated", [
            'ip' => $request->ip(),
            'input_keys' => array_keys($request->all()),
            'file_keys' => array_keys($request->allFiles()) // This helps debug "field required" errors
        ]);

        // 1. Strict File Validation
        $validator = Validator::make($request->all(), [
            'csv_file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        if ($validator->fails()) {
            // [LOG 2] Validation Failure
            Log::warning("CSV Upload Validation Failed", ['errors' => $validator->errors()->all()]);
            return response()->json(['message' => 'The csv file field is required.', 'errors' => $validator->errors()], 422);
        }

        $file = $request->file('csv_file');

        try {
            // [LOG 3] File Loading
            Log::info("Reading CSV file", ['path' => $file->getRealPath(), 'original_name' => $file->getClientOriginalName()]);

            $csv = Reader::createFromPath($file->getRealPath(), 'r');
            $csv->setHeaderOffset(0);
            $csv->skipEmptyRecords();

            $headers = $csv->getHeader();
            // [LOG 4] Inspect Headers
            Log::info("CSV Headers Found", ['headers' => $headers]);

            $normalizedHeaders = array_map(function ($h) {
                return strtolower(trim($h));
            }, $headers);

        } catch (\Exception $e) {
            Log::error("Failed to read CSV", ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to read CSV file: ' . $e->getMessage()], 400);
        }

        $successCount = 0;
        $failures = [];
        $rowIndex = 1;

        // 3. Process Records
        foreach ($csv->getRecords($normalizedHeaders) as $record) {
            $rowIndex++;
            $record = array_map('trim', $record);

            // Convert any common date format to Y-m-d
            if (!empty($record['expiry_date'])) {
                $timestamp = strtotime($record['expiry_date']);
                if ($timestamp) {
                    $record['expiry_date'] = date('Y-m-d', $timestamp);
                }
            }

            $validator = Validator::make($record, $this->getValidationRules());

            if ($validator->fails()) {
                // [LOG 5] Row Validation Failure (Optional: remove if logs get too huge)
                Log::warning("Row {$rowIndex} validation failed", ['errors' => $validator->errors()->all()]);

                $failures[] = [
                    'row' => $rowIndex,
                    'errors' => $validator->errors()->all(),
                ];
                continue;
            }

            try {
                $this->processDrugRow($record);
                $successCount++;
            } catch (\Exception $e) {
                // [LOG 6] Database/Processing Error
                Log::error("Row {$rowIndex} DB Error", [
                    'error' => $e->getMessage(),
                    'data' => $record
                ]);

                $failures[] = [
                    'row' => $rowIndex,
                    'errors' => ['Database error occurred.'],
                ];
            }
        }

        // [LOG 7] Final Summary
        Log::info("CSV Processing Completed", [
            'total_processed' => $rowIndex - 1,
            'success' => $successCount,
            'failures' => count($failures)
        ]);

        return response()->json([
            'message' => 'CSV processing completed.',
            'success_count' => $successCount,
            'failure_count' => count($failures),
            'failures' => $failures,
        ]);
    }

    public function uploadSingleDrug(Request $request)
    {
        Log::info("Single Drug Upload Initiated", $request->except(['image', 'files']));

        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            Log::warning("Single Drug Validation Failed", $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $this->processDrugRow($request->all());
            Log::info("Single Drug Added Successfully", ['ndc' => $request->input('ndc')]);
            return response()->json(['message' => 'Drug uploaded successfully']);
        } catch (\Exception $e) {
            Log::error("Single Upload Server Error", ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    private function getValidationRules(): array
    {
        return [
            'ndc' => 'required|string|max:50',
            'brand_name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'schedule' => 'nullable|string|max:10',
            // ... rest of your rules
            'batch_no' => 'required|string|max:100',
            'expiry_date' => 'required',
            'quantity' => 'required|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
        ];
    }

    private function processDrugRow(array $data): void
    {
        DB::transaction(function () use ($data) {
            try {
                // Carbon::parse is smarter than createFromFormat
                // It will handle Y-m-d, m/d/Y, and d-m-Y automatically
                $formattedExpiry = Carbon::parse($data['expiry_date'])->format('Y-m-d');
            } catch (\Exception $e) {
                Log::error("Date parsing failed for NDC {$data['ndc']}: " . $data['expiry_date']);
                throw new \Exception("Invalid date format: {$data['expiry_date']}. Please use YYYY-MM-DD or MM/DD/YYYY.");
            }

            $drug = Drug::updateOrCreate(
                ['ndc' => $data['ndc']],
                [
                    'brand_name' => $data['brand_name'],
                    'generic_name' => $data['generic_name'] ?? null,
                    'manufacturer' => $data['manufacturer'] ?? 'Unknown', // Added fallback
                    'dosage_form' => $data['dosage_form'] ?? null,
                    'strength' => $data['strength'] ?? 'N/A',
                    'package_size' => $data['package_size'] ?? 0,
                    'uom' => $data['uom'] ?? 'units',
                    'selling_price' => $data['selling_price'] ?? 0,
                    'rx_status' => $data['rx_status'] ?? 'Rx',
                    'schedule' => $data['schedule'] ?? null,
                    'storage' => $data['storage'] ?? null,
                    'min_stock_level' => $data['min_stock_level'] ?? 0,
                    'location' => $data['location'] ?? null,
                ]
            );

            Batch::updateOrCreate(
                [
                    'drug_id' => $drug->id,
                    'batch_no' => $data['batch_no'],
                ],
                [
                    'expiry_date' => $formattedExpiry,
                    'quantity' => $data['quantity'],
                    'cost_price' => $data['cost_price'],
                ]
            );
        });
    }
}

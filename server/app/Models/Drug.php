<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Drug extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'drugs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ndc',
        'brand_name',
        'generic_name',
        'manufacturer',
        'dosage_form',
        'strength',
        'package_size',
        'uom',
        'selling_price',
        'rx_status',
        'schedule',
        'storage',
        'min_stock_level',
        'location',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'package_size' => 'integer',
        'selling_price' => 'decimal:2',
        'min_stock_level' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the batches for this drug.
     */
    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class);
    }

    /**
     * Scope a query to only include drugs that are prescription-only.
     */
    public function scopeRx($query)
    {
        return $query->where('rx_status', 'Rx');
    }

    /**
     * Scope a query to only include OTC drugs.
     */
    public function scopeOtc($query)
    {
        return $query->where('rx_status', 'OTC');
    }
}

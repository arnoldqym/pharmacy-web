<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Batch extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'batches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'drug_id',
        'batch_no',
        'expiry_date',
        'quantity',
        'cost_price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expiry_date' => 'date',
        'quantity' => 'integer',
        'cost_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the drug that owns this batch.
     */
    public function drug(): BelongsTo
    {
        return $this->belongsTo(Drug::class);
    }

    /**
     * Scope a query to only include batches that are expiring before a given date.
     */
    public function scopeExpiringBefore($query, $date)
    {
        return $query->where('expiry_date', '<=', $date);
    }

    /**
     * Scope a query to only include batches that are not expired.
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expiry_date', '>', now());
    }

    /**
     * Check if the batch is expired.
     */
    public function isExpired(): bool
    {
        return $this->expiry_date->isPast();
    }
}

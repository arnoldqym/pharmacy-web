<?php

namespace App\Models;

use App\Models\Catalog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubCatalog extends Model
{
    use HasFactory;
    protected $table = 'sub_categories';
    protected $fillable = [
        'category_id',
        'name',
        'caption'
    ];

    public function Product(){
        return $this->belongsTo('App\Models\Product');
    }
    public function categories()
    {
        return $this->belongsTo(Catalog::class);
    }
}

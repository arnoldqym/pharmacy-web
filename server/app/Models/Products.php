<?php

namespace App\Models;

use App\Models\Catalog;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{

protected $table = 'products';
protected $fillable = [
        'title',
        'description',
        'selling_price',
        'wholesale_price',
        'image_url',
        'stock_quantity',
        'category_id',
        'active',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'created_at',
        'updated_at'
    ];

        public function Product()
    {
        return $this->belongsTo('App\Models\Product');
    }

    public function category()
    {
        return $this->belongsTo(Catalog::class, 'category_id');
    }
}

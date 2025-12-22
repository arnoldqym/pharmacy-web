<?php

namespace App\Models;

use App\Models\Catalog;
use Illuminate\Database\Eloquent\Model;

class SubCatalog extends Model
{
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

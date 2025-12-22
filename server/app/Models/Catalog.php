<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Catalog extends Model
{
    protected $table = 'categories';
    protected $fillable = [
        'name',
        'active',
        'meta_title',
        'meta_description',
        'meta_keywords'

    ];

}

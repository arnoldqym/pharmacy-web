<?php

namespace App\Models;

use App\Models\SubCatalog;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Catalog extends Model
{
    use HasFactory;
    protected $table = 'categories';
    protected $fillable = [
        'name',
        'active',
        'meta_title',
        'meta_description',
        'meta_keywords'

    ];
    public function catPath()
    {
        return url('catalog/' . Str::slug($this->title));
    }

    public function adminCatPath()
    {
        return url('admin/catalog/' . Str::slug($this->title));
    }

    public function subCategories()
    {
        return $this->hasMany(SubCatalog::class, 'category_id');
    }
}

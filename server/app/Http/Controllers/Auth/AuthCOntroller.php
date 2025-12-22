<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthCOntroller extends Controller
{
    //
    public function login(Request $request){
        return response()->json(['message' => 'Login endpoint']);
    }

    public function signup (Request $request){
        return response()->json(['message' => 'Signup endpoint']);
    }

    public function logout (Request $request){
        return response()->json(['message' => 'logout endpoint']);
    }
}

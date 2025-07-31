<?php

use Symfony\Component\Finder\Finder;

arch()->preset()->php()->ignoring(['dd', 'dump']);

arch()->preset()->laravel();
arch()->preset()->relaxed();
arch()->preset()->security()->ignoring(['array_rand', 'parse_str', 'mt_rand', 'uniqid', 'sha1']);

arch('annotations')
    ->expect('App')
    ->toUseStrictEquality()
    ->toHavePropertiesDocumented()
    ->toHaveMethodsDocumented();

arch('controllers should follow REST conventions')
    ->expect('App\Http\Controllers')
    ->not->toHaveMethod(['increment', 'decrement', 'custom'])
    ->ignoring([
        'App\Http\Controllers\Controller',
        'App\Http\Controllers\Auth',
    ]);

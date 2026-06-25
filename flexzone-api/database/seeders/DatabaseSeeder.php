<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Test user ─────────────────────────────────────────────────────────
        User::firstOrCreate(['email' => 'dave@flexzone.ph'], [
            'name'       => 'Dave',
            'password'   => Hash::make('password123'),
            'membership' => 'premium',
            'points'     => 500,
        ]);

        // ── Courts ────────────────────────────────────────────────────────────
        $courts = [
            ['name' => 'Main Basketball Court', 'type' => 'Basketball',    'capacity' => 20,  'price_per_hour' => 300, 'available' => true,  'amenities' => ['LED Lighting','Scoreboard','Bleachers','Air Cooled'], 'image' => '🏀'],
            ['name' => 'Volleyball Court A',    'type' => 'Volleyball',    'capacity' => 12,  'price_per_hour' => 250, 'available' => true,  'amenities' => ['Standard Net','LED Lighting','Scoreboard'],            'image' => '🏐'],
            ['name' => 'Badminton Courts (4)',  'type' => 'Badminton',     'capacity' => 8,   'price_per_hour' => 200, 'available' => false, 'amenities' => ['4 Courts','Feather/Synthetic shuttles','Racket rental'],'image' => '🏸'],
            ['name' => 'Pickleball Court',      'type' => 'Pickleball',    'capacity' => 8,   'price_per_hour' => 200, 'available' => true,  'amenities' => ['2 Courts','Paddle rental','Balls provided'],           'image' => '🎾'],
            ['name' => 'Table Tennis Room',     'type' => 'TableTennis',   'capacity' => 4,   'price_per_hour' => 150, 'available' => true,  'amenities' => ['4 Tables','Paddle rental','AC'],                       'image' => '🏓'],
            ['name' => 'Multi-Purpose Hall',    'type' => 'Multi-purpose', 'capacity' => 200, 'price_per_hour' => 500, 'price_per_day' => 8000, 'available' => true, 'amenities' => ['Full PA System','Stage','AC','Catering Space','Parking','WiFi'], 'image' => '🏟️'],
        ];

        foreach ($courts as $court) {
            Court::firstOrCreate(['name' => $court['name']], array_merge($court, ['active' => true]));
        }

        // ── Products ──────────────────────────────────────────────────────────
        $products = [
            ['name' => 'Whey Protein 2kg',   'category' => 'Supplements', 'price' => 1899, 'image' => '🥛', 'rating' => 4.8, 'reviews' => 92,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Premium whey protein concentrate.'],
            ['name' => 'Pre-Workout Energy', 'category' => 'Supplements', 'price' => 699,  'image' => '⚡', 'rating' => 4.6, 'reviews' => 65,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'High-energy pre-workout formula.'],
            ['name' => 'BCAA Capsules',      'category' => 'Supplements', 'price' => 549,  'image' => '💊', 'rating' => 4.5, 'reviews' => 47,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Branch-chain amino acids for recovery.'],
            ['name' => 'Creatine',           'category' => 'Supplements', 'price' => 799,  'image' => '🧪', 'rating' => 4.7, 'reviews' => 58,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Pure creatine monohydrate.'],
            ['name' => 'FlexZone Tee',       'category' => 'Apparel',     'price' => 450,  'image' => '👕', 'rating' => 4.7, 'reviews' => 34,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Moisture-wicking gym tee.'],
            ['name' => 'Training Shorts',    'category' => 'Apparel',     'price' => 599,  'image' => '🩳', 'rating' => 4.4, 'reviews' => 28,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => '4-way stretch training shorts.'],
            ['name' => 'Gym Gloves',         'category' => 'Equipment',   'price' => 349,  'image' => '🥊', 'rating' => 4.6, 'reviews' => 53,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Half-finger gloves with wrist support.'],
            ['name' => 'Resistance Bands',   'category' => 'Equipment',   'price' => 299,  'image' => '🔗', 'rating' => 4.5, 'reviews' => 39,  'in_stock' => false, 'for_gym' => true,  'for_court' => false, 'description' => 'Set of 5 resistance levels.'],
            ['name' => 'Foam Roller',        'category' => 'Equipment',   'price' => 399,  'image' => '🛢️', 'rating' => 4.3, 'reviews' => 22,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Deep tissue foam roller for recovery.'],
            ['name' => 'Lifting Belt',       'category' => 'Equipment',   'price' => 899,  'image' => '🏋️', 'rating' => 4.8, 'reviews' => 61,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => 'Genuine leather weightlifting belt.'],
            ['name' => 'Sports Drink',       'category' => 'Beverages',   'price' => 60,   'image' => '🥤', 'rating' => 4.2, 'reviews' => 88,  'in_stock' => true,  'for_gym' => true,  'for_court' => true,  'description' => 'Electrolyte sports drink.'],
            ['name' => 'Protein Bar',        'category' => 'Beverages',   'price' => 89,   'image' => '🍫', 'rating' => 4.5, 'reviews' => 72,  'in_stock' => true,  'for_gym' => true,  'for_court' => false, 'description' => '20g protein bar.'],
            ['name' => 'Basketball',         'category' => 'Court Gear',  'price' => 599,  'image' => '🏀', 'rating' => 4.6, 'reviews' => 45,  'in_stock' => true,  'for_gym' => false, 'for_court' => true,  'description' => 'Official size basketball.'],
            ['name' => 'Volleyball',         'category' => 'Court Gear',  'price' => 549,  'image' => '🏐', 'rating' => 4.5, 'reviews' => 38,  'in_stock' => true,  'for_gym' => false, 'for_court' => true,  'description' => 'Official size volleyball.'],
            ['name' => 'Badminton Racket',   'category' => 'Court Gear',  'price' => 899,  'image' => '🏸', 'rating' => 4.7, 'reviews' => 52,  'in_stock' => true,  'for_gym' => false, 'for_court' => true,  'description' => 'Carbon fiber racket.'],
            ['name' => 'Shuttlecocks (6pc)', 'category' => 'Court Gear',  'price' => 299,  'image' => '🪶', 'rating' => 4.4, 'reviews' => 29,  'in_stock' => true,  'for_gym' => false, 'for_court' => true,  'description' => 'Premium feather shuttlecocks.'],
            ['name' => 'Sports Tape',        'category' => 'Accessories', 'price' => 89,   'image' => '🩹', 'rating' => 4.5, 'reviews' => 34,  'in_stock' => true,  'for_gym' => false, 'for_court' => true,  'description' => 'Athletic tape for injuries.'],
            ['name' => 'Water Bottle',       'category' => 'Beverages',   'price' => 199,  'image' => '🍶', 'rating' => 4.4, 'reviews' => 56,  'in_stock' => true,  'for_gym' => false, 'for_court' => true,  'description' => '1L sports bottle.'],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['name' => $product['name']], $product);
        }
    }
}
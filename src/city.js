// src/city.js — Version 5.0 Ultimate 2,900m x 2,900m (8.41 km² — 2.1X v4 Area) Open-World Dhaka & Outskirts
// Features:
// - 16 Connected Districts (12 Core Dhaka Districts + 4 New Town/Outskirt Areas: Mirpur Stadium, Tejgaon Rail/Industrial, Savar-Ashulia Highway, Keraniganj Riverside)
// - Dedicated 3D Walk-In Motorcycle Showroom Building with 10 Illuminated Display Platforms & 3D Price Boards
// - 5 Interactive Shop Categories (Clothing Shop, Convenience Store, Bike Accessory Shop, Vehicle Repair Shop, General Market)
// - 8 Purchasable Properties/Businesses + Chunk-Based World Streaming

import { BIKE_SHOWROOM_CATALOG, Vehicle } from './vehicles.js';

export const BAR_DRINKS_MENU = [
  {
    id: 'drink_vice_sunset',
    name: 'Vice City Sunset Mocktail',
    bnName: 'ভাইস সিটি সানসেট ড্রিংকস',
    price: 1200,
    heal: 100,
    gfBonus: 20,
    vibeBoost: '+100% Health & +20% ♥ GF Mood',
    desc: 'Chilled tropical mango-cranberry drink served at the neon bar counter.'
  },
  {
    id: 'drink_blue_lagoon',
    name: 'Blue Moon Neon Lagoon (For Two)',
    bnName: 'ব্লু মুন নিওন লেগুন (কাপল স্পেশাল)',
    price: 2500,
    heal: 100,
    armor: 50,
    gfBonus: 35,
    vibeBoost: '+100% Health, +50 Armor & +35% ♥ GF Love',
    desc: 'Signature glowing cyan couple drink — a huge hit when visiting the bar with your GF Nadia!'
  },
  {
    id: 'drink_vip_champagne',
    name: 'Royal Gold VIP Lounge Bottle & Platter',
    bnName: 'রয়েল গোল্ড ভিআইপি লাউঞ্জ প্ল্যাটার',
    price: 6500,
    heal: 100,
    armor: 100,
    maxHealthBoost: 25,
    gfBonus: 50,
    vibeBoost: '+100% Health/Armor, +25 Max HP & +50% ♥ GF Love',
    desc: 'Full VIP booth service with sparklers, restoring full health, 100% body armor, and maxing out date vibes!'
  },
  {
    id: 'bar_club_dance',
    name: 'VIP Neon Dance Floor Session (With GF)',
    bnName: 'ভিআইপি নিওন ড্যান্স ফ্লোর ও ডিজে মিউজিক',
    price: 1500,
    heal: 100,
    isDance: true,
    gfBonus: 30,
    vibeBoost: 'Live 3D Club Dance + +30% ♥ GF Love',
    desc: 'Request a synthwave track from the DJ and dance under the Malibu-style neon lights!'
  }
];

export const CITY_LANDMARK_VENUES = [
  {
    id: 'venue_bike_showroom',
    type: 'showroom',
    shortLabel: 'BIKE SHOWROOM',
    icon: '🏍️',
    name: 'Dhaka 3D Motorcycle Showroom',
    bnName: 'ঢাকা ৩ডি বাইক শোরুম (১০টি মোটরসাইকেল)',
    x: -64,
    z: 72,
    doorX: -45,
    doorZ: 72,
    color: '#fbbf24',
    hex: 0xfbbf24,
    desc: 'Walk inside to inspect and buy all 10 3D motorcycles on rotating illuminated pedestals.'
  },
  {
    id: 'venue_shopping_mall',
    type: 'mall',
    shortLabel: 'SHOPPING MALL',
    icon: '🛍️',
    name: 'Bashundhara & Shahbagh Grand Shopping Mall',
    bnName: 'গ্র্যান্ড শপিং মল ও ফ্যাশন হাউস',
    x: 54,
    z: 62,
    doorX: 34,
    doorZ: 62,
    color: '#c084fc',
    hex: 0xc084fc,
    desc: 'Multi-story glass shopping mall with Designer Clothing, GF Gifts & Jewelry, Bike Gear, and Electronics.'
  },
  {
    id: 'venue_vice_bar',
    type: 'bar',
    shortLabel: 'BAR & CLUB',
    icon: '🍸',
    name: 'Blue Moon Vice Bar & Nightclub',
    bnName: 'ব্লু মুন বার, লাউঞ্জ ও নাইটক্লাব',
    x: 54,
    z: 108,
    doorX: 34,
    doorZ: 108,
    color: '#ff2a85',
    hex: 0xff2a85,
    desc: 'Malibu-inspired neon bar & club! Bring your GF Nadia here for drinks, VIP booths, and dancing!'
  },
  {
    id: 'venue_gf_villa',
    type: 'gf_spot',
    shortLabel: 'GF NADIA',
    icon: '💖',
    name: 'GF Nadia’s Lakeview Villa (Date Pickup)',
    bnName: 'গার্লফ্রেন্ড নাদিয়ার বাসা (ডেট ও লং ড্রাইভ)',
    x: -54,
    z: 112,
    doorX: -34,
    doorZ: 112,
    color: '#fb7185',
    hex: 0xfb7185,
    desc: 'Pick up your girlfriend Nadia here to ride together on your bike/car, go to the Bar for drinks, or go shopping!'
  },
  {
    id: 'venue_restaurant',
    type: 'restaurant',
    shortLabel: 'RESTAURANT',
    icon: '🍽️',
    name: 'Sultan’s Dine & Rooftop Kacchi Lounge',
    bnName: 'সুলতান’স ডাইন ও কাচ্চি রেস্তোরাঁ',
    x: -54,
    z: 32,
    doorX: -34,
    doorZ: 32,
    color: '#34d399',
    hex: 0x34d399,
    desc: 'Enjoy royal Kacchi Biryani & Borhani (solo or with your GF) to restore 100% health and boost date mood.'
  },
  {
    id: 'venue_customs_garage',
    type: 'repair',
    shortLabel: 'CUSTOMS GARAGE',
    icon: '🔧',
    name: 'Dhaka Auto Customs & Turbo Workshop',
    bnName: 'ঢাকা অটো কাস্টমস ও রিপেয়ার গ্যারেজ',
    x: 54,
    z: 22,
    doorX: 34,
    doorZ: 22,
    color: '#38bdf8',
    hex: 0x38bdf8,
    desc: 'Instant vehicle repair, mirror chrome finish, gold rims, and Stage-3 turbo tuning.'
  }
];

export const DHAKA_DISTRICTS = [
  {
    id: 'uttara',
    name: 'Uttara Sector 7',
    bnName: 'উত্তরা সেক্টর ৭',
    x: 0,
    z: -960,
    radius: 220,
    color: '#38bdf8',
    desc: 'Wide boulevards, shopping complexes, parks, and Metro North Terminal.'
  },
  {
    id: 'savar_outskirts',
    name: 'Savar-Ashulia Highway Town',
    bnName: 'সাভার-আশুলিয়া উপশহর ও হাইওয়ে',
    x: -960,
    z: -960,
    radius: 240,
    color: '#84cc16',
    desc: 'Scenic highway outskirts, suburban towns, garment parks, and open green vistas.'
  },
  {
    id: 'mirpur',
    name: 'Mirpur & Cricket Stadium Zone',
    bnName: 'মিরপুর ও শেরে বাংলা স্টেডিয়াম',
    x: -680,
    z: -680,
    radius: 220,
    color: '#eab308',
    desc: 'Residential suburbs, busy Mirpur 10 roundabout, and stadium boulevard.'
  },
  {
    id: 'banani',
    name: 'Banani Road 11',
    bnName: 'বনানী রোড ১১',
    x: 0,
    z: -420,
    radius: 190,
    color: '#a855f7',
    desc: 'Commercial buildings, restaurants, boutique shopping, and corporate offices.'
  },
  {
    id: 'gulshan',
    name: 'Gulshan-2 Circle',
    bnName: 'গুলশান-২ চত্বর',
    x: 680,
    z: -420,
    radius: 230,
    color: '#10b981',
    desc: 'Modern glass towers, luxury apartments, diplomatic avenues, and fine dining.'
  },
  {
    id: 'tejgaon',
    name: 'Tejgaon Industrial & Rail Hub',
    bnName: 'তেজগাঁও শিল্প এলাকা ও রেল স্টেশন',
    x: -680,
    z: -190,
    radius: 210,
    color: '#f97316',
    desc: 'Industrial warehouses, truck depots, showrooms, and railway level crossings.'
  },
  {
    id: 'farmgate',
    name: 'Farmgate Overbridge & Bus Hub',
    bnName: 'ফার্মগেট ওভারব্রিজ ও বাস টার্মিনাল',
    x: -380,
    z: -190,
    radius: 195,
    color: '#f59e0b',
    desc: 'Busy intersections, intercity bus counters, pedestrian footbridges, and markets.'
  },
  {
    id: 'hatirjheel',
    name: 'Hatirjheel Lakefront',
    bnName: 'হাতিরঝিল লেক',
    x: 380,
    z: -10,
    radius: 230,
    color: '#06b6d4',
    desc: 'Large lakeside expressway, rainbow arch bridges, water taxi docks, and night LEDs.'
  },
  {
    id: 'dhanmondi',
    name: 'Dhanmondi Lake & Rd 27',
    bnName: 'ধানমন্ডি লেক ও ২৭',
    x: -520,
    z: 110,
    radius: 210,
    color: '#22c55e',
    desc: 'Residential streets, lakeside promenade, schools/colleges, and Kacchi restaurants.'
  },
  {
    id: 'shahbagh',
    name: 'Shahbagh & Moto Showroom Hub',
    bnName: 'শাহবাগ চত্বর ও বাইক শোরুম',
    x: 0,
    z: 75,
    radius: 190,
    color: '#ec4899',
    desc: 'Central square, Dhaka Motorcycle Showroom, clothing & accessory shops, and university avenues.'
  },
  {
    id: 'motijheel',
    name: 'Motijheel Commercial Area',
    bnName: 'মতিঝিল বাণিজ্যিক এলাকা',
    x: 680,
    z: 360,
    radius: 230,
    color: '#3b82f6',
    desc: 'Financial district with bank headquarters, Shapla Square, and National Stadium.'
  },
  {
    id: 'lalbagh',
    name: 'Lalbagh Fort',
    bnName: 'লালবাগ কেল্লা',
    x: -680,
    z: 560,
    radius: 200,
    color: '#d97706',
    desc: 'Historic 17th-century Mughal red sandstone fort complex, domes, and gardens.'
  },
  {
    id: 'old_dhaka',
    name: 'Old Dhaka (Puran Dhaka)',
    bnName: 'পুরান ঢাকা - চকবাজার',
    x: -180,
    z: 560,
    radius: 205,
    color: '#f97316',
    desc: 'Narrow historic streets, traditional architecture, spice markets, and rickshaw traffic.'
  },
  {
    id: 'ahsan_manzil',
    name: 'Ahsan Manzil (Pink Palace)',
    bnName: 'আহসান মঞ্জিল',
    x: 180,
    z: 780,
    radius: 185,
    color: '#f43f5e',
    desc: 'Iconic 19th-century Pink Palace museum along the Buriganga waterfront road.'
  },
  {
    id: 'sadarghat',
    name: 'Sadarghat Launch Terminal',
    bnName: 'সদরঘাট লঞ্চ টার্মিনাল',
    x: -180,
    z: 780,
    radius: 210,
    color: '#0ea5e9',
    desc: 'Bustling Buriganga river port with passenger launches, speed boats, and markets.'
  },
  {
    id: 'keraniganj',
    name: 'Keraniganj Riverside Town',
    bnName: 'কেরানীগঞ্জ রিভারসাইড উপশহর',
    x: 680,
    z: 780,
    radius: 220,
    color: '#14b8a6',
    desc: 'Vibrant riverside markets, boatyards, and southern highway corridor.'
  },
  {
    id: 'purbachal',
    name: 'Purbachal Smart City & 300ft Expressway',
    bnName: 'পূর্বাচল স্মার্ট সিটি ও ৩০০ ফিট এক্সপ্রেসওয়ে',
    x: 1550,
    z: -960,
    radius: 320,
    color: '#06b6d4',
    desc: 'Modern glass high-rises, International Trade Fair Center, 6-lane 300ft expressway, and digital billboards.'
  },
  {
    id: 'bashundhara',
    name: 'Bashundhara R/A & Kuril Flyover Hub',
    bnName: 'বসুন্ধরা আবাসিক এলাকা ও কুড়িল ফ্লাইওভার',
    x: 1250,
    z: -680,
    radius: 280,
    color: '#8b5cf6',
    desc: 'Luxury residential apartments, private universities, modern hospitals, mega shopping mall, and Kuril flyover.'
  },
  {
    id: 'airport_azampur',
    name: 'Hazrat Shahjalal Airport & Northern Highway',
    bnName: 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর',
    x: 0,
    z: -1620,
    radius: 320,
    color: '#38bdf8',
    desc: 'Modern airport terminal concourse, control tower, luxury airport hotels, and multi-lane northern highway.'
  },
  {
    id: 'tongi_gazipur',
    name: 'Tongi-Gazipur Industrial & Highway Town',
    bnName: 'টঙ্গী-গাজীপুর শিল্পাঞ্চল ও মহাসড়ক',
    x: -1550,
    z: -1620,
    radius: 320,
    color: '#f97316',
    desc: 'Northern industrial hub, intercity bus terminal, logistics warehouses, and highway markets.'
  },
  {
    id: 'mawa_padma',
    name: 'Mawa-Padma Bridge Southern Expressway',
    bnName: 'মাওয়া-পদ্মা সেতু এক্সপ্রেসওয়ে',
    x: 0,
    z: 2400,
    radius: 450,
    color: '#10b981',
    desc: 'High-speed 6-lane southern expressway across the Buriganga bridges toward Padma River.'
  },
  {
    id: 'narayanganj_port',
    name: 'Narayanganj River Port & Metro Hub',
    bnName: 'নারায়ণগঞ্জ নদীবন্দর ও শিল্প শহর',
    x: 2400,
    z: 1650,
    radius: 420,
    color: '#06b6d4',
    desc: 'Eastern river port city, textile mills, dockyards, and wide waterfront avenues.'
  },
  {
    id: 'gazipur_chandrima',
    name: 'Gazipur Highway & Northern Resort Zone',
    bnName: 'গাজীপুর হাইওয়ে ও নর্দান রিসোর্ট জোন',
    x: 0,
    z: -3200,
    radius: 450,
    color: '#22c55e',
    desc: 'Long northern superbike highway corridor, forested parks, and resort plazas.'
  },
  {
    id: 'meghna_smart_east',
    name: 'Meghna Eastern Expressway & Cyber Park',
    bnName: 'মেঘনা ইস্টার্ন এক্সপ্রেসওয়ে ও সাইবার পার্ক',
    x: 3200,
    z: -960,
    radius: 450,
    color: '#a855f7',
    desc: 'Ultra-modern eastern high-tech corridor with glass skyscrapers and wide racing boulevards.'
  },
  {
    id: 'padma_south_city',
    name: 'Padma South Bank Mega City',
    bnName: 'পদ্মা দক্ষিণ পাড় মেগা সিটি ও এক্সপ্রেসওয়ে',
    x: 0,
    z: 5400,
    radius: 600,
    color: '#f43f5e',
    desc: 'Massive southern metropolitan expansion across the bridges with beachfront-style palm boulevards.'
  },
  {
    id: 'mymensingh_north_hwy',
    name: 'Mymensingh-Gazipur North Super Corridor',
    bnName: 'ময়মনসিংহ-গাজীপুর নর্দান সুপার হাইওয়ে',
    x: 0,
    z: -5600,
    radius: 600,
    color: '#38bdf8',
    desc: 'Endless northern high-speed superbike highway lined with palm trees, towers, and stunt ramps.'
  },
  {
    id: 'comilla_east_corridor',
    name: 'Eastern Meghna-Comilla Highway Hub',
    bnName: 'ইস্টার্ন মেঘনা-কুমিল্লা মহাসড়ক',
    x: 5600,
    z: 0,
    radius: 600,
    color: '#10b981',
    desc: 'Wide eastern metropolitan highway, commercial towers, and riverside bridges.'
  },
  {
    id: 'manikganj_west_hwy',
    name: 'Manikganj-Aricha Western Highway',
    bnName: 'মানিকগঞ্জ-আরিচা ওয়েস্টার্ন হাইওয়ে',
    x: -5600,
    z: 0,
    radius: 600,
    color: '#eab308',
    desc: 'Scenic western expressway connecting Savar-Ashulia to the western river port.'
  }
];

// 5 Interactive Shop Categories with Purchasable Products
export const SHOP_CATALOGS = {
  clothing: {
    id: 'clothing',
    name: 'Dhaka Fashion & Panjabi House',
    bnName: 'ঢাকা ফ্যাশন ও পাঞ্জাবি হাউস',
    category: 'Shopping Mall & Fashion',
    x: 34,
    z: 62,
    color: '#ec4899',
    items: [
      { id: 'item_tshirt', name: 'Bengal Graphic Cotton T-Shirt', bnName: 'বেঙ্গল গ্রাফিক টি-শার্ট', price: 1800, outfitId: 'street_jacket', desc: 'Breathable cotton street tee (+Style).' },
      { id: 'item_polo', name: 'Tiger Gold Polo Shirt & Chinos', bnName: 'গোল্ডেন পোলো শার্ট ও চিনোস', price: 8500, outfitId: 'casual_polo', desc: 'Unlocks and equips the Tiger Gold Polo outfit.' },
      { id: 'item_panjabi', name: 'Royal Crimson Festival Panjabi', bnName: 'উৎসবের লাল পাঞ্জাবি ও পায়জামা', price: 12000, outfitId: 'panjabi_festive', desc: 'Unlocks and equips the Traditional Panjabi outfit.' },
      { id: 'item_suit', name: 'Gulshan Executive Blazer & Trousers', bnName: 'গুলশান এক্সিকিউটিভ ব্লেজার', price: 25000, outfitId: 'gulshan_exec', desc: 'Unlocks and equips the Executive Blazer suit.' },
      { id: 'item_biker_suit', name: 'Padma Moto Racing Jacket & Sneakers', bnName: 'মোটরসাইকেল রেসিং জ্যাকেট ও স্নিকার্স', price: 32000, outfitId: 'biker_leather', desc: 'Unlocks and equips the Pro Biker Leather outfit.' }
    ]
  },
  convenience: {
    id: 'convenience',
    name: 'Shwapno Super Convenience Store',
    bnName: 'স্বপ্ন সুপার শপ ও কনভিনিয়েন্স স্টোর',
    category: 'Restaurant & Dining',
    x: -34,
    z: 32,
    color: '#10b981',
    items: [
      { id: 'item_cha_snack', name: 'Masala Cha & Singara Pack', bnName: 'মশলা চা ও সিঙ্গারা প্যাক', price: 250, heal: 35, desc: 'Restores +35 Player Health immediately.' },
      { id: 'item_energy_drink', name: 'Tiger Boost Energy Drink', bnName: 'টাইগার এনার্জি ড্রিংক', price: 500, heal: 60, desc: 'Restores +60 Player Health and refreshes stamina.' },
      { id: 'item_biryani_box', name: 'Hot Kacchi Biryani Meal Box', bnName: 'কাচ্চি বিরিয়ানি মিল বক্স', price: 1200, heal: 100, desc: 'Fully restores 100% Player Health.' },
      { id: 'item_first_aid', name: 'Emergency First-Aid Supply Kit', bnName: 'ফার্স্ট এইড মেডিকেল কিট', price: 2500, heal: 100, maxHealthBoost: 25, desc: 'Restores full health and boosts Max Health by +25.' }
    ]
  },
  bike_accessories: {
    id: 'bike_accessories',
    name: 'Dhaka Bike Gear & Helmet Gallery',
    bnName: 'বাইক এক্সেসরিজ ও হেলমেট গ্যালারি',
    category: 'Bike Gear (Inside Mall)',
    x: 34,
    z: 68,
    color: '#f59e0b',
    items: [
      { id: 'acc_helmet', name: 'Carbon Fiber Moto Helmet', bnName: 'কার্বন ফাইবার রেসিং হেলমেট', price: 6500, bikeUpgrade: 'helmet', desc: 'Reduces collision damage on all motorcycles.' },
      { id: 'acc_paint_emerald', name: 'Emerald Racing Bike Livery', bnName: 'এমেরাল্ড রেসিং বাইক কালার', price: 4500, paintHex: 0x10b981, desc: 'Applies metallic emerald paint to your current vehicle/bike.' },
      { id: 'acc_paint_gold', name: 'Golden Tiger Bike Livery', bnName: 'গোল্ডেন টাইগার বাইক কালার', price: 5500, paintHex: 0xfacc15, desc: 'Applies championship gold paint to your current vehicle/bike.' },
      { id: 'acc_mirrors_seat', name: 'CNC Bar-End Mirrors & Gel Touring Seat', bnName: 'বার-এন্ড মিরর ও ট্যুরিং সিট', price: 9500, handlingBoost: 1, desc: 'Upgrades current motorcycle/vehicle handling level (+1).' },
      { id: 'acc_ecu_exhaust', name: 'Titanium Full-System Exhaust & ECU Tune', bnName: 'টাইটানিয়াম এক্সহস্ট ও ইসিইউ টিউন', price: 18000, engineBoost: 1, desc: 'Upgrades current motorcycle/vehicle engine level (+1).' }
    ]
  },
  repair_shop: {
    id: 'repair_shop',
    name: 'Dhaka Auto Repair & Customs Workshop',
    bnName: 'অটো রিপেয়ার ও পেইন্ট ওয়ার্কশপ',
    category: 'Vehicle Repair Shop',
    x: 34,
    z: 22,
    color: '#3b82f6',
    items: [
      { id: 'rep_full', name: 'Complete Chassis & Engine Overhaul', bnName: 'সম্পূর্ণ ইঞ্জিন ও বডি রিপেয়ার', price: 1500, repairFull: true, desc: 'Restores current vehicle condition to 100%.' },
      { id: 'rep_chrome', name: 'Mirror Chrome Show Finish', bnName: 'মিরর ক্রোম পেইন্ট ফিনিশ', price: 12000, finish: 'chrome', desc: 'Applies high-gloss chrome finish to active vehicle.' },
      { id: 'rep_wheels', name: 'Forged Gold Alloy Rims', bnName: 'ফোর্জড গোল্ড অ্যালয় হুইল', price: 8500, rimHex: 0xfbbf24, desc: 'Installs gold alloy rims on your active vehicle.' },
      { id: 'rep_stage3', name: 'Pro Turbo & Suspension Stage Kit', bnName: 'প্রো টার্বো ও সাসপেনশন কিট', price: 24000, engineBoost: 1, handlingBoost: 1, desc: 'Upgrades both Engine and Handling levels on active vehicle.' }
    ]
  },
  general_market: {
    id: 'general_market',
    name: 'New Market General & Electronics Store',
    bnName: 'নিউ মার্কেট জেনারেল ও ইলেকট্রনিক্স স্টোর',
    category: 'General Market',
    x: -180,
    z: 165,
    color: '#a855f7',
    items: [
      { id: 'mkt_spices', name: 'Old Dhaka Royal Spice Box', bnName: 'পুরান ঢাকার শাহী মশলা বক্স', price: 1500, heal: 50, desc: 'Authentic spice collection (+50 Health).' },
      { id: 'mkt_camera', name: 'DSLR Telephoto Lens Kit', bnName: 'ডিএসএলআর ক্যামেরা লেন্স কিট', price: 14000, desc: 'Professional lens kit for Dhaka landmark photography.' },
      { id: 'mkt_scanner', name: 'Police Radio Clearance Voucher', bnName: 'ট্রাফিক ক্লিয়ারেন্স ভাউচার', price: 5000, clearWanted: true, desc: 'Immediately clears any active Police Wanted Level to 0.' },
      { id: 'gift_diamond_ring', name: 'Diamond Necklace & Roses for GF Nadia', bnName: 'গার্লফ্রেন্ডের জন্য ডায়মন্ড নেকলেস ও গোলাপ', price: 15000, gfBonus: 45, desc: 'Surprise your GF Nadia with a luxury gift (+45% ♥ GF Relationship)!' },
      { id: 'gift_perfume_bag', name: 'Parisian Perfume & Designer Handbag', bnName: 'ডিজাইনার হ্যান্ডব্যাগ ও পারফিউম গিফট', price: 8500, gfBonus: 25, desc: 'A romantic shopping mall gift for your GF (+25% ♥ GF Relationship)!' }
    ]
  }
};

export const DHAKA_PROPERTIES = [
  {
    id: 'prop_shahbagh_apt',
    name: 'Shahbagh Central Safehouse & Garage',
    bnName: 'শাহবাগ সেফহাউস ও গ্যারেজ',
    type: 'Safehouse & Garage',
    x: -36,
    z: 48,
    price: 45000,
    incomePerMin: 3500,
    upgradeCost: 25000
  },
  {
    id: 'prop_dhanmondi_kacchi',
    name: 'Dhanmondi Royal Kacchi Restaurant',
    bnName: 'ধানমন্ডি রয়েল কাচ্চি হাউস',
    type: 'Restaurant Business',
    x: -495,
    z: 85,
    price: 75000,
    incomePerMin: 6500,
    upgradeCost: 40000
  },
  {
    id: 'prop_gulshan_tower',
    name: 'Gulshan-2 Luxury Penthouse & Helipad',
    bnName: 'গুলশান-২ লাক্সারি পেন্টহাউস',
    type: 'Luxury Safehouse',
    x: 645,
    z: -390,
    price: 180000,
    incomePerMin: 15000,
    upgradeCost: 85000
  },
  {
    id: 'prop_farmgate_plaza',
    name: 'Farmgate Tech & Coaching Commercial Hub',
    bnName: 'ফার্মগেট কমার্শিয়াল প্লাজা',
    type: 'Commercial Property',
    x: -355,
    z: -165,
    price: 85000,
    incomePerMin: 7200,
    upgradeCost: 45000
  },
  {
    id: 'prop_motijheel_exchange',
    name: 'Motijheel Trade & Logistics Tower',
    bnName: 'মতিঝিল ট্রেড ও লজিস্টিকস টাওয়ার',
    type: 'Corporate Business',
    x: 645,
    z: 335,
    price: 160000,
    incomePerMin: 13500,
    upgradeCost: 75000
  },
  {
    id: 'prop_old_dhaka_spice',
    name: 'Chawkbazar Spice & Biryani Emporium',
    bnName: 'চকবাজার বিরিয়ানি ও মশলা ভান্ডার',
    type: 'Heritage Business',
    x: -155,
    z: 535,
    price: 65000,
    incomePerMin: 5800,
    upgradeCost: 35000
  },
  {
    id: 'prop_uttara_motors',
    name: 'Uttara Auto Dealership & Customs Garage',
    bnName: 'উত্তরা অটো ডিলারশিপ ও গ্যারেজ',
    type: 'Dealership & Garage',
    x: 28,
    z: -935,
    price: 125000,
    incomePerMin: 11000,
    upgradeCost: 60000
  },
  {
    id: 'prop_sadarghat_shipping',
    name: 'Sadarghat River Launch & Boat Charter',
    bnName: 'সদরঘাট লঞ্চ ও শিপিং কোম্পানি',
    type: 'Marine Business',
    x: -155,
    z: 755,
    price: 110000,
    incomePerMin: 9500,
    upgradeCost: 52000
  }
];

export const DHAKA_STORES = [
  { id: 'store_shahbagh_mart', name: 'Shahbagh Cash Counter', bnName: 'শাহবাগ মানি কাউন্টার', x: 25, z: 32, payout: 8500 },
  { id: 'store_banani_bistro', name: 'Banani 11 Gold Vault', bnName: 'বনানী ১১ জুয়েলারি ভল্ট', x: 25, z: -395, payout: 14500 },
  { id: 'store_gulshan_emporium', name: 'Gulshan Galleria Diamond Shop', bnName: 'গুলশান ডায়মন্ড শপ', x: 705, z: -395, payout: 22000 },
  { id: 'store_dhanmondi_bake', name: 'Dhanmondi Rd 27 Exchange', bnName: 'ধানমন্ডি ২৭ এক্সচেঞ্জ', x: -545, z: 135, payout: 11000 },
  { id: 'store_farmgate_elec', name: 'Farmgate Electronics Wholesale', bnName: 'ফার্মগেট ইলেকট্রনিক্স বাজার', x: -405, z: -215, payout: 12500 },
  { id: 'store_motijheel_bullion', name: 'Motijheel Commercial Bullion', bnName: 'মতিঝিল বুলিয়ন এক্সচেঞ্জ', x: 705, z: 385, payout: 25000 },
  { id: 'store_old_dhaka_bazar', name: 'Puran Dhaka Shahi Wholesale', bnName: 'পুরান ঢাকা পাইকারি ভান্ডার', x: -205, z: 585, payout: 13500 },
  { id: 'store_uttara_mall', name: 'Uttara Sector 7 Mega Vault', bnName: 'উত্তরা সেক্টর ৭ মেগা ভল্ট', x: -25, z: -985, payout: 16000 }
];

const _cityGeoCache = {};
function _cGeo(key, fn) {
  if (!_cityGeoCache[key]) _cityGeoCache[key] = fn();
  return _cityGeoCache[key];
}

export class DhakaCity {
  constructor(scene) {
    this.scene = scene;
    // Version 8.0 Colossal Metropolitan Footprint: 10,000m x 10,000m (-5000 to +5000) = 100.00 km² (5.67X Version 7's 17.64 km²!)
    this.worldHalfSize = 8000;
    this.stuntRamps = [];
    this.healthArmorPickups = [];
    this.riverBridgeX = [-5600, -4200, -3200, -2400, -1850, -1550, -1250, -960, -680, -380, -180, 0, 180, 380, 680, 960, 1250, 1550, 1850, 2400, 3200, 4200, 5600];
    this.colliders = [];
    this.destructibles = [];
    this.streetLights = [];
    this.streetLightBulbs = [];
    this.streetLightPoolMats = [];
    this.neonSignMats = [];
    this.shopFrontMats = [];
    this.windowMaterials = [];
    this.bridgeArchMaterials = [];
    this.roadMaterials = [];
    this.waterMaterials = [];
    this.teaStalls = [];
    this.intersections = [];
    this.metroTrain = null;

    // 3D Walk-In Motorcycle Showroom State
    this.showroomCenter = { x: -64, z: 72 };
    this.showroomBikes = []; // { spec, vehicle, x, z, platformMesh }
    this.interactiveShops = Object.values(SHOP_CATALOGS);
    this.landmarkVenues = CITY_LANDMARK_VENUES;
    this.mallInteriorShops = [
      { id: 'clothing', x: 46, z: 53, label: '👔 Men’s Designer Fashion & Suit Boutique (Change Your Outfit)' },
      { id: 'gf_dresses', x: 60, z: 53, label: '👗 GF Nadia Glam Dress Boutique (Change GF Nadia’s Dress)' },
      { id: 'general_market', x: 46, z: 62, label: '💎 Diamond, Watch & GF Gift Gallery' },
      { id: 'bike_accessories', x: 60, z: 62, label: '🏍️ Superbike Gear & Helmet Shop' },
      { id: 'convenience', x: 53, z: 71, label: '🍔 Mall Food Court & Coffee Lounge' }
    ];
    this.barDateTables = [
      { id: 'table_vip_1', x: 49, z: 102, label: '🪑 VIP Booth #1 — Sit & Have Drinks with GF Nadia' },
      { id: 'table_vip_2', x: 49, z: 114, label: '🪑 VIP Booth #2 — Sit & Have Drinks with GF Nadia' },
      { id: 'table_vip_3', x: 58, z: 108, label: '🪑 Center Neon Lounge Table — Sit & Have Drinks with GF Nadia' }
    ];

    this.chunks = new Map();
    this.chunkSize = 360;
    this.activeStreamRadius = 520;
    this._lastStreamX = Infinity;
    this._lastStreamZ = Infinity;
    this._lastActiveChunksCount = 0;
    this._colliderGrid = new Map();
    this._colliderCellSize = 128;
    this._indexedColliderLen = 0;
    this.streetLightPoolMeshes = [];
    this._signalTimer = 10.0;
    this._signalFlip = false;
    this._nightLightSearchTimer = 0;
    this.showroomLight = null;

    this.waterZones = [
      { id: 'buriganga', minX: -4800, maxX: 4800, minZ: 820, maxZ: 1060 },
      { id: 'hatirjheel', minX: 245, maxX: 515, minZ: -175, maxZ: 155 },
      { id: 'dhanmondi_lake', minX: -660, maxX: -455, minZ: -10, maxZ: 230 },
      { id: 'purbachal_canal', minX: 1380, maxX: 1720, minZ: -1180, maxZ: -1040 }
    ];

    this.activeNightPointLights = [];

    // 21 North-South & 18 East-West Connected Multi-Lane Highways spanning the 10,000m x 10,000m (100 km²) Metropolis
    this.nsRoads = [-6800, -5600, -4200, -3200, -2400, -1850, -1550, -1250, -960, -680, -380, -180, 0, 180, 380, 680, 960, 1250, 1550, 1850, 2400, 3200, 4200, 5600, 6800];
    this.ewRoads = [-6800, -5600, -4200, -3200, -2400, -1850, -1620, -1250, -960, -680, -420, -190, 0, 165, 360, 560, 780, 1650, 2400, 3600, 5400, 6800];

    this.properties = DHAKA_PROPERTIES.map((p) => ({
      ...p,
      owned: false,
      level: 1,
      cooldown: 0
    }));

    this.stores = DHAKA_STORES.map((s) => ({
      ...s,
      robbedCooldown: 0
    }));

    if (this.scene) {
      this.buildWorld();
      this.initDynamicNightPointLights();
    }
    this.createViceCityStuntRampsAndPickups();
  }

  getChunkGroup(x, z) {
    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    const key = `${cx}_${cz}`;
    if (!this.chunks.has(key)) {
      const grp = new THREE.Group();
      grp.userData = { centerX: (cx + 0.5) * this.chunkSize, centerZ: (cz + 0.5) * this.chunkSize };
      this.scene.add(grp);
      this.chunks.set(key, grp);
    }
    return this.chunks.get(key);
  }

  updateStreamingChunks(playerX, playerZ) {
    const dxMove = playerX - this._lastStreamX;
    const dzMove = playerZ - this._lastStreamZ;
    if (dxMove * dxMove + dzMove * dzMove < 64) {
      return this._lastActiveChunksCount;
    }
    this._lastStreamX = playerX;
    this._lastStreamZ = playerZ;
    const maxSq = this.activeStreamRadius * this.activeStreamRadius;
    let activeChunks = 0;
    for (const grp of this.chunks.values()) {
      const dx = playerX - grp.userData.centerX;
      const dz = playerZ - grp.userData.centerZ;
      const vis = dx * dx + dz * dz <= maxSq;
      if (grp.visible !== vis) grp.visible = vis;
      if (vis) activeChunks++;
    }
    this._lastActiveChunksCount = activeChunks;
    return activeChunks;
  }

  isPointOnBridgeOrRoad(x, z) {
    for (let i = 0; i < this.nsRoads.length; i++) {
      if (Math.abs(x - this.nsRoads[i]) <= 16.5) return true;
    }
    for (let i = 0; i < this.ewRoads.length; i++) {
      if (Math.abs(z - this.ewRoads[i]) <= 16.5) return true;
    }
    return false;
  }

  isPointInWater(x, z) {
    // Every North-South and East-West road/bridge (including Hatirjheel Rainbow Bridge at x=380 and all river bridges) is elevated above water!
    if (this.isPointOnBridgeOrRoad(x, z)) return false;
    for (const wz of this.waterZones) {
      if (x >= wz.minX && x <= wz.maxX && z >= wz.minZ && z <= wz.maxZ) {
        return true;
      }
    }
    return false;
  }

  initDynamicNightPointLights() {
    for (let i = 0; i < 3; i++) {
      const pl = new THREE.PointLight(0xffd166, 0, 36, 1.8);
      pl.position.set(0, 7.5, 0);
      pl.visible = false;
      this.scene.add(pl);
      this.activeNightPointLights.push(pl);
    }
  }

  createStreetlightPoolTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 6, 128, 128, 120);
    grad.addColorStop(0, 'rgba(253, 224, 71, 0.72)');
    grad.addColorStop(0.45, 'rgba(251, 191, 36, 0.26)');
    grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }

  createSignTexture(bnText, enText, bgColor = '#065f46', borderColor = '#fbbf24', textColor = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 192);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 192);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(6, 6, 500, 180);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 480, 160);

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = 'bold 42px "Hind Siliguri", sans-serif';
    ctx.fillText(bnText, 256, 80);

    ctx.fillStyle = borderColor;
    ctx.fillRect(66, 100, 380, 3);

    ctx.fillStyle = borderColor;
    ctx.font = 'bold 26px "Inter", sans-serif';
    ctx.fillText(enText, 256, 146);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  createBuildingTexturePair(style = 'residential', baseHex = '#cbd5e1') {
    const dayCanvas = document.createElement('canvas');
    dayCanvas.width = 512;
    dayCanvas.height = 512;
    const dCtx = dayCanvas.getContext('2d');

    const nightCanvas = document.createElement('canvas');
    nightCanvas.width = 512;
    nightCanvas.height = 512;
    const nCtx = nightCanvas.getContext('2d');

    dCtx.fillStyle = baseHex;
    dCtx.fillRect(0, 0, 512, 512);
    nCtx.fillStyle = '#000000';
    nCtx.fillRect(0, 0, 512, 512);

    const nightWindowPalette = ['#fde047', '#fef08a', '#bae6fd', '#fdba74', '#38bdf8'];

    if (style === 'glass_tower') {
      const cols = 8;
      const rows = 12;
      const wW = 512 / cols;
      const wH = 512 / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isLitAtNight = ((r * 7 + c * 3) % 3 !== 0) && Math.random() > 0.28;
          const grd = dCtx.createLinearGradient(0, r * wH, 0, (r + 1) * wH);
          grd.addColorStop(0, '#38bdf8');
          grd.addColorStop(0.5, '#0284c7');
          grd.addColorStop(1, '#0f172a');
          dCtx.fillStyle = grd;
          dCtx.fillRect(c * wW + 4, r * wH + 4, wW - 8, wH - 8);

          if (isLitAtNight) {
            nCtx.fillStyle = nightWindowPalette[(r + c) % nightWindowPalette.length];
            nCtx.fillRect(c * wW + 5, r * wH + 5, wW - 10, wH - 10);
          }
        }
        dCtx.fillStyle = '#334155';
        dCtx.fillRect(0, r * wH, 512, 6);
      }
    } else {
      const cols = 4;
      const rows = 8;
      const padX = 18;
      const padY = 14;
      const wW = (512 - padX * (cols + 1)) / cols;
      const wH = (512 - padY * (rows + 1)) / rows;

      for (let r = 0; r < rows; r++) {
        dCtx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        dCtx.fillRect(0, r * (wH + padY), 512, 6);

        for (let c = 0; c < cols; c++) {
          const wx = padX + c * (wW + padX);
          const wy = padY + r * (wH + padY);
          const isLitAtNight = Math.random() > 0.3;

          dCtx.fillStyle = '#1e293b';
          dCtx.fillRect(wx, wy, wW * 0.72, wH * 0.78);

          dCtx.fillStyle = '#334155';
          dCtx.fillRect(wx - 4, wy + wH * 0.72, wW + 6, wH * 0.26);

          if (isLitAtNight) {
            nCtx.fillStyle = nightWindowPalette[(r * 3 + c) % nightWindowPalette.length];
            nCtx.fillRect(wx + 2, wy + 2, wW * 0.72 - 4, wH * 0.74);
          }
        }
      }
    }

    const dayTex = new THREE.CanvasTexture(dayCanvas);
    dayTex.wrapS = THREE.RepeatWrapping;
    dayTex.wrapT = THREE.RepeatWrapping;

    const nightTex = new THREE.CanvasTexture(nightCanvas);
    nightTex.wrapS = THREE.RepeatWrapping;
    nightTex.wrapT = THREE.RepeatWrapping;

    return { dayTex, nightTex };
  }

  createAsphaltTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e242b';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 5500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const v = 24 + Math.floor(Math.random() * 26);
      ctx.fillStyle = `rgb(${v},${v + 3},${v + 7})`;
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.fillStyle = 'rgba(248, 250, 252, 0.75)';
    ctx.fillRect(14, 0, 6, 512);
    ctx.fillRect(492, 0, 6, 512);
    // Double-yellow center lines (||) matching NibYw2Kx-YM reference frames 00:00-00:05
    ctx.fillStyle = 'rgba(250, 204, 21, 0.92)';
    ctx.fillRect(248, 0, 5, 512);
    ctx.fillRect(259, 0, 5, 512);

    ctx.fillStyle = 'rgba(226, 232, 240, 0.65)';
    for (let y = 16; y < 512; y += 64) {
      ctx.fillRect(128, y, 5, 32);
      ctx.fillRect(378, y, 5, 32);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 60);
    return tex;
  }

  createFootpathTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 256, 256);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#b45309' : '#94a3b8';
        ctx.fillRect(c * 32 + 2, r * 32 + 2, 28, 28);
      }
    }

    for (let y = 0; y < 256; y += 32) {
      ctx.fillStyle = (y / 32) % 2 === 0 ? '#facc15' : '#0f172a';
      ctx.fillRect(0, y, 14, 32);
      ctx.fillRect(242, y, 14, 32);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 90);
    return tex;
  }

  createGrassTerrainTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#294626';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = i % 3 === 0 ? '#1e3a1e' : i % 3 === 1 ? '#365931' : '#3f6212';
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(140, 140);
    return tex;
  }

  buildWorld() {
    // 1. Massive 3,800m x 3,800m Ground Terrain (Playable 2,900m x 2,900m = 8.41 km²)
    const groundGeo = new THREE.PlaneGeometry(18000, 18000);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.createGrassTerrainTexture(),
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.createWaterBodies();
    this.createRoadNetwork();
    this.createMotorcycleShowroomBuilding();
    this.createFlyoversRailwayAndStadium();
    this.createIconicLandmarks();
    this.createDistrictBuildingsAndStalls();
    this.createPropertyStoreAndShopMarkers();
    this.createStreetInfrastructure();
    this.freezeStaticChunkMatrices();
  }

  freezeStaticChunkMatrices() {
    for (const grp of this.chunks.values()) {
      grp.updateMatrixWorld(true);
      grp.traverse((obj) => {
        if (obj !== grp) {
          obj.matrixAutoUpdate = false;
        }
      });
    }
  }

  // Dedicated 3D Walk-In Motorcycle Showroom Building at Shahbagh-Tejgaon Link (x: -64, z: 72)
  // Houses all 10 Motorcycle Categories on illuminated display platforms with visible 3D price boards!
  createMotorcycleShowroomBuilding() {
    const srGroup = new THREE.Group();
    const cx = this.showroomCenter.x;
    const cz = this.showroomCenter.z;

    // Polished showroom tile floor (38m wide x 26m deep)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.65
    });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(38, 0.32, 26), floorMat);
    floor.position.set(cx, 0.16, cz);
    floor.receiveShadow = true;
    srGroup.add(floor);

    // Back Wall & Roof Canopy (Open Front & Side Glass so player can freely walk inside around all 10 bikes!)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.5 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(38, 7.5, 0.6), wallMat);
    backWall.position.set(cx, 3.75, cz - 12.7);
    srGroup.add(backWall);
    this.addCollider(cx, cz - 12.7, 38, 0.8, 7.5, 'Showroom Back Wall');

    const roof = new THREE.Mesh(new THREE.BoxGeometry(39, 0.6, 27), wallMat);
    roof.position.set(cx, 7.6, cz);
    srGroup.add(roof);

    // Transparent Glass Side Walls
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      metalness: 0.9
    });
    [-18.8, 18.8].forEach((sx) => {
      const glassWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 7.2, 25), glassMat);
      glassWall.position.set(cx + sx, 3.6, cz);
      srGroup.add(glassWall);
    });

    // Reception & Sales Counter at back center
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 1.2, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3 })
    );
    counter.position.set(cx, 0.75, cz - 10.2);
    srGroup.add(counter);

    // Grand Bilingual Showroom Fascia Banner
    const mainBanner = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 3.8),
      new THREE.MeshBasicMaterial({
        map: this.createSignTexture(
          'ঢাকা মটো শোরুম ও বাইক গ্যালারি',
          'DHAKA MOTORCYCLE SHOWROOM (10 MODELS)',
          '#064e3b',
          '#fde047'
        ),
        side: THREE.DoubleSide
      })
    );
    mainBanner.position.set(cx, 9.6, cz + 13.2);
    srGroup.add(mainBanner);

    // Interior Warm Showroom Light (culled when far from showroom)
    const srLight = new THREE.PointLight(0xfef08a, 1.25, 36, 1.5);
    srLight.position.set(cx, 6.8, cz);
    srGroup.add(srLight);
    this.showroomLight = srLight;

    // 10 Illuminated Circular Display Platforms (2 rows of 5 motorcycles)
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x10b981,
      emissiveIntensity: 0.45,
      roughness: 0.25
    });

    BIKE_SHOWROOM_CATALOG.forEach((bikeInfo, idx) => {
      const row = idx < 5 ? 0 : 1;
      const col = idx % 5;
      const bx = cx - 14 + col * 7.0;
      const bz = cz - 4.5 + row * 8.5;

      // Glowing circular pedestal
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.9, 0.26, 20), platMat);
      pedestal.position.set(bx, 0.38, bz);
      srGroup.add(pedestal);

      // Instantiate actual 3D Motorcycle model on the pedestal
      const bikeVeh = new Vehicle(this.scene, bikeInfo.id, bx, bz, Math.PI * 0.18, false);
      bikeVeh.isShowroomDisplay = true;
      if (bikeVeh.mesh) {
        bikeVeh.mesh.position.set(bx, 0.52, bz);
      }

      // Floating 3D Price & Spec Placard beside each displayed motorcycle!
      const priceSign = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 1.15),
        new THREE.MeshBasicMaterial({
          map: this.createSignTexture(
            `${bikeInfo.name}`,
            `PRICE: ৳${bikeInfo.price.toLocaleString()} [PRESS E]`,
            '#0f172a',
            '#34d399'
          ),
          side: THREE.DoubleSide
        })
      );
      priceSign.position.set(bx, 2.35, bz + 1.15);
      srGroup.add(priceSign);

      this.showroomBikes.push({
        catalog: bikeInfo,
        vehicle: bikeVeh,
        x: bx,
        z: bz
      });
    });

    this.scene.add(srGroup);
  }

  getNearestShowroomBike(x, z, maxDist = 3.6) {
    let best = null;
    let bestD = maxDist;
    for (const item of this.showroomBikes) {
      const d = Math.hypot(x - item.x, z - item.z);
      if (d < bestD) {
        bestD = d;
        best = item;
      }
    }
    return best;
  }

  getNearestInteractiveShop(x, z, maxDist = 6.2) {
    let best = null;
    let bestD = maxDist;
    for (const sh of this.interactiveShops) {
      const d = Math.hypot(x - sh.x, z - sh.z);
      if (d < bestD) {
        bestD = d;
        best = sh;
      }
    }
    return best;
  }

  createWaterBodies() {
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.78
    });
    this.waterMaterials.push(waterMat);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const walkwayMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 });

    const buriganga = new THREE.Mesh(new THREE.PlaneGeometry(16000, 240), waterMat);
    buriganga.rotation.x = -Math.PI / 2;
    buriganga.position.set(0, 0.06, 940);
    this.scene.add(buriganga);

    const ghat = new THREE.Mesh(new THREE.BoxGeometry(1800, 0.25, 18), wallMat);
    ghat.position.set(0, 0.14, 812);
    ghat.receiveShadow = true;
    this.scene.add(ghat);

    // 5 Driveable 3D Buriganga-Padma Mega Bridges connecting Central Dhaka to the Southern Expressway!
    const bridgeDeckMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const bridgeArchMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.65,
      roughness: 0.3
    });
    this.bridgeArchMaterials.push(bridgeArchMat);

    this.riverBridgeX.forEach((bx) => {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(28, 0.6, 260), bridgeDeckMat);
      deck.position.set(bx, 0.32, 940);
      this.scene.add(deck);

      [-13.5, 13.5].forEach((side) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 260), bridgeArchMat);
        rail.position.set(bx + side, 1.2, 940);
        this.scene.add(rail);
      });
    });

    const hatirjheel = new THREE.Mesh(new THREE.PlaneGeometry(270, 330), waterMat);
    hatirjheel.rotation.x = -Math.PI / 2;
    hatirjheel.position.set(380, 0.08, -10);
    this.scene.add(hatirjheel);

    [-137, 137].forEach((offsetX) => {
      const bank = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.55, 336), walkwayMat);
      bank.position.set(380 + offsetX, 0.28, -10);
      this.scene.add(bank);
    });

    const dhanmondiLake = new THREE.Mesh(new THREE.PlaneGeometry(205, 240), waterMat);
    dhanmondiLake.rotation.x = -Math.PI / 2;
    dhanmondiLake.position.set(-558, 0.08, 110);
    this.scene.add(dhanmondiLake);
  }

  createRoadNetwork() {
    const asphaltTexNS = this.createAsphaltTexture();
    const roadMatNS = new THREE.MeshStandardMaterial({
      map: asphaltTexNS,
      roughness: 0.72,
      metalness: 0.18
    });
    this.roadMaterials.push(roadMatNS);

    const asphaltTexEW = this.createAsphaltTexture();
    asphaltTexEW.rotation = Math.PI / 2;
    asphaltTexEW.center.set(0.5, 0.5);
    const roadMatEW = new THREE.MeshStandardMaterial({
      map: asphaltTexEW,
      roughness: 0.72,
      metalness: 0.18
    });
    this.roadMaterials.push(roadMatEW);

    const footpathTexNS = this.createFootpathTexture();
    const sidewalkMatNS = new THREE.MeshStandardMaterial({
      map: footpathTexNS,
      roughness: 0.82
    });

    const footpathTexEW = this.createFootpathTexture();
    footpathTexEW.rotation = Math.PI / 2;
    footpathTexEW.center.set(0.5, 0.5);
    const sidewalkMatEW = new THREE.MeshStandardMaterial({
      map: footpathTexEW,
      roughness: 0.82
    });

    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });

    this.nsRoads.forEach((rx) => {
      const roadW = rx === 0 || Math.abs(rx) === 680 ? 22 : 18;
      const len = 15000;

      const sw = new THREE.Mesh(new THREE.BoxGeometry(roadW + 6.4, 0.26, len), sidewalkMatNS);
      sw.position.set(rx, 0.13, 0);
      sw.receiveShadow = true;
      this.scene.add(sw);

      const road = new THREE.Mesh(new THREE.PlaneGeometry(roadW, len), roadMatNS);
      road.rotation.x = -Math.PI / 2;
      road.position.set(rx, 0.27, 0);
      road.receiveShadow = true;
      this.scene.add(road);

      const divider = new THREE.Mesh(new THREE.PlaneGeometry(0.45, len), yellowLineMat);
      divider.rotation.x = -Math.PI / 2;
      divider.position.set(rx, 0.29, 0);
      this.scene.add(divider);
    });

    this.ewRoads.forEach((rz) => {
      const roadW = rz === 0 || rz === 360 || rz === -420 ? 22 : 18;
      const len = 15000;

      const sw = new THREE.Mesh(new THREE.BoxGeometry(len, 0.25, roadW + 6.4), sidewalkMatEW);
      sw.position.set(0, 0.12, rz);
      sw.receiveShadow = true;
      this.scene.add(sw);

      const road = new THREE.Mesh(new THREE.PlaneGeometry(len, roadW), roadMatEW);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.28, rz);
      road.receiveShadow = true;
      this.scene.add(road);

      const divider = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.45), yellowLineMat);
      divider.rotation.x = -Math.PI / 2;
      divider.position.set(0, 0.3, rz);
      this.scene.add(divider);
    });

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 });
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5 });

    const stripeGeo = _cGeo('cw_stripe', () => new THREE.PlaneGeometry(1.4, 3.4));
    const poleGeo = _cGeo('sig_pole', () => new THREE.CylinderGeometry(0.2, 0.26, 7.2, 6));
    const boxGeo = _cGeo('sig_box', () => new THREE.BoxGeometry(0.85, 2.45, 0.85));
    const bulbGeo = _cGeo('sig_bulb', () => new THREE.SphereGeometry(0.25, 6, 6));

    this._evenSignalMats = {
      redMat: new THREE.MeshBasicMaterial({ color: 0x450a0a }),
      amberMat: new THREE.MeshBasicMaterial({ color: 0x451a03 }),
      greenMat: new THREE.MeshBasicMaterial({ color: 0x22c55e })
    };
    this._oddSignalMats = {
      redMat: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      amberMat: new THREE.MeshBasicMaterial({ color: 0x451a03 }),
      greenMat: new THREE.MeshBasicMaterial({ color: 0x052e16 })
    };

    this.nsRoads.forEach((rx) => {
      this.ewRoads.forEach((rz) => {
        const isEven = (Math.abs(rx + rz) % 2 === 0);
        const matSet = isEven ? this._evenSignalMats : this._oddSignalMats;

        // Only spawn 3D intersection signal & crosswalk meshes in the primary urban districts
        if (Math.abs(rx) <= 1850 && Math.abs(rz) <= 1850) {
          const chunkGrp = this.getChunkGroup(rx, rz);
          for (let s = -4.5; s <= 4.5; s += 4.5) {
            const stripeN = new THREE.Mesh(stripeGeo, whiteLineMat);
            stripeN.rotation.x = -Math.PI / 2;
            stripeN.position.set(rx + s, 0.31, rz - 12.5);
            chunkGrp.add(stripeN);
          }

          const sigGroup = new THREE.Group();
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.y = 3.6;
          sigGroup.add(pole);

          const box = new THREE.Mesh(boxGeo, housingMat);
          box.position.set(0, 6.4, 0);
          sigGroup.add(box);

          const redBulb = new THREE.Mesh(bulbGeo, matSet.redMat);
          redBulb.position.set(0, 7.15, 0.45);
          const amberBulb = new THREE.Mesh(bulbGeo, matSet.amberMat);
          amberBulb.position.set(0, 6.4, 0.45);
          const greenBulb = new THREE.Mesh(bulbGeo, matSet.greenMat);
          greenBulb.position.set(0, 5.65, 0.45);

          sigGroup.add(redBulb, amberBulb, greenBulb);
          sigGroup.position.set(rx - 11.5, 0, rz - 11.5);
          chunkGrp.add(sigGroup);
        }

        this.intersections.push({
          x: rx,
          z: rz,
          isEven,
          state: isEven ? 'NS_GREEN' : 'EW_GREEN',
          timer: 10,
          redMat: matSet.redMat,
          amberMat: matSet.amberMat,
          greenMat: matSet.greenMat
        });
      });
    });
  }

  createFlyoversRailwayAndStadium() {
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.75 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.65 });
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.4 });

    for (let z = -1100; z <= 450; z += 55) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.25, 11.2, 10), pillarMat);
      pillar.position.set(0, 5.6, z);
      this.getChunkGroup(0, z).add(pillar);
    }

    const viaductDeck = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.1, 1600), deckMat);
    viaductDeck.position.set(0, 12.0, -320);
    this.scene.add(viaductDeck);

    [-3.7, 3.7].forEach((bx) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.3, 1600), barrierMat);
      wall.position.set(bx, 13.1, -320);
      this.scene.add(wall);
    });

    const trainGroup = new THREE.Group();
    const carMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.5, roughness: 0.25 });
    const greenStripeMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      emissive: 0x22c55e,
      emissiveIntensity: 0.45
    });

    for (let c = -1; c <= 1; c++) {
      const car = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.8, 13.5), carMat);
      car.position.set(0, 14.1, c * 14.2);
      trainGroup.add(car);

      const gBand = new THREE.Mesh(new THREE.BoxGeometry(2.76, 0.45, 13.5), greenStripeMat);
      gBand.position.set(0, 14.1, c * 14.2);
      trainGroup.add(gBand);
    }
    this.scene.add(trainGroup);
    this.metroTrain = { group: trainGroup, z: -320, dir: 1, speed: 42 };

    // Hatirjheel Arch Bridges
    const archColors = [0x06b6d4, 0xec4899, 0x10b981];
    [-95, 0, 95].forEach((bz, idx) => {
      const archMat = new THREE.MeshStandardMaterial({
        color: archColors[idx % archColors.length],
        emissive: archColors[idx % archColors.length],
        emissiveIntensity: 0.7,
        roughness: 0.25
      });
      this.bridgeArchMaterials.push(archMat);

      for (let side = -9.5; side <= 9.5; side += 19) {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(28, 0.7, 12, 36, Math.PI), archMat);
        torus.position.set(380 + side, 0.3, bz);
        torus.rotation.y = Math.PI / 2;
        this.scene.add(torus);
      }
    });
  }

  createIconicLandmarks() {
    // 1. AHSAN MANZIL at (180, 780)
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xe15b76, roughness: 0.55 });
    const whiteTrimMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });

    const palaceGroup = new THREE.Group();
    const palaceMain = new THREE.Mesh(new THREE.BoxGeometry(52, 16, 26), pinkMat);
    palaceMain.position.y = 8;
    palaceGroup.add(palaceMain);

    const pinkDome = new THREE.Mesh(
      new THREE.SphereGeometry(8.6, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2),
      whiteTrimMat
    );
    pinkDome.position.y = 16;
    palaceGroup.add(pinkDome);

    palaceGroup.position.set(180, 0, 780);
    this.getChunkGroup(180, 780).add(palaceGroup);
    this.addCollider(180, 780, 52, 26, 18, 'Ahsan Manzil');

    // 2. LALBAGH FORT at (-680, 560)
    const redSandstone = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.78 });
    const domeGold = new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.5, roughness: 0.25 });

    const fortGroup = new THREE.Group();
    const fortMain = new THREE.Mesh(new THREE.BoxGeometry(56, 13.5, 30), redSandstone);
    fortMain.position.y = 6.75;
    fortGroup.add(fortMain);

    [-16, 0, 16].forEach((dx, i) => {
      const r = i === 1 ? 6.8 : 4.6;
      const d = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2), domeGold);
      d.position.set(dx, 13.5, 0);
      fortGroup.add(d);
    });

    fortGroup.position.set(-680, 0, 560);
    this.getChunkGroup(-680, 560).add(fortGroup);
    this.addCollider(-680, 560, 56, 30, 14, 'Lalbagh Fort');

    // 3. SADARGHAT PASSENGER LAUNCHES
    [-280, -160, -40, 80].forEach((lx) => {
      const launchGroup = new THREE.Group();
      const hull = new THREE.Mesh(
        new THREE.BoxGeometry(16, 4.2, 52),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 })
      );
      hull.position.y = 2.1;
      launchGroup.add(hull);

      const deck1 = new THREE.Mesh(
        new THREE.BoxGeometry(14.5, 3.8, 44),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
      );
      deck1.position.y = 6.0;
      launchGroup.add(deck1);

      launchGroup.position.set(lx, 0, 855);
      this.getChunkGroup(lx, 855).add(launchGroup);
    });
  }

  buildDetailedBuilding(ox, oz, w, d, h, style, mat, accentMat, roofTankMat, signMat, neonFrameMat, shopWindowMat) {
    const bGroup = new THREE.Group();

    const mainBody = new THREE.Mesh(_cGeo(`b_${w}_${h}_${d}`, () => new THREE.BoxGeometry(w, h, d)), mat);
    mainBody.position.y = h / 2;
    bGroup.add(mainBody);

    const roofRim = new THREE.Mesh(_cGeo(`r_${w}_${d}`, () => new THREE.BoxGeometry(w + 0.5, 1.0, d + 0.5)), accentMat);
    roofRim.position.y = h + 0.4;
    bGroup.add(roofRim);

    if (style !== 'glass_tower') {
      const waterTank = new THREE.Mesh(_cGeo('wtank', () => new THREE.CylinderGeometry(1.25, 1.25, 2.6, 8)), roofTankMat);
      waterTank.position.set(-w * 0.22, h + 1.8, -d * 0.18);
      bGroup.add(waterTank);
    }

    if (shopWindowMat) {
      const shopGlass = new THREE.Mesh(_cGeo(`sg_${w}`, () => new THREE.PlaneGeometry(w * 0.72, 3.1)), shopWindowMat);
      shopGlass.position.set(0, 2.0, d / 2 + 0.08);
      bGroup.add(shopGlass);
    }

    if (signMat) {
      const signY = Math.min(h * 0.45, 12.5);
      const signZ = d / 2 + 1.28;
      const signBoard = new THREE.Mesh(_cGeo('sign_11_38', () => new THREE.PlaneGeometry(11.5, 3.8)), signMat);
      signBoard.position.set(0, signY, signZ);
      bGroup.add(signBoard);

      if (neonFrameMat) {
        const neonBack = new THREE.Mesh(_cGeo('neon_12_43', () => new THREE.BoxGeometry(12.1, 4.3, 0.22)), neonFrameMat);
        neonBack.position.set(0, signY, signZ - 0.14);
        bGroup.add(neonBack);
      }
    }

    bGroup.position.set(ox, 0, oz);
    this.getChunkGroup(ox, oz).add(bGroup);
  }

  createDistrictBuildingsAndStalls() {
    const resColors = ['#e2e8f0', '#fed7aa', '#bbf7d0', '#ddd6fe', '#fef08a'];
    const glassColors = ['#38bdf8', '#60a5fa', '#2dd4bf', '#818cf8'];

    const resMats = resColors.map((hex) => {
      const { dayTex, nightTex } = this.createBuildingTexturePair('residential', hex);
      const mat = new THREE.MeshStandardMaterial({
        map: dayTex,
        emissive: 0xffffff,
        emissiveMap: nightTex,
        emissiveIntensity: 0.04,
        roughness: 0.6,
        metalness: 0.18
      });
      this.windowMaterials.push(mat);
      return mat;
    });

    const glassMats = glassColors.map((hex) => {
      const { dayTex, nightTex } = this.createBuildingTexturePair('glass_tower', hex);
      const mat = new THREE.MeshStandardMaterial({
        map: dayTex,
        emissive: 0xffffff,
        emissiveMap: nightTex,
        emissiveIntensity: 0.06,
        roughness: 0.16,
        metalness: 0.78
      });
      this.windowMaterials.push(mat);
      return mat;
    });

    const accentMats = [
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 })
    ];
    const roofTankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });

    const neonColors = [0x10b981, 0xf59e0b, 0x06b6d4, 0xec4899, 0xef4444];
    const neonMats = neonColors.map((c) => {
      const m = new THREE.MeshStandardMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 0.25,
        roughness: 0.2
      });
      this.neonSignMats.push(m);
      return m;
    });

    const shopWindowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 0.15,
      roughness: 0.2
    });
    this.shopFrontMats.push(shopWindowMat);

    const signDefinitions = [
      { bn: 'কাচ্চি ভাই রেস্তোরাঁ', en: 'KACCHI BHAI DHANMONDI', bg: '#7f1d1d', border: '#fbbf24' },
      { bn: 'সুলতান’স ডাইন', en: 'SULTANS DINE GULSHAN', bg: '#14532d', border: '#fde047' },
      { bn: 'বসুন্ধরা সিটি শপিং মল', en: 'MEGA SHOPPING MALL', bg: '#1e3a8a', border: '#38bdf8' },
      { bn: 'হাজী বিরিয়ানি - পুরান ঢাকা', en: 'HAJI BIRYANI OLD DHAKA', bg: '#7c2d12', border: '#facc15' },
      { bn: 'বিক্রমপুর মিষ্টান্ন ভান্ডার', en: 'BIKRAMPUR SWEETS & BAKERY', bg: '#78350f', border: '#fde047' },
      { bn: 'শাহবাগ ফুলের মার্কেট', en: 'SHAHBAGH FLOWER MARKET', bg: '#831843', border: '#f472b6' },
      { bn: 'মতিঝিল ব্যাংক টাওয়ার', en: 'MOTIJHEEL BANK TOWER', bg: '#0f172a', border: '#60a5fa' },
      { bn: 'লাজ ফার্মা ও সুপার শপ', en: 'LAZZ PHARMA & SUPER SHOP', bg: '#064e3b', border: '#34d399' },
      { bn: 'স্কয়ার মেট্রোপলিটন হাসপাতাল', en: 'DHAKA METROPOLITAN HOSPITAL 24/7', bg: '#0f172a', border: '#38bdf8' },
      { bn: 'ঢাকা বিশ্ববিদ্যালয় ও কার্জন হল', en: 'DHAKA UNIVERSITY CAMPUS', bg: '#7f1d1d', border: '#fde047' },
      { bn: 'যমুনা ফিউচার পার্ক ও মেগা মল', en: 'BASHUNDHARA MEGA MALL & CINEMA', bg: '#311042', border: '#e879f9' },
      { bn: 'প্যান প্যাসিফিক সোনারগাঁও হোটেল', en: '5-STAR GRAND HOTEL DHAKA', bg: '#1e293b', border: '#fbbf24' },
      { bn: 'পূর্বাচল স্মার্ট সিটি টাওয়ার', en: 'PURBACHAL SMART FINANCIAL HUB', bg: '#042f2e', border: '#2dd4bf' }
    ];
    const signMats = signDefinitions.map((s) =>
      new THREE.MeshBasicMaterial({
        map: this.createSignTexture(s.bn, s.en, s.bg, s.border),
        side: THREE.DoubleSide
      })
    );

    const blockCentersX = [-3600, -2800, -2100, -1700, -1400, -1100, -820, -530, -280, -90, 90, 280, 530, 820, 1100, 1400, 1700, 2100, 2800, 3600];
    const blockCentersZ = [-3600, -2800, -2100, -1740, -1430, -1100, -820, -550, -300, -95, 82, 260, 460, 670, 1350, 2000, 2800, 3500];

    let signIdx = 0;
    blockCentersX.forEach((bx) => {
      blockCentersZ.forEach((bz) => {
        for (let i = 0; i < 2; i++) {
          const ox = bx + (i === 0 ? -42 : 42);
          const oz = bz + (i === 0 ? -36 : 36);

          if (this.isPointInWater(ox, oz)) continue;
          // Keep Motorcycle Showroom area clear at (-64, 72)
          if (Math.abs(ox) < 105 && oz > -10 && oz < 145) continue;
          if (Math.hypot(ox - 180, oz - 780) < 65) continue;
          if (Math.hypot(ox - -680, oz - 560) < 65) continue;

          const isGlassZone = ox > 180 && (oz < -250 || (oz > 180 && oz < 460));
          const style = isGlassZone ? 'glass_tower' : 'residential';

          const w = 24 + ((Math.abs(ox * oz + i) % 12));
          const d = 24 + ((Math.abs(ox + oz * i) % 12));
          const h = isGlassZone
            ? 44 + ((Math.abs(ox * 3 + oz) % 42))
            : 18 + ((Math.abs(ox + oz * 5) % 26));

          const pool = isGlassZone ? glassMats : resMats;
          const mat = pool[(Math.abs(ox + oz + i)) % pool.length];
          const accent = accentMats[(Math.abs(ox + i)) % accentMats.length];
          const hasSign = (Math.abs(ox + oz) + i) % 2 === 0;
          const signMat = hasSign ? signMats[signIdx % signMats.length] : null;
          const neonMat = hasSign ? neonMats[signIdx % neonMats.length] : null;
          if (hasSign) signIdx++;

          this.buildDetailedBuilding(
            ox,
            oz,
            w,
            d,
            h,
            style,
            mat,
            accent,
            roofTankMat,
            signMat,
            neonMat,
            shopWindowMat
          );
          this.addCollider(ox, oz, w, d, h, 'Building');
        }
      });
    });

    const stallCoords = [
      { x: -355, z: -172, name: 'Farmgate Tong Cha Stall' },
      { x: -495, z: 95, name: 'Dhanmondi Kacchi & Cha Corner' },
      { x: 18, z: 58, name: 'Shahbagh Mama Cha Stall' },
      { x: 660, z: -400, name: 'Gulshan-2 Street Cafe' },
      { x: -165, z: 545, name: 'Puran Dhaka Bakarkhani & Cha' },
      { x: -165, z: 765, name: 'Sadarghat Riverfront Tea Stall' },
      { x: 18, z: -940, name: 'Uttara Sector 7 Tea Corner' }
    ];

    stallCoords.forEach((st) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 2.8, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.75 })
      );
      body.position.y = 1.4;
      group.add(body);

      const awning = new THREE.Mesh(
        new THREE.BoxGeometry(5.4, 0.32, 4.6),
        new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 })
      );
      awning.position.y = 2.98;
      group.add(awning);

      group.position.set(st.x, 0, st.z);
      this.getChunkGroup(st.x, st.z).add(group);
      this.teaStalls.push({ x: st.x, z: st.z, name: st.name });
    });
  }

  getNearestLandmarkVenue(x, z, maxDist = 8.5) {
    let best = null;
    let bestD = maxDist;
    for (const v of this.landmarkVenues) {
      const dDoor = Math.hypot(x - v.doorX, z - v.doorZ);
      const dCenter = Math.hypot(x - v.x, z - v.z);
      const d = Math.min(dDoor, dCenter * 0.75);
      if (d < bestD) {
        bestD = d;
        best = v;
      }
    }
    return best;
  }

  getNearestMallInteriorShop(x, z, maxDist = 4.2) {
    let best = null;
    let bestD = maxDist;
    for (const st of this.mallInteriorShops) {
      const d = Math.hypot(x - st.x, z - st.z);
      if (d < bestD) {
        bestD = d;
        best = st;
      }
    }
    return best;
  }

  getNearestBarDateTable(x, z, maxDist = 4.5) {
    let best = null;
    let bestD = maxDist;
    for (const tb of this.barDateTables) {
      const d = Math.hypot(x - tb.x, z - tb.z);
      if (d < bestD) {
        bestD = d;
        best = tb;
      }
    }
    return best;
  }

  createGrandHeroVenues() {
    // Build unmistakable Open Walk-In 3D Interiors for Shopping Mall (5 interior shops) and Blue Moon Vice Bar (3 VIP Date Tables & Sofas)!
    this.landmarkVenues.forEach((v) => {
      const grp = new THREE.Group();

      if (v.type === 'mall') {
        // OPEN WALK-IN 3D GRAND SHOPPING MALL ATRIUM at (x: 54, z: 62)
        const floor = new THREE.Mesh(
          new THREE.BoxGeometry(32, 0.32, 28),
          new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.15, metalness: 0.65 })
        );
        floor.position.set(v.x, 0.16, v.z);
        grp.add(floor);

        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(33, 0.7, 29),
          new THREE.MeshStandardMaterial({ color: 0x311042, roughness: 0.3 })
        );
        roof.position.set(v.x, 8.8, v.z);
        grp.add(roof);

        const backWall = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 8.6, 28),
          new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4 })
        );
        backWall.position.set(v.x + 15.6, 4.3, v.z);
        grp.add(backWall);

        // 5 Walk-In Interior Boutique Stalls inside the Shopping Mall!
        this.mallInteriorShops.forEach((ms, idx) => {
          const stallMat = new THREE.MeshStandardMaterial({
            color: idx % 2 === 0 ? 0xa855f7 : 0xec4899,
            emissive: idx % 2 === 0 ? 0x7e22ce : 0xbe185d,
            emissiveIntensity: 0.45,
            roughness: 0.25
          });
          const counter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.15, 2.2), stallMat);
          counter.position.set(ms.x, 0.65, ms.z);
          grp.add(counter);

          const ring = new THREE.Mesh(
            new THREE.RingGeometry(1.6, 2.2, 20),
            new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide })
          );
          ring.rotation.x = -Math.PI / 2;
          ring.position.set(ms.x, 0.35, ms.z);
          grp.add(ring);

          const stSign = new THREE.Mesh(
            new THREE.PlaneGeometry(4.4, 1.3),
            new THREE.MeshBasicMaterial({
              map: this.createSignTexture(ms.label.slice(0, 26), 'WALK UP & PRESS [E] TO SHOP / CHANGE DRESS', '#1e1b4b', '#fde047'),
              side: THREE.DoubleSide
            })
          );
          stSign.position.set(ms.x, 2.75, ms.z);
          stSign.rotation.y = -Math.PI / 2;
          grp.add(stSign);
        });
      } else if (v.type === 'bar') {
        // OPEN WALK-IN 3D BLUE MOON VICE BAR, NIGHTCLUB & VIP DATE LOUNGE at (x: 54, z: 108)
        const floor = new THREE.Mesh(
          new THREE.BoxGeometry(28, 0.32, 24),
          new THREE.MeshStandardMaterial({ color: 0x2e054e, roughness: 0.12, metalness: 0.75 })
        );
        floor.position.set(v.x, 0.16, v.z);
        grp.add(floor);

        // Glowing Neon Dance Floor Grid in center of Bar
        const danceFloor = new THREE.Mesh(
          new THREE.PlaneGeometry(8.5, 8.5),
          new THREE.MeshBasicMaterial({ color: 0xff2a85, side: THREE.DoubleSide })
        );
        danceFloor.rotation.x = -Math.PI / 2;
        danceFloor.position.set(v.x + 1, 0.34, v.z);
        grp.add(danceFloor);

        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(29, 0.7, 25),
          new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.3 })
        );
        roof.position.set(v.x, 7.8, v.z);
        grp.add(roof);

        // Illuminated Bar Counter at back wall
        const barCounter = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 1.25, 12),
          new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0284c7, emissiveIntensity: 0.6 })
        );
        barCounter.position.set(v.x + 10.5, 0.75, v.z);
        grp.add(barCounter);

        // 3 Physical 3D VIP Date Booths (Left & Right Velvet Sofas + Cocktail Table + 2 Drink Glasses!)
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.45 });
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.15 });
        const glassDrinkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

        this.barDateTables.forEach((tb) => {
          const boothGrp = new THREE.Group();
          // Center Cocktail Table
          const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.72, 16), tableMat);
          tbl.position.set(tb.x, 0.45, tb.z);
          boothGrp.add(tbl);

          // 2 Glowing Cocktail Glasses on the Table
          [-0.25, 0.25].forEach((gx) => {
            const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.07, 0.24, 10), glassDrinkMat);
            glass.position.set(tb.x + gx, 0.92, tb.z);
            boothGrp.add(glass);
          });

          // Left & Right VIP Sofas where Player & GF Nadia physically sit down!
          [-1.1, 1.1].forEach((sx) => {
            const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.42, 1.5), sofaMat);
            seat.position.set(tb.x + sx, 0.35, tb.z);
            boothGrp.add(seat);
          });

          // Glowing Floor Ring around VIP Date Table
          const tRing = new THREE.Mesh(
            new THREE.RingGeometry(1.7, 2.25, 20),
            new THREE.MeshBasicMaterial({ color: 0xff2a85, side: THREE.DoubleSide })
          );
          tRing.rotation.x = -Math.PI / 2;
          tRing.position.set(tb.x, 0.35, tb.z);
          boothGrp.add(tRing);

          grp.add(boothGrp);
        });
      } else if (v.id !== 'venue_bike_showroom') {
        const bW = 24;
        const bH = 13;
        const bD = 20;
        const wallColor = v.type === 'gf_spot' ? 0x831843 : v.type === 'restaurant' ? 0x064e3b : 0x0f172a;
        const bodyMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.25, metalness: 0.65 });
        const bldg = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, bD), bodyMat);
        bldg.position.set(v.x, bH / 2, v.z);
        grp.add(bldg);
      }

      // Massive Bilingual Rooftop & Street-Level Signboard facing the avenue so player can read it from afar!
      const signTex = this.createSignTexture(
        `${v.icon} ${v.bnName}`,
        `${v.shortLabel}: ${v.name.toUpperCase()} [PRESS E]`,
        '#090d16',
        v.color
      );
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 4.5),
        new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
      );
      signMesh.position.set(v.doorX, 7.2, v.doorZ);
      signMesh.rotation.y = v.x > 0 ? -Math.PI / 2 : Math.PI / 2;
      grp.add(signMesh);

      // Glowing Walk-In Door Ring + Tall Translucent Sky Beacon Pillar at exact (v.doorX, v.doorZ)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.4, 3.4, 28),
        new THREE.MeshBasicMaterial({ color: v.hex, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(v.doorX, 0.34, v.doorZ);
      grp.add(ring);

      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 32, 16, 1, true),
        new THREE.MeshBasicMaterial({
          color: v.hex,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      beacon.position.set(v.doorX, 16, v.doorZ);
      grp.add(beacon);

      this.scene.add(grp);
    });
  }

  createPropertyStoreAndShopMarkers() {
    this.createGrandHeroVenues();
    // 1. 5 Interactive Retail Shops (Clothing, Convenience, Bike Accessories, Repair, General Market)
    this.interactiveShops.forEach((sh) => {
      const group = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.8, 22), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.34;
      group.add(ring);

      const booth = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 3.4, 3.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      booth.position.set(0, 1.7, -2.2);
      group.add(booth);

      const signBoard = new THREE.Mesh(
        new THREE.PlaneGeometry(5.8, 1.8),
        new THREE.MeshBasicMaterial({
          map: this.createSignTexture(sh.bnName, `${sh.category.toUpperCase()} [PRESS E]`, '#4c1d95', '#fde047'),
          side: THREE.DoubleSide
        })
      );
      signBoard.position.set(0, 4.3, -0.3);
      group.add(signBoard);

      group.position.set(sh.x, 0, sh.z);
      this.scene.add(group);
    });

    // 2. Purchasable Properties
    this.properties.forEach((prop) => {
      const group = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.5, 20), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.33;
      group.add(ring);

      const signBoard = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 1.8),
        new THREE.MeshBasicMaterial({
          map: this.createSignTexture(
            prop.bnName,
            `PROPERTY: ৳${prop.price.toLocaleString()}`,
            '#0f766e',
            '#fde047'
          ),
          side: THREE.DoubleSide
        })
      );
      signBoard.position.y = 3.2;
      group.add(signBoard);

      group.position.set(prop.x, 0, prop.z);
      this.scene.add(group);
      prop.ringMat = ringMat;
    });

    // 3. Commercial Store Registers
    this.stores.forEach((st) => {
      const group = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.5, 2.1, 18), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.33;
      group.add(ring);

      group.position.set(st.x, 0, st.z);
      this.scene.add(group);
      st.ringMat = ringMat;
    });
  }

  createStreetInfrastructure() {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.55, roughness: 0.45 });
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 0.35
    });
    this.streetLightBulbs.push(bulbMat);

    const poolTex = this.createStreetlightPoolTexture();
    const streetPoolMat = new THREE.MeshBasicMaterial({
      map: poolTex,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const streetConeMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.streetLightPoolMats.push({ poolMat: streetPoolMat, coneMat: streetConeMat });

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const krishnachuraMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.75 });

    const lampPoleGeo = _cGeo('lamp_pole', () => new THREE.CylinderGeometry(0.16, 0.24, 8.2, 6));
    const lampBulbGeo = _cGeo('lamp_bulb', () => new THREE.BoxGeometry(0.65, 0.18, 0.35));
    const lampPoolGeo = _cGeo('lamp_pool', () => new THREE.PlaneGeometry(13.5, 13.5));
    const trunkGeo = _cGeo('palm_trunk', () => new THREE.CylinderGeometry(0.2, 0.44, 7.2, 6));
    const frondSpanGeo = _cGeo('palm_frond_span', () => new THREE.BoxGeometry(4.8, 0.14, 0.68));

    for (let z = -1150; z <= 760; z += 135) {
      this.nsRoads.forEach((rx) => {
        if (Math.abs(rx) > 2400) return;
        const px = rx + 11.8;
        const chunk = this.getChunkGroup(px, z);

        const pole = new THREE.Mesh(lampPoleGeo, poleMat);
        pole.position.set(px, 4.1, z);
        chunk.add(pole);

        const lampX = px - 2.3;
        const bulb = new THREE.Mesh(lampBulbGeo, bulbMat);
        bulb.position.set(lampX, 7.9, z);
        chunk.add(bulb);

        const lightPool = new THREE.Mesh(lampPoolGeo, streetPoolMat);
        lightPool.rotation.x = -Math.PI / 2;
        lightPool.position.set(lampX - 1.2, 0.31, z);
        lightPool.visible = false;
        chunk.add(lightPool);
        this.streetLightPoolMeshes.push(lightPool);

        this.streetLights.push({ x: lampX, z, bulb });

        const tx = rx - 12.8;
        const tz = z + 40;
        const treeGroup = new THREE.Group();
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(-0.18, 3.6, 0);
        trunk.rotation.z = 0.09;
        treeGroup.add(trunk);

        for (let f = 0; f < 3; f++) {
          const angle = (f / 3) * Math.PI;
          const frond = new THREE.Mesh(frondSpanGeo, leavesMat);
          frond.position.set(-0.5, 7.05, 0);
          frond.rotation.y = angle;
          frond.rotation.x = 0.18;
          treeGroup.add(frond);
        }

        treeGroup.position.set(tx, 0, tz);
        chunk.add(treeGroup);
      });
    }

    const coneGeo = new THREE.ConeGeometry(0.45, 1.3, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
    for (let i = 0; i < 65; i++) {
      const rx = this.nsRoads[i % this.nsRoads.length] + (i % 2 === 0 ? 8.2 : -8.2);
      const rz = -1100 + i * 28;
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(rx, 0.65, rz);
      this.scene.add(cone);
      this.destructibles.push({
        mesh: cone,
        origX: rx,
        origZ: rz,
        vx: 0,
        vy: 0,
        vz: 0,
        hitCooldown: 0
      });
    }
  }

  addCollider(x, z, w, d, height = 10, label = 'Structure') {
    const col = {
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2,
      height,
      label
    };
    this.colliders.push(col);
    this._indexCollider(col);
    this._indexedColliderLen = this.colliders.length;
  }

  _indexCollider(c) {
    const cs = this._colliderCellSize || 128;
    const minCX = Math.floor(c.minX / cs);
    const maxCX = Math.floor(c.maxX / cs);
    const minCZ = Math.floor(c.minZ / cs);
    const maxCZ = Math.floor(c.maxZ / cs);
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cz = minCZ; cz <= maxCZ; cz++) {
        const key = `${cx}_${cz}`;
        let bucket = this._colliderGrid.get(key);
        if (!bucket) {
          bucket = [];
          this._colliderGrid.set(key, bucket);
        }
        bucket.push(c);
      }
    }
  }

  createViceCityStuntRampsAndPickups() {
    const rampCoords = [
      { x: -10, z: 22, heading: Math.PI, label: 'Shahbagh Boulevard Stunt Jump' },
      { x: 10, z: -120, heading: Math.PI, label: 'Karwan Bazar Flyover Jump' },
      { x: 0, z: 790, heading: 0, label: 'Buriganga Mega Bridge Launch Ramp' },
      { x: 380, z: -45, heading: 0, label: 'Hatirjheel Rainbow Bridge Jump' },
      { x: -500, z: 60, heading: Math.PI, label: 'Dhanmondi Lake Stunt Ramp' },
      { x: 680, z: -380, heading: Math.PI, label: 'Gulshan-2 Tower Jump' },
      { x: 0, z: -380, heading: Math.PI, label: 'Banani 11 Highway Jump' },
      { x: 680, z: 320, heading: 0, label: 'Motijheel Financial Plaza Jump' },
      { x: 0, z: -920, heading: Math.PI, label: 'Uttara Sector 7 Stunt Ramp' },
      { x: 1550, z: -920, heading: Math.PI, label: 'Purbachal 300ft Superbike Ramp' },
      { x: 1250, z: -640, heading: Math.PI, label: 'Bashundhara Kuril Flyover Ramp' },
      { x: 0, z: -1580, heading: Math.PI, label: 'Airport Runway Overpass Jump' },
      { x: 0, z: 1620, heading: 0, label: 'Keraniganj Expressway Stunt Ramp' },
      { x: 0, z: 2380, heading: 0, label: 'Padma Bridge Southern Super Jump' },
      { x: 2400, z: 1620, heading: 0, label: 'Narayanganj Port Waterfront Jump' },
      { x: 0, z: -3150, heading: Math.PI, label: 'Gazipur Northern Highway Mega Ramp' }
    ];

    const hasThree = !!(this.scene && typeof THREE !== 'undefined');
    const rampMat = hasThree
      ? new THREE.MeshStandardMaterial({
          color: 0xff2a85,
          emissive: 0xec4899,
          emissiveIntensity: 0.45,
          roughness: 0.35
        })
      : null;
    const stripeMat = hasThree ? new THREE.MeshBasicMaterial({ color: 0xfde047 }) : null;

    rampCoords.forEach((rc, idx) => {
      if (hasThree) {
        const grp = new THREE.Group();
        const wedge = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.3, 7.5), rampMat);
        wedge.rotation.x = -0.22;
        wedge.position.y = 0.65;
        grp.add(wedge);

        const chevron = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 6.5), stripeMat);
        chevron.rotation.x = -Math.PI / 2 - 0.22;
        chevron.position.y = 1.32;
        grp.add(chevron);

        grp.position.set(rc.x, 0, rc.z);
        grp.rotation.y = rc.heading;
        this.scene.add(grp);
      }
      this.stuntRamps.push({ id: `stunt_${idx}`, ...rc, radius: 4.5 });
    });

    // Vice City-Style Spinning Health Hearts (♥) & Body Armor Shields (🛡)
    const pickupSpots = [
      { x: -32, z: 76, type: 'armor', label: 'Body Armor Shield (+100 Armor)' },
      { x: -22, z: 76, type: 'health', label: 'Health Heart (+100 Health)' },
      { x: 22, z: 55, type: 'armor', label: 'Shahbagh Body Armor' },
      { x: -375, z: -185, type: 'health', label: 'Farmgate Hospital Health Heart' },
      { x: 675, z: -415, type: 'armor', label: 'Gulshan Diplomatic Armor' },
      { x: 675, z: 355, type: 'health', label: 'Motijheel Medical Heart' },
      { x: 1545, z: -955, type: 'armor', label: 'Purbachal Smart City Armor' },
      { x: 0, z: 2390, type: 'health', label: 'Padma Expressway Health Heart' }
    ];

    pickupSpots.forEach((ps, idx) => {
      let mesh = null;
      if (this.scene && typeof THREE !== 'undefined') {
        const isArmor = ps.type === 'armor';
        const mat = new THREE.MeshStandardMaterial({
          color: isArmor ? 0x38bdf8 : 0xf43f5e,
          emissive: isArmor ? 0x0284c7 : 0xe11d48,
          emissiveIntensity: 0.85,
          metalness: 0.6,
          roughness: 0.2
        });
        mesh = new THREE.Mesh(
          isArmor ? new THREE.OctahedronGeometry(0.75, 1) : new THREE.TorusGeometry(0.62, 0.22, 10, 20),
          mat
        );
        mesh.position.set(ps.x, 1.35, ps.z);
        this.scene.add(mesh);
      }
      this.healthArmorPickups.push({ id: `ha_${idx}`, ...ps, cooldown: 0, mesh });
    });
  }

  checkCollision(x, z, radius = 1.2) {
    if (x < -this.worldHalfSize || x > this.worldHalfSize || z < -this.worldHalfSize || z > this.worldHalfSize) {
      return { hit: true, label: 'Metropolitan Outer Boundary' };
    }
    if (this._colliderGrid && this._indexedColliderLen === this.colliders.length) {
      const cs = this._colliderCellSize || 128;
      const minCX = Math.floor((x - radius) / cs);
      const maxCX = Math.floor((x + radius) / cs);
      const minCZ = Math.floor((z - radius) / cs);
      const maxCZ = Math.floor((z + radius) / cs);
      for (let cx = minCX; cx <= maxCX; cx++) {
        for (let cz = minCZ; cz <= maxCZ; cz++) {
          const bucket = this._colliderGrid.get(`${cx}_${cz}`);
          if (!bucket) continue;
          for (let i = 0; i < bucket.length; i++) {
            const c = bucket[i];
            if (
              x + radius > c.minX &&
              x - radius < c.maxX &&
              z + radius > c.minZ &&
              z - radius < c.maxZ
            ) {
              return { hit: true, collider: c, label: c.label };
            }
          }
        }
      }
      return { hit: false };
    }
    for (let i = 0; i < this.colliders.length; i++) {
      const c = this.colliders[i];
      if (
        x + radius > c.minX &&
        x - radius < c.maxX &&
        z + radius > c.minZ &&
        z - radius < c.maxZ
      ) {
        return { hit: true, collider: c, label: c.label };
      }
    }
    return { hit: false };
  }

  getDistrictAt(x, z) {
    let best = DHAKA_DISTRICTS[9];
    let bestDist = Infinity;
    for (const d of DHAKA_DISTRICTS) {
      const dist = Math.hypot(x - d.x, z - d.z);
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    return best;
  }

  update(dt, nightBlend, isRain, playerX = 0, playerZ = 0) {
    this.updateStreamingChunks(playerX, playerZ);

    // Cull showroom PointLight and only rotate showroom display bikes when near the Showroom (<85m)
    const dxSr = playerX - this.showroomCenter.x;
    const dzSr = playerZ - this.showroomCenter.z;
    const nearShowroom = dxSr * dxSr + dzSr * dzSr < 85 * 85;
    if (this.showroomLight) {
      this.showroomLight.visible = nearShowroom;
    }
    if (nearShowroom) {
      for (let i = 0; i < this.showroomBikes.length; i++) {
        const item = this.showroomBikes[i];
        if (item.vehicle && !item.vehicle.driver && item.vehicle.mesh) {
          item.vehicle.heading += dt * 0.45;
          item.vehicle.mesh.rotation.y = item.vehicle.heading;
        }
      }
    }

    // O(1) Traffic Signal Phase Update (Updates 2 shared material sets instead of 550 intersections!)
    this._signalTimer -= dt;
    if (this._signalTimer <= 0) {
      this._signalTimer = 10.0;
      this._signalFlip = !this._signalFlip;
      for (let i = 0; i < this.intersections.length; i++) {
        const inter = this.intersections[i];
        const nsGreen = this._signalFlip ? !inter.isEven : inter.isEven;
        inter.state = nsGreen ? 'NS_GREEN' : 'EW_GREEN';
      }
    }
    const isAmber = this._signalTimer < 2.0;
    if (this._evenSignalMats && this._oddSignalMats) {
      const applySignalColors = (matSet, nsGreen) => {
        if (nsGreen) {
          matSet.greenMat.color.setHex(isAmber ? 0x052e16 : 0x22c55e);
          matSet.amberMat.color.setHex(isAmber ? 0xf59e0b : 0x451a03);
          matSet.redMat.color.setHex(0x450a0a);
        } else {
          matSet.greenMat.color.setHex(0x052e16);
          matSet.amberMat.color.setHex(isAmber ? 0xf59e0b : 0x451a03);
          matSet.redMat.color.setHex(isAmber ? 0x450a0a : 0xef4444);
        }
      };
      applySignalColors(this._evenSignalMats, !this._signalFlip);
      applySignalColors(this._oddSignalMats, this._signalFlip);
    }

    if (this.metroTrain) {
      this.metroTrain.z += this.metroTrain.dir * this.metroTrain.speed * dt;
      if (this.metroTrain.z > 420) this.metroTrain.dir = -1;
      if (this.metroTrain.z < -1050) this.metroTrain.dir = 1;
      this.metroTrain.group.position.z = this.metroTrain.z;
    }

    for (const st of this.stores) {
      if (st.robbedCooldown > 0) {
        st.robbedCooldown = Math.max(0, st.robbedCooldown - dt);
      }
    }

    // Only update road & night material properties when nightBlend or rain state changes
    const envKey = `${Math.round(nightBlend * 100)}_${isRain ? 1 : 0}`;
    if (this._lastEnvKey !== envKey) {
      this._lastEnvKey = envKey;
      const targetRoadRoughness = isRain ? 0.14 : (0.68 - nightBlend * 0.34);
      const targetRoadMetalness = isRain ? 0.75 : (0.18 + nightBlend * 0.42);
      for (const rm of this.roadMaterials) {
        rm.roughness = targetRoadRoughness;
        rm.metalness = targetRoadMetalness;
      }

      for (const wm of this.windowMaterials) {
        wm.emissiveIntensity = 0.02 + nightBlend * 1.15;
      }

      for (const slm of this.streetLightBulbs) {
        slm.emissiveIntensity = 0.2 + nightBlend * 2.2;
      }

      const showPools = nightBlend > 0.02;
      if (this._poolsVisible !== showPools) {
        this._poolsVisible = showPools;
        for (let i = 0; i < this.streetLightPoolMeshes.length; i++) {
          this.streetLightPoolMeshes[i].visible = showPools;
        }
      }

      for (const sp of this.streetLightPoolMats) {
        sp.poolMat.opacity = nightBlend * 0.65;
        sp.coneMat.opacity = nightBlend * 0.14;
      }

      for (const nm of this.neonSignMats) {
        nm.emissiveIntensity = 0.2 + nightBlend * 1.65;
      }

      for (const sfm of this.shopFrontMats) {
        sfm.emissiveIntensity = 0.1 + nightBlend * 1.45;
      }

      for (const bm of this.bridgeArchMaterials) {
        bm.emissiveIntensity = 0.35 + nightBlend * 1.4;
      }
    }

    if (nightBlend > 0.05 && this.streetLights.length > 0) {
      this._nightLightSearchTimer -= dt;
      if (this._nightLightSearchTimer <= 0) {
        this._nightLightSearchTimer = 0.25;
        const nearLights = [];
        for (let i = 0; i < this.streetLights.length; i++) {
          const sl = this.streetLights[i];
          const dx = sl.x - playerX;
          if (dx > 95 || dx < -95) continue;
          const dz = sl.z - playerZ;
          if (dz > 95 || dz < -95) continue;
          const dSq = dx * dx + dz * dz;
          if (dSq < 95 * 95) nearLights.push({ sl, dSq });
        }
        nearLights.sort((a, b) => a.dSq - b.dSq);

        for (let i = 0; i < this.activeNightPointLights.length; i++) {
          const pl = this.activeNightPointLights[i];
          if (nearLights[i]) {
            pl.position.set(nearLights[i].sl.x, 7.4, nearLights[i].sl.z);
            pl.intensity = nightBlend * 1.35;
            pl.visible = true;
          } else {
            pl.intensity = 0;
            pl.visible = false;
          }
        }
      }
    } else {
      for (let i = 0; i < this.activeNightPointLights.length; i++) {
        const pl = this.activeNightPointLights[i];
        if (pl.visible) {
          pl.intensity = 0;
          pl.visible = false;
        }
      }
    }

    for (const d of this.destructibles) {
      if (d.hitCooldown > 0) {
        d.hitCooldown -= dt;
        d.mesh.position.x += d.vx * dt;
        d.mesh.position.y += d.vy * dt;
        d.mesh.position.z += d.vz * dt;
        d.vy -= 18 * dt;
        d.mesh.rotation.x += 5 * dt;
        d.mesh.rotation.z += 4 * dt;
        if (d.mesh.position.y < 0.45) {
          d.mesh.position.y = 0.45;
          d.vx *= 0.85;
          d.vz *= 0.85;
          d.vy = 0;
        }
      }
    }
  }
}

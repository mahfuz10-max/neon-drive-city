// src/traffic.js — Version 7.0 Metropolitan Traffic (32% Cars, 30% Motorcycles, 5% CNG),
// 10 NPC Archetypes with Multi-Activity Sidewalk/Crosswalk/Park AI, Vehicle/Horn Evasion,
// Non-Violent Pedestrian Accident Penalty, and 30+ Auto-Collect 3D Cash Pickups (৳)
import { Vehicle } from './vehicles.js';
import { buildAnatomicalHumanRig } from './player.js';

// Generates a non-fixed, dynamic random cash amount between ৳1,000 and ৳200,000 for each pedestrian
export function generateDynamicPedestrianCash() {
  const roll = Math.random();
  let raw;
  if (roll < 0.32) {
    raw = 1000 + Math.floor(Math.random() * 19000);       // ৳1,000 – ৳20,000
  } else if (roll < 0.68) {
    raw = 20000 + Math.floor(Math.random() * 65000);      // ৳20,000 – ৳85,000
  } else if (roll < 0.90) {
    raw = 85000 + Math.floor(Math.random() * 65000);      // ৳85,000 – ৳150,000
  } else {
    raw = 150000 + Math.floor(Math.random() * 50001);     // ৳150,000 – ৳200,000
  }
  return Math.max(1000, Math.min(200000, raw));
}

export const TRAFFIC_CONFIG = {
  weights: {
    cars: 0.32,        // 32% Cars (sedan, suv, taxi, sports_car)
    motorcycles: 0.30, // 30% Motorcycles (all 10 bike categories!)
    buses: 0.12,       // 12% Buses & Minibuses
    trucks: 0.10,      // 10% Trucks & Delivery Vans
    rickshaws: 0.08,   // 8% Cycle Rickshaws
    cng: 0.05,         // 5% CNG Auto-Rickshaws
    other: 0.03        // 3% Luxury / Special
  },
  pools: {
    cars: ['bmw_m4', 'mercedes_amg', 'audi_r8', 'sedan', 'suv', 'taxi', 'sports_car'],
    motorcycles: [
      'motorcycle',
      'sport_motorcycle',
      'sports_bike',
      'scooter',
      'delivery_scooter',
      'classic_motorcycle',
      'dirt_bike',
      'cruiser_motorcycle',
      'premium_street_bike',
      'vintage_sports_bike'
    ],
    buses: ['bus', 'minibus'],
    trucks: ['truck', 'minibus'],
    rickshaws: ['rickshaw'],
    cng: ['cng'],
    other: ['luxury_car']
  }
};

export const NPC_ARCHETYPES = [
  { id: 'young_man', role: 'Young Man', bnRole: 'তরুণ পথচারী', isFemale: false, topHex: 0x059669, pantsHex: 0x1e3a8a, hasBeard: false },
  { id: 'adult_man', role: 'Adult Man', bnRole: 'বয়স্ক নাগরিক', isFemale: false, topHex: 0x334155, pantsHex: 0x0f172a, hasBeard: true },
  { id: 'woman', role: 'Woman', bnRole: 'বাঙালি নারী', isFemale: true, topHex: 0xe11d48, pantsHex: 0xf8fafc, hasBeard: false },
  { id: 'student', role: 'University Student', bnRole: 'বিশ্ববিদ্যালয় শিক্ষার্থী', isFemale: false, topHex: 0x2563eb, pantsHex: 0x1e293b, hasBeard: false },
  { id: 'office_worker', role: 'Office Worker', bnRole: 'অফিস কর্মকর্তা', isFemale: false, topHex: 0x0284c7, pantsHex: 0x334155, hasBeard: true },
  { id: 'shopkeeper', role: 'Shopkeeper', bnRole: 'দোকানদার', isFemale: false, topHex: 0xd97706, pantsHex: 0xf8fafc, hasBeard: true },
  { id: 'street_vendor', role: 'Street Vendor', bnRole: 'ভ্রাম্যমাণ বিক্রেতা', isFemale: false, topHex: 0x16a34a, pantsHex: 0x451a03, hasBeard: true },
  { id: 'tourist', role: 'Tourist', bnRole: 'পর্যটক', isFemale: true, topHex: 0x9333ea, pantsHex: 0x1e293b, hasBeard: false, hasSunglasses: true },
  { id: 'security_guard', role: 'Security Guard', bnRole: 'নিরাপত্তা প্রহরী', isFemale: false, topHex: 0x1e3a8a, pantsHex: 0x0f172a, hasBeard: true },
  { id: 'delivery_worker', role: 'Delivery Worker', bnRole: 'ডেলিভারি কর্মী', isFemale: false, topHex: 0xf97316, pantsHex: 0x111827, hasBeard: false, hasHelmet: true, helmetHex: 0xf97316 }
];

// Deterministic / weighted vehicle selector that respects TRAFFIC_CONFIG.weights and prevents adjacent duplicates
export function buildWeightedTrafficDeck(count = 100) {
  const deck = [];
  const categories = Object.keys(TRAFFIC_CONFIG.weights);
  for (const cat of categories) {
    const slots = Math.max(1, Math.round(TRAFFIC_CONFIG.weights[cat] * count));
    const pool = TRAFFIC_CONFIG.pools[cat];
    for (let i = 0; i < slots; i++) {
      deck.push({ category: cat, typeId: pool[i % pool.length] });
    }
  }
  const interleaved = [];
  const step = 7;
  for (let i = 0; i < deck.length; i++) {
    interleaved.push(deck[(i * step) % deck.length]);
  }
  for (let i = 1; i < interleaved.length; i++) {
    if (interleaved[i].typeId === interleaved[i - 1].typeId) {
      for (let j = i + 1; j < interleaved.length; j++) {
        if (
          interleaved[j].typeId !== interleaved[i - 1].typeId &&
          (j + 1 >= interleaved.length || interleaved[j + 1].typeId !== interleaved[i].typeId)
        ) {
          const tmp = interleaved[i];
          interleaved[i] = interleaved[j];
          interleaved[j] = tmp;
          break;
        }
      }
    }
  }
  return interleaved;
}

export class TrafficSystem {
  constructor(scene, city, sound) {
    this.scene = scene;
    this.city = city;
    this.sound = sound;

    this.vehicles = [];
    this.pedestrians = [];
    this.cashDrops = []; // Physical 3D glowing cash bundles & lost wallets on the ground (auto-collected!)

    this.spawnParkedLandmarkVehicles();
    this.spawnActiveTraffic();
    this.spawnPedestrians();
    this.spawnWorldCashCollectibles();
  }

  spawnParkedLandmarkVehicles() {
    const showcaseSpawns = [
      { type: 'bmw_m4', x: -15, z: 68, heading: Math.PI, npc: false }, // BMW M4 Competition right beside player spawn!
      { type: 'mercedes_amg', x: 15, z: 68, heading: Math.PI, npc: false }, // Mercedes-Benz S-Class AMG right beside Mall!
      { type: 'audi_r8', x: 15, z: 96, heading: Math.PI, npc: false }, // Audi R8 V10 Supercar outside Blue Moon Bar!
      { type: 'sport_motorcycle', x: -8, z: 58, heading: Math.PI, npc: false }, // Shahbagh Square
      { type: 'sedan', x: 8, z: 62, heading: Math.PI, npc: false }, // Shahbagh Square
      { type: 'sports_bike', x: -8, z: 76, heading: Math.PI, npc: false }, // Shahbagh Square
      { type: 'bus', x: 8, z: 88, heading: Math.PI, npc: false }, // Shahbagh Square
      { type: 'taxi', x: -16, z: 52, heading: Math.PI / 2, npc: false }, // Shahbagh Square
      { type: 'luxury_car', x: 660, z: -405, heading: 0, npc: false }, // Gulshan-2 Circle
      { type: 'sports_car', x: 18, z: -405, heading: 0, npc: false }, // Banani Road 11
      { type: 'suv', x: -500, z: 95, heading: 0, npc: false }, // Dhanmondi Lake
      { type: 'premium_street_bike', x: -365, z: -180, heading: 0, npc: false }, // Farmgate
      { type: 'minibus', x: 660, z: 345, heading: Math.PI, npc: false }, // Motijheel
      { type: 'truck', x: -665, z: -180, heading: 0, npc: false }, // Tejgaon Industrial
      { type: 'classic_motorcycle', x: -665, z: 545, heading: Math.PI / 2, npc: false }, // Lalbagh Fort
      { type: 'cruiser_motorcycle', x: 250, z: -10, heading: 0, npc: false }, // Hatirjheel West Bank
      { type: 'sports_bike', x: 1535, z: -945, heading: 0, npc: false }, // Purbachal Smart City
      { type: 'luxury_car', x: 1235, z: -665, heading: 0, npc: false }, // Bashundhara R/A
      { type: 'taxi', x: 18, z: -1600, heading: 0, npc: false }, // Hazrat Shahjalal Airport
      { type: 'speed_boat', x: 262, z: -10, heading: Math.PI / 2, npc: false }, // Hatirjheel Boat Dock
      { type: 'speed_boat', x: -180, z: 830, heading: 0, npc: false } // Sadarghat River Jetty
    ];

    showcaseSpawns.forEach((s) => {
      const v = new Vehicle(this.scene, s.type, s.x, s.z, s.heading, s.npc);
      this.vehicles.push(v);
    });
  }

  // Spawn active moving AI vehicles strictly following TRAFFIC_CONFIG weights (32% Cars, 30% Motorcycles, 5% CNG)
  spawnActiveTraffic() {
    const deck = buildWeightedTrafficDeck(100);
    let deckIdx = 0;

    // 55 North-South vehicles across all 15 NS avenues
    this.city.nsRoads.forEach((rx, rIdx) => {
      const countOnRoad = rIdx % 2 === 0 ? 4 : 3;
      for (let i = 0; i < countOnRoad; i++) {
        const entry = deck[deckIdx % deck.length];
        deckIdx++;
        const goingSouth = i % 2 === 0;
        const laneX = goingSouth ? rx + 4.5 : rx - 4.5;
        const zPos = -1550 + i * 520 + (rIdx % 3) * 85;
        const heading = goingSouth ? 0 : Math.PI;

        const v = new Vehicle(this.scene, entry.typeId, laneX, zPos, heading, true);
        v.aiMeta = {
          roadAxis: 'ns',
          dir: goingSouth ? 1 : -1,
          laneCoord: laneX,
          cruiseSpeed: v.spec.maxSpeed * 0.52
        };
        this.vehicles.push(v);
      }
    });

    // 45 East-West vehicles across all 12 EW avenues
    this.city.ewRoads.forEach((rz, rIdx) => {
      const countOnRoad = rIdx % 2 === 0 ? 4 : 3;
      for (let i = 0; i < countOnRoad; i++) {
        const entry = deck[deckIdx % deck.length];
        deckIdx++;
        const goingEast = i % 2 === 0;
        const laneZ = goingEast ? rz - 4.5 : rz + 4.5;
        const xPos = -1550 + i * 560 + (rIdx % 3) * 90;
        const heading = goingEast ? Math.PI / 2 : -Math.PI / 2;

        const v = new Vehicle(this.scene, entry.typeId, xPos, laneZ, heading, true);
        v.aiMeta = {
          roadAxis: 'ew',
          dir: goingEast ? 1 : -1,
          laneCoord: laneZ,
          cruiseSpeed: v.spec.maxSpeed * 0.5
        };
        this.vehicles.push(v);
      }
    });
  }

  getTrafficDistributionStats() {
    const moving = this.vehicles.filter((v) => v.driver === 'npc');
    const total = moving.length || 1;
    const counts = { cars: 0, motorcycles: 0, buses: 0, trucks: 0, rickshaws: 0, cng: 0 };
    for (const v of moving) {
      if (v.isMotorcycle) counts.motorcycles++;
      else if (v.typeId === 'cng') counts.cng++;
      else if (v.typeId === 'rickshaw') counts.rickshaws++;
      else if (v.typeId === 'bus' || v.typeId === 'minibus') counts.buses++;
      else if (v.typeId === 'truck') counts.trucks++;
      else counts.cars++;
    }
    return {
      total: moving.length,
      counts,
      cngShare: counts.cng / total,
      motorcycleShare: counts.motorcycles / total,
      carShare: counts.cars / total
    };
  }

  // Spawn 140 diverse Bangladeshi NPCs across 10 archetypes and 5 realistic urban behaviors
  spawnPedestrians() {
    const skinTones = [0xd2996c, 0xc68642, 0xb06c36, 0x8d5524, 0xbf7e46];
    const behaviors = ['walking_sidewalk', 'walking_sidewalk', 'crossing_road', 'waiting_bus_stop', 'chatting_pair', 'sitting_park'];

    for (let i = 0; i < 180; i++) {
      const arch = NPC_ARCHETYPES[i % NPC_ARCHETYPES.length];
      const scaleY = 0.92 + (i % 5) * 0.032;
      const rig = buildAnatomicalHumanRig({
        skinHex: skinTones[i % skinTones.length],
        hairHex: 0x111827,
        topHex: arch.topHex,
        innerHex: 0xf8fafc,
        pantsHex: arch.pantsHex,
        scaleY,
        hasBeard: arch.hasBeard,
        isFemale: arch.isFemale,
        hasSunglasses: !!arch.hasSunglasses,
        hasHelmet: !!arch.hasHelmet,
        helmetHex: arch.helmetHex || 0xf97316
      });

      const behavior = behaviors[i % behaviors.length];
      let axis = i % 3 === 0 ? 'ew' : 'ns';
      let px = 0;
      let pz = 0;

      // High-density commercial cluster in central Shahbagh / Showroom / Farmgate / Dhanmondi / Hatirjheel (first 40 NPCs)
      if (i < 40) {
        axis = i % 2 === 0 ? 'ns' : 'ew';
        if (axis === 'ns') {
          const rx = i < 20 ? 0 : -180;
          px = rx + (i % 2 === 0 ? 11.4 : -11.4);
          pz = -80 + i * 8.5;
        } else {
          const rz = i < 20 ? 75 : -190;
          px = -160 + i * 9.5;
          pz = rz + (i % 2 === 0 ? 11.4 : -11.4);
        }
      } else if (axis === 'ns') {
        const rx = this.city.nsRoads[i % this.city.nsRoads.length];
        px = rx + (i % 2 === 0 ? 11.4 : -11.4);
        pz = -1700 + ((i - 40) * 34) % 2450;
      } else {
        const rz = this.city.ewRoads[i % this.city.ewRoads.length];
        px = -1700 + ((i - 40) * 36) % 3400;
        pz = rz + (i % 2 === 0 ? 11.4 : -11.4);
      }

      if (rig.root) {
        if (behavior === 'sitting_park' && rig.joints && rig.joints.leftHip) {
          rig.joints.pelvisJoint.position.y = 0.56;
          rig.joints.leftHip.rotation.x = -Math.PI / 2;
          rig.joints.rightHip.rotation.x = -Math.PI / 2;
          rig.joints.leftKnee.rotation.x = Math.PI / 2;
          rig.joints.rightKnee.rotation.x = Math.PI / 2;
        }
        rig.root.position.set(px, 0, pz);
        if (this.scene) this.scene.add(rig.root);
      }

      const cashAmount = generateDynamicPedestrianCash(); // Dynamic ৳1,000 to ৳200,000 carried by each pedestrian
      this.pedestrians.push({
        id: `npc_${i}`,
        archetypeId: arch.id,
        role: arch.role,
        bnRole: arch.bnRole,
        isFemale: arch.isFemale,
        behavior,
        mesh: rig.root,
        joints: rig.joints,
        x: px,
        z: pz,
        spawnX: px,
        spawnZ: pz,
        axis,
        dir: i % 2 === 0 ? 1 : -1,
        baseSpeed: 2.25 + (i % 4) * 0.38,
        fleeTimer: 0,
        knockedDown: false,
        knockdownTimer: 0,
        accidentCooldown: 0,
        waitingForTraffic: false,
        cashAmount,
        hasProvidedCash: false,
        phase: (i * 0.85) % (Math.PI * 2)
      });
    }
  }

  // Pre-spawn 32 Auto-Collect Cash Bundles & Lost Wallets across Central & Outer Dhaka Districts!
  spawnWorldCashCollectibles() {
    const presetCollectibles = [
      { x: -28, z: 68, amount: 500, label: 'Lost Leather Wallet (Shahbagh Sidewalk)' },
      { x: -16, z: 62, amount: 500, label: 'Dropped Taka Bundle (Showroom Entrance)' },
      { x: 14, z: 72, amount: 1000, label: 'Courier Cash Pouch (Shahbagh Square)' },
      { x: -58, z: 54, amount: 500, label: 'Showroom Plaza Bonus Cash' },
      { x: -370, z: -175, amount: 1000, label: 'Farmgate Footbridge Cash Drop' },
      { x: -510, z: 105, amount: 1000, label: 'Dhanmondi Lake Promenade Wallet' },
      { x: 370, z: -15, amount: 1500, label: 'Hatirjheel Waterfront Bonus Bundle' },
      { x: 12, z: -410, amount: 1500, label: 'Banani Road 11 VIP Cash Drop' },
      { x: 670, z: -410, amount: 2500, label: 'Gulshan-2 Diplomatic Circle Briefcase' },
      { x: 670, z: 350, amount: 2500, label: 'Motijheel Bank District Cash Bag' },
      { x: -175, z: 555, amount: 1000, label: 'Old Dhaka Chawkbazar Merchant Pouch' },
      { x: -670, z: 555, amount: 1500, label: 'Lalbagh Fort Garden Collectible' },
      { x: 175, z: 775, amount: 1500, label: 'Ahsan Manzil Waterfront Cash Bundle' },
      { x: -175, z: 775, amount: 1000, label: 'Sadarghat Terminal Cash Pouch' },
      { x: 12, z: -950, amount: 1500, label: 'Uttara Sector 7 Metro Plaza Cash' },
      { x: -670, z: -670, amount: 1500, label: 'Mirpur Stadium Gate Bonus' },
      { x: -670, z: -185, amount: 1000, label: 'Tejgaon Rail Crossing Cash Drop' },
      { x: -950, z: -950, amount: 2000, label: 'Savar Highway Town Reward Bundle' },
      { x: 670, z: 775, amount: 2000, label: 'Keraniganj Riverside Market Cash' },
      { x: 1540, z: -950, amount: 2500, label: 'Purbachal Smart City 300ft Cash Bundle' },
      { x: 1240, z: -670, amount: 2000, label: 'Bashundhara R/A Kuril Flyover Cash' },
      { x: 15, z: -1610, amount: 2500, label: 'Hazrat Shahjalal Airport VIP Terminal Drop' },
      { x: -1540, z: -1610, amount: 2000, label: 'Tongi-Gazipur Industrial Highway Stash' }
    ];

    presetCollectibles.forEach((c) => {
      this.spawnCashDrop(c.x, c.z, c.amount, c.label);
    });
  }

  // Trigger pedestrian horn reaction when player honks [H]
  triggerHornReaction(x, z, radius = 26) {
    let reacted = 0;
    for (const p of this.pedestrians) {
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < radius) {
        p.fleeTimer = Math.max(p.fleeTimer, 3.8);
        reacted++;
      }
    }
    return reacted;
  }

  findNearestInteractableNPC(x, z, maxDist = 4.5) {
    let best = null;
    let bestD = maxDist;
    for (const p of this.pedestrians) {
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }

  // Vice City-Style On-Foot Pedestrian Takedown & Instant Cash Grab (৳1,000 – ৳200,000)
  interactWithNPC(npc, player = null) {
    if (!npc || npc.knockedDown || npc.hasProvidedCash) {
      return { success: false, amount: 0, reason: 'already_collected' };
    }
    npc.hasProvidedCash = true;
    npc.knockedDown = true;
    npc.knockdownTimer = 7.5;
    const amount = npc.cashAmount > 0 ? npc.cashAmount : generateDynamicPedestrianCash();
    npc.cashAmount = 0;

    if (npc.mesh) {
      npc.mesh.position.set(npc.x, 0.18, npc.z);
      npc.mesh.rotation.x = -Math.PI / 2;
    }

    if (player) {
      player.money += amount;
    }
    const fxDrop = this.spawnCashDrop(npc.x, npc.z, amount, `${npc.role} Cash`);
    fxDrop.collected = true;
    fxDrop.pickupAnimTimer = 0.45;

    return {
      success: true,
      amount,
      role: npc.role,
      witnessTriggered: true
    };
  }

  spawnCashDrop(x, z, amount = 500, label = 'Collectible Cash Bundle') {
    let mesh = null;
    if (this.scene && typeof THREE !== 'undefined') {
      if (!this._cashAssets) {
        this._cashAssets = {
          bundleGeo: new THREE.BoxGeometry(0.68, 0.25, 0.4),
          bundleMat: new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.85,
            roughness: 0.28
          }),
          bandGeo: new THREE.BoxGeometry(0.22, 0.27, 0.42),
          bandMat: new THREE.MeshBasicMaterial({ color: 0xfde047 }),
          ringGeo: new THREE.RingGeometry(0.58, 0.84, 14),
          ringMat: new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide })
        };
      }
      const group = new THREE.Group();
      const bundle = new THREE.Mesh(this._cashAssets.bundleGeo, this._cashAssets.bundleMat);
      bundle.position.y = 0.36;
      group.add(bundle);

      const band = new THREE.Mesh(this._cashAssets.bandGeo, this._cashAssets.bandMat);
      band.position.y = 0.36;
      group.add(band);

      const ring = new THREE.Mesh(this._cashAssets.ringGeo, this._cashAssets.ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.31;
      group.add(ring);

      group.position.set(x, 0, z);
      this.scene.add(group);
      mesh = group;
    }

    const drop = {
      id: `cash_${Date.now()}_${Math.random()}`,
      x,
      z,
      amount,
      label,
      collected: false,
      pickupAnimTimer: 0,
      mesh
    };
    this.cashDrops.push(drop);
    return drop;
  }

  // Vice City-Style Vehicle-Over-Pedestrian Cash Transfer:
  // When the player drives over a pedestrian, knocks them down and transfers all cash they carried directly to the player!
  ramPedestrianWithVehicle(npc, player, vehicle, onPedestrianCashTaken) {
    if (!npc || npc.knockedDown || npc.accidentCooldown > 0) return 0;
    npc.knockedDown = true;
    npc.knockdownTimer = 7.5;
    npc.accidentCooldown = 8.0;

    // Knock pedestrian forward/aside from bumper and lay mesh flat on the ground (like NibYw2Kx-YM 00:08-00:11)
    const heading = vehicle ? vehicle.heading : 0;
    npc.x += Math.sin(heading) * 2.6 + (Math.random() - 0.5) * 1.2;
    npc.z += Math.cos(heading) * 2.6 + (Math.random() - 0.5) * 1.2;
    if (npc.mesh) {
      npc.mesh.position.set(npc.x, 0.18, npc.z);
      npc.mesh.rotation.x = -Math.PI / 2;
    }

    // Transfer whatever money the pedestrian had directly to the player (plus spawn a visual pickup effect)
    const takenCash = npc.cashAmount > 0 ? npc.cashAmount : generateDynamicPedestrianCash();
    npc.cashAmount = 0;
    npc.hasProvidedCash = true;
    player.money += takenCash;

    // Spawn brief visual-only rising cash bundle effect at impact point
    const fxDrop = this.spawnCashDrop(npc.x, npc.z, takenCash, `${npc.role} Cash`);
    fxDrop.collected = true;
    fxDrop.pickupAnimTimer = 0.45;

    if (this.sound) this.sound.playChime('mission_complete');
    if (onPedestrianCashTaken) onPedestrianCashTaken(npc, takenCash);
    return takenCash;
  }

  // Pure helper for testing auto-collection without WebGL
  tryAutoCollectCash(player, onCashPickup) {
    let collectedCount = 0;
    for (const drop of this.cashDrops) {
      if (drop.collected) continue;
      const dist = Math.hypot(player.x - drop.x, player.z - drop.z);
      if (dist < 3.6) {
        drop.collected = true;
        drop.pickupAnimTimer = 0.38;
        player.money += drop.amount;
        collectedCount++;
        if (this.sound) this.sound.playChime('mission_complete');
        if (onCashPickup) onCashPickup(drop.amount, drop.label);
      }
    }
    return collectedCount;
  }

  update(dt, player, onCashPickup, onPedestrianAccident) {
    this._frameTick = (this._frameTick || 0) + 1;
    // 1. Update Physical 3D Auto-Collect Cash Drops on the Ground (Culled by distance!)
    const time = performance.now() * 0.004;
    this.tryAutoCollectCash(player, onCashPickup);

    for (let i = 0; i < this.cashDrops.length; i++) {
      const drop = this.cashDrops[i];
      if (!drop.mesh) continue;
      if (!drop.collected) {
        const dx = drop.x - player.x;
        const dz = drop.z - player.z;
        const vis = dx * dx + dz * dz < 190 * 190;
        drop.mesh.visible = vis;
        if (vis) {
          drop.mesh.rotation.y = time;
          drop.mesh.position.y = Math.sin(time * 1.6) * 0.08;
        }
      } else if (drop.pickupAnimTimer > 0) {
        drop.pickupAnimTimer -= dt;
        drop.mesh.position.y += dt * 4.5;
        drop.mesh.rotation.y += dt * 14;
        const s = Math.max(0.01, drop.pickupAnimTimer / 0.38);
        drop.mesh.scale.set(s, s, s);
        if (drop.pickupAnimTimer <= 0) {
          drop.mesh.visible = false;
          if (this.scene) this.scene.remove(drop.mesh);
        }
      }
    }

    // 2. Update AI Lane-Following Traffic with Distance LOD & O(1) Intersection Checks
    const vehicles = this.vehicles;
    const vehLen = vehicles.length;
    for (let i = 0; i < vehLen; i++) {
      const v = vehicles[i];
      if (v.driver !== 'npc' || !v.aiMeta) {
        if (v.mesh && !v.isShowroomDisplay && v.driver !== 'player') {
          const dxP = v.x - player.x;
          const dzP = v.z - player.z;
          v.mesh.visible = dxP * dxP + dzP * dzP < 280 * 280;
        }
        continue;
      }

      const toPlayerX = player.x - v.x;
      const toPlayerZ = player.z - v.z;
      const distSq = toPlayerX * toPlayerX + toPlayerZ * toPlayerZ;
      const isVisible = distSq < 260 * 260;
      if (v.mesh) {
        v.mesh.visible = isVisible;
      }

      const meta = v.aiMeta;

      // Fast off-screen simulation for distant AI traffic (>260m away)
      if (!isVisible) {
        v.speed = meta.cruiseSpeed;
        if (meta.roadAxis === 'ns') {
          v.z += meta.dir * v.speed * dt;
          if (v.z > 3800) v.z = -3800;
          else if (v.z < -3800) v.z = 3800;
        } else {
          v.x += meta.dir * v.speed * dt;
          if (v.x > 3800) v.x = -3800;
          else if (v.x < -3800) v.x = 3800;
        }
        continue;
      }

      let shouldStop = false;
      const sinH = Math.sin(v.heading);
      const cosH = Math.cos(v.heading);

      if (distSq < 169) { // < 13m
        const forwardDot = sinH * toPlayerX + cosH * toPlayerZ;
        if (forwardDot > 2) shouldStop = true;
      }

      if (!shouldStop && distSq < 155 * 155) {
        for (let j = 0; j < vehLen; j++) {
          const other = vehicles[j];
          if (other === v || other.isShowroomDisplay) continue;
          const dx = other.x - v.x;
          if (dx > 11 || dx < -11) continue;
          const dz = other.z - v.z;
          if (dz > 11 || dz < -11) continue;
          if (dx * dx + dz * dz < 121) {
            const dot = sinH * dx + cosH * dz;
            if (dot > 3) {
              shouldStop = true;
              break;
            }
          }
        }
      }

      if (!shouldStop && distSq < 145 * 145) {
        // Fast O(N_roads) check instead of scanning all 550 intersections
        if (meta.roadAxis === 'ns' && this.city.ewRoads) {
          const ewRoads = this.city.ewRoads;
          for (let r = 0; r < ewRoads.length; r++) {
            const rz = ewRoads[r];
            const dz = (rz - v.z) * meta.dir;
            if (dz > 8 && dz < 18) {
              const rx = Math.round(meta.laneCoord);
              const isEven = Math.abs(rx + rz) % 2 === 0;
              const nsGreen = this.city._signalFlip ? !isEven : isEven;
              if (!nsGreen) shouldStop = true;
              break;
            }
          }
        } else if (meta.roadAxis === 'ew' && this.city.nsRoads) {
          const nsRoads = this.city.nsRoads;
          for (let r = 0; r < nsRoads.length; r++) {
            const rx = nsRoads[r];
            const dx = (rx - v.x) * meta.dir;
            if (dx > 8 && dx < 18) {
              const rz = Math.round(meta.laneCoord);
              const isEven = Math.abs(rx + rz) % 2 === 0;
              const ewGreen = this.city._signalFlip ? isEven : !isEven;
              if (!ewGreen) shouldStop = true;
              break;
            }
          }
        }
      }

      if (v.isBraking !== shouldStop) {
        v.isBraking = shouldStop;
        for (let b = 0; b < v.brakelightMeshes.length; b++) {
          v.brakelightMeshes[b].color.setHex(shouldStop ? 0xff2222 : 0x7f1d1d);
        }
      }

      if (shouldStop) {
        v.speed = Math.max(0, v.speed - v.spec.braking * dt);
      } else {
        v.speed = Math.min(meta.cruiseSpeed, v.speed + v.spec.accel * 0.6 * dt);
      }

      if (meta.roadAxis === 'ns') {
        v.z += meta.dir * v.speed * dt;
        v.x += (meta.laneCoord - v.x) * 3 * dt;
        if (v.z > 3800) v.z = -3800;
        else if (v.z < -3800) v.z = 3800;
      } else {
        v.x += meta.dir * v.speed * dt;
        v.z += (meta.laneCoord - v.z) * 3 * dt;
        if (v.x > 3800) v.x = -3800;
        else if (v.x < -3800) v.x = 3800;
      }

      if (v.speed > 0.1 && distSq < 95 * 95) {
        const wheelDelta = v.speed * dt;
        for (let w = 0; w < v.wheels.length; w++) {
          v.wheels[w].rotation.x += wheelDelta;
        }
      }

      if (v.mesh) {
        v.mesh.position.set(v.x, 0.28, v.z);
        v.mesh.rotation.y = v.heading;
      }
    }

    // 3. Update Anatomical Multi-Joint NPC Pedestrians with Distance LOD Culling
    const peds = this.pedestrians;
    const pedLen = peds.length;
    for (let i = 0; i < pedLen; i++) {
      const p = peds[i];
      const dxP = p.x - player.x;
      const dzP = p.z - player.z;
      const distSq = dxP * dxP + dzP * dzP;
      const isVis = distSq < 165 * 165;
      if (p.mesh) p.mesh.visible = isVis;
      if (p.accidentCooldown > 0) p.accidentCooldown -= dt;

      if (p.knockedDown) {
        p.knockdownTimer -= dt;
        if (p.knockdownTimer <= 0) {
          p.knockedDown = false;
          p.cashAmount = generateDynamicPedestrianCash();
          p.hasProvidedCash = false;
          if (p.mesh) {
            p.mesh.rotation.x = 0;
            p.mesh.position.set(p.x, 0, p.z);
          }
        }
        continue;
      }

      // Fast off-screen sidewalk advance for distant pedestrians (>165m away)
      if (!isVis) {
        if (p.behavior === 'walking_sidewalk' || p.behavior === 'crossing_road') {
          if (p.axis === 'ew') {
            p.x += p.dir * p.baseSpeed * dt;
            if (p.x > 3800) p.dir = -1;
            else if (p.x < -3800) p.dir = 1;
          } else {
            p.z += p.dir * p.baseSpeed * dt;
            if (p.z > 3800) p.dir = -1;
            else if (p.z < -3800) p.dir = 1;
          }
        }
        continue;
      }

      // Check collision with player's moving vehicle
      if (player.inVehicle && !player.inVehicle.isBoat && distSq < 64) {
        const pv = player.inVehicle;
        const absSpd = Math.abs(pv.speed);
        const hitR = pv.spec.radius + 0.95;
        if (distSq < hitR * hitR && absSpd > 2.2 && p.accidentCooldown <= 0) {
          pv.speed *= 0.88;
          this.ramPedestrianWithVehicle(p, player, pv, onPedestrianAccident);
          continue;
        } else if (distSq < 56.25 && absSpd > 14.0) {
          p.fleeTimer = Math.max(p.fleeTimer, 2.0);
        }
      }

      if (p.fleeTimer > 0) {
        p.fleeTimer -= dt;
      }

      // Stationary park bench sitting or bus-stop waiting
      if ((p.behavior === 'sitting_park' || p.behavior === 'waiting_bus_stop' || p.behavior === 'chatting_pair') && p.fleeTimer <= 0) {
        if (distSq < 70 * 70 && ((i + this._frameTick) & 1) === 0) {
          p.phase += dt * 4.8;
          if (p.joints && p.joints.headGroup) {
            p.joints.headGroup.rotation.y = Math.sin(p.phase) * 0.22;
            if (p.behavior === 'chatting_pair' && p.joints.rightShoulder) {
              p.joints.rightShoulder.rotation.x = -0.35 + Math.sin(p.phase * 1.8) * 0.18;
              p.joints.rightElbow.rotation.x = -0.55;
            }
          }
        }
        continue;
      }

      // Check if crossing road pedestrian should stop for approaching traffic
      p.waitingForTraffic = false;
      if (p.behavior === 'crossing_road' && p.fleeTimer <= 0 && distSq < 85 * 85) {
        for (let j = 0; j < vehLen; j++) {
          const v = vehicles[j];
          if (Math.abs(v.speed) > 4 && Math.abs(v.x - p.x) < 18 && Math.abs(v.z - p.z) < 18) {
            p.waitingForTraffic = true;
            break;
          }
        }
      }

      if (p.waitingForTraffic) {
        if (p.joints && p.joints.leftHip) {
          p.joints.leftHip.rotation.x *= 0.85;
          p.joints.rightHip.rotation.x *= 0.85;
        }
        continue;
      }

      const effSpeed = p.fleeTimer > 0 ? p.baseSpeed * 2.25 : p.baseSpeed;

      if (p.axis === 'ew') {
        p.x += p.dir * effSpeed * dt;
        if (p.x > 3800) p.dir = -1;
        else if (p.x < -3800) p.dir = 1;
      } else {
        p.z += p.dir * effSpeed * dt;
        if (p.z > 3800) p.dir = -1;
        else if (p.z < -3800) p.dir = 1;
      }

      p.phase += dt * (p.fleeTimer > 0 ? 12 : 7.8);

      // Animate skeletal joints at full 60Hz when close (<65m) and 30Hz when medium distance (65-165m)
      if (p.joints && p.joints.leftHip && (distSq < 65 * 65 || ((i + this._frameTick) & 1) === 0)) {
        const s = Math.sin(p.phase);
        const c = Math.cos(p.phase);
        const stride = p.fleeTimer > 0 ? 0.68 : 0.44;
        p.joints.pelvisJoint.position.y = 0.96 + Math.abs(s) * 0.025;
        p.joints.leftHip.rotation.x = s * stride;
        p.joints.rightHip.rotation.x = -s * stride;
        p.joints.leftKnee.rotation.x = Math.max(0, -c * stride);
        p.joints.rightKnee.rotation.x = Math.max(0, c * stride);
        p.joints.leftShoulder.rotation.x = -s * stride * 0.75;
        p.joints.rightShoulder.rotation.x = s * stride * 0.75;
        p.joints.leftElbow.rotation.x = -0.28 - Math.max(0, -s) * 0.35;
        p.joints.rightElbow.rotation.x = -0.28 - Math.max(0, s) * 0.35;
        p.joints.spineJoint.rotation.y = -s * 0.1;
      }

      if (p.mesh) {
        p.mesh.position.set(p.x, 0, p.z);
        if (p.axis === 'ew') {
          p.mesh.rotation.y = p.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          p.mesh.rotation.y = p.dir > 0 ? 0 : Math.PI;
        }
      }
    }
  }
}

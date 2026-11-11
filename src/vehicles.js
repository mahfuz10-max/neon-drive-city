import { buildAnatomicalHumanRig } from './player.js';
// src/vehicles.js — Version 5.0 Complete Vehicle & 10-Motorcycle Collection with Detailed 3D Suspension, Fairings, Handlebars & Leaning Physics
export const BIKE_SHOWROOM_CATALOG = [
  {
    id: 'motorcycle',
    name: 'City Street 125',
    bnName: 'সিটি স্ট্রিট ১২৫ কমিউটার',
    bikeClass: 'Street Bike',
    price: 45000,
    maxSpeed: 54,
    accel: 32,
    handling: 82,
    color: 0x2563eb,
    desc: 'Reliable naked commuter motorcycle built for everyday Dhaka traffic.'
  },
  {
    id: 'scooter',
    name: 'Dhanmondi Metro Scooter 110',
    bnName: 'ধানমন্ডি মেট্রো স্কুটার ১১০',
    bikeClass: 'Scooter',
    price: 65000,
    maxSpeed: 46,
    accel: 28,
    handling: 90,
    color: 0xec4899,
    desc: 'Compact step-through urban scooter with nimble cornering and under-seat storage.'
  },
  {
    id: 'delivery_scooter',
    name: 'Kacchi Express Delivery 125',
    bnName: 'ডেলিভারি স্কুটার ১২৫ (বক্সসহ)',
    bikeClass: 'Delivery Scooter',
    price: 75000,
    maxSpeed: 48,
    accel: 30,
    handling: 86,
    color: 0xf97316,
    desc: 'Equipped with an insulated rear thermal cargo box for Dhaka food & parcel delivery missions.'
  },
  {
    id: 'classic_motorcycle',
    name: 'Classic Rider 150',
    bnName: 'ক্লাসিক রাইডার ১৫০ ভিন্টেজ',
    bikeClass: 'Classic Motorcycle',
    price: 85000,
    maxSpeed: 56,
    accel: 33,
    handling: 78,
    color: 0x78350f,
    desc: 'Timeless round-headlamp chrome cruiser styling with a deep thumping exhaust note.'
  },
  {
    id: 'sport_motorcycle',
    name: 'Sport X 200',
    bnName: 'স্পোর্ট এক্স ২০০ রেসিং',
    bikeClass: 'Sport Motorcycle',
    price: 150000,
    maxSpeed: 68,
    accel: 42,
    handling: 88,
    color: 0xef4444,
    desc: 'Aerodynamic fully-faired 200cc sport motorcycle with aggressive clip-on handlebars.'
  },
  {
    id: 'dirt_bike',
    name: 'Dirt Trail 250',
    bnName: 'ডার্ট ট্রেইল ২৫০ অফ-রোড',
    bikeClass: 'Dirt Bike',
    price: 180000,
    maxSpeed: 64,
    accel: 44,
    handling: 92,
    color: 0x84cc16,
    desc: 'Long-travel inverted fork suspension, high mudguards, and knobby off-road tires.'
  },
  {
    id: 'cruiser_motorcycle',
    name: 'Buriganga Cruiser 350',
    bnName: 'বুড়িগঙ্গা ক্রুজার ৩৫০',
    bikeClass: 'Cruiser Motorcycle',
    price: 240000,
    maxSpeed: 66,
    accel: 38,
    handling: 74,
    color: 0x1e293b,
    desc: 'Low-slung highway cruiser with wide swept handlebars, chrome pipes, and heavy road presence.'
  },
  {
    id: 'premium_street_bike',
    name: 'Premium Sport 400',
    bnName: 'প্রিমিয়াম স্ট্রিট ফাইটার ৪০০',
    bikeClass: 'Premium Street Motorcycle',
    price: 350000,
    maxSpeed: 76,
    accel: 48,
    handling: 91,
    color: 0x06b6d4,
    desc: 'Modern muscular streetfighter with anodized gold forks, LED projector lamp, and twin-cylinder punch.'
  },
  {
    id: 'vintage_sports_bike',
    name: 'Retro Bengal Cafe 500',
    bnName: 'রেট্রো বেঙ্গল ক্যাফে রেসার ৫০০',
    bikeClass: 'Vintage Sports Bike',
    price: 420000,
    maxSpeed: 78,
    accel: 49,
    handling: 87,
    color: 0xfacc15,
    desc: 'Retro-inspired bullet fairing cafe racer with twin racing stripes and classic analog gauges.'
  },
  {
    id: 'sports_bike',
    name: 'Superbike 600',
    bnName: 'পদ্মা সুপারবাইক ৬০০ আরআর',
    bikeClass: 'Superbike',
    price: 650000,
    maxSpeed: 88,
    accel: 56,
    handling: 95,
    color: 0x10b981,
    desc: 'Flagship inline-4 track-bred superbike with carbon winglets and blistering top speed.'
  }
];

export const VEHICLE_SPECS = {
  // 10 Motorcycles (All mapped from BIKE_SHOWROOM_CATALOG + full physics specs)
  motorcycle: {
    id: 'motorcycle',
    name: 'City Street 125',
    bnName: 'সিটি স্ট্রিট ১২৫ কমিউটার',
    category: 'Motorcycle',
    bikeClass: 'Street Bike',
    isMotorcycle: true,
    price: 45000,
    maxSpeed: 54,
    reverseSpeed: 10,
    accel: 32,
    braking: 48,
    turnSpeed: 3.15,
    mass: 0.55,
    radius: 1.25,
    color: 0x2563eb,
    maxHealth: 85
  },
  scooter: {
    id: 'scooter',
    name: 'Dhanmondi Metro Scooter 110',
    bnName: 'ধানমন্ডি মেট্রো স্কুটার ১১০',
    category: 'Motorcycle',
    bikeClass: 'Scooter',
    isMotorcycle: true,
    price: 65000,
    maxSpeed: 46,
    reverseSpeed: 9,
    accel: 28,
    braking: 45,
    turnSpeed: 3.35,
    mass: 0.45,
    radius: 1.18,
    color: 0xec4899,
    maxHealth: 78
  },
  delivery_scooter: {
    id: 'delivery_scooter',
    name: 'Kacchi Express Delivery 125',
    bnName: 'ডেলিভারি স্কুটার ১২৫ (বক্সসহ)',
    category: 'Motorcycle',
    bikeClass: 'Delivery Scooter',
    isMotorcycle: true,
    price: 75000,
    maxSpeed: 48,
    reverseSpeed: 9,
    accel: 30,
    braking: 46,
    turnSpeed: 3.25,
    mass: 0.5,
    radius: 1.22,
    color: 0xf97316,
    maxHealth: 85
  },
  classic_motorcycle: {
    id: 'classic_motorcycle',
    name: 'Classic Rider 150',
    bnName: 'ক্লাসিক রাইডার ১৫০ ভিন্টেজ',
    category: 'Motorcycle',
    bikeClass: 'Classic Motorcycle',
    isMotorcycle: true,
    price: 85000,
    maxSpeed: 56,
    reverseSpeed: 10,
    accel: 33,
    braking: 47,
    turnSpeed: 2.95,
    mass: 0.65,
    radius: 1.3,
    color: 0x78350f,
    maxHealth: 95
  },
  sport_motorcycle: {
    id: 'sport_motorcycle',
    name: 'Sport X 200',
    bnName: 'স্পোর্ট এক্স ২০০ রেসিং',
    category: 'Motorcycle',
    bikeClass: 'Sport Motorcycle',
    isMotorcycle: true,
    price: 150000,
    maxSpeed: 68,
    reverseSpeed: 12,
    accel: 42,
    braking: 54,
    turnSpeed: 3.25,
    mass: 0.58,
    radius: 1.3,
    color: 0xef4444,
    maxHealth: 90
  },
  dirt_bike: {
    id: 'dirt_bike',
    name: 'Dirt Trail 250',
    bnName: 'ডার্ট ট্রেইল ২৫০ অফ-রোড',
    category: 'Motorcycle',
    bikeClass: 'Dirt Bike',
    isMotorcycle: true,
    price: 180000,
    maxSpeed: 64,
    reverseSpeed: 12,
    accel: 44,
    braking: 52,
    turnSpeed: 3.45,
    mass: 0.52,
    radius: 1.28,
    color: 0x84cc16,
    maxHealth: 100
  },
  cruiser_motorcycle: {
    id: 'cruiser_motorcycle',
    name: 'Buriganga Cruiser 350',
    bnName: 'বুড়িগঙ্গা ক্রুজার ৩৫০',
    category: 'Motorcycle',
    bikeClass: 'Cruiser Motorcycle',
    isMotorcycle: true,
    price: 240000,
    maxSpeed: 66,
    reverseSpeed: 11,
    accel: 38,
    braking: 50,
    turnSpeed: 2.75,
    mass: 0.78,
    radius: 1.4,
    color: 0x1e293b,
    maxHealth: 115
  },
  premium_street_bike: {
    id: 'premium_street_bike',
    name: 'Premium Sport 400',
    bnName: 'প্রিমিয়াম স্ট্রিট ফাইটার ৪০০',
    category: 'Motorcycle',
    bikeClass: 'Premium Street Motorcycle',
    isMotorcycle: true,
    price: 350000,
    maxSpeed: 76,
    reverseSpeed: 13,
    accel: 48,
    braking: 58,
    turnSpeed: 3.35,
    mass: 0.62,
    radius: 1.32,
    color: 0x06b6d4,
    maxHealth: 105
  },
  vintage_sports_bike: {
    id: 'vintage_sports_bike',
    name: 'Retro Bengal Cafe 500',
    bnName: 'রেট্রো বেঙ্গল ক্যাফে রেসার ৫০০',
    category: 'Motorcycle',
    bikeClass: 'Vintage Sports Bike',
    isMotorcycle: true,
    price: 420000,
    maxSpeed: 78,
    reverseSpeed: 13,
    accel: 49,
    braking: 58,
    turnSpeed: 3.2,
    mass: 0.66,
    radius: 1.35,
    color: 0xfacc15,
    maxHealth: 110
  },
  sports_bike: {
    id: 'sports_bike',
    name: 'Superbike 600',
    bnName: 'পদ্মা সুপারবাইক ৬০০ আরআর',
    category: 'Motorcycle',
    bikeClass: 'Superbike',
    isMotorcycle: true,
    price: 650000,
    maxSpeed: 88,
    reverseSpeed: 14,
    accel: 56,
    braking: 64,
    turnSpeed: 3.45,
    mass: 0.64,
    radius: 1.35,
    color: 0x10b981,
    maxHealth: 115
  },

  // Cars
  sedan: {
    id: 'sedan',
    name: 'Dhaka Executive Sedan',
    bnName: 'প্রিমিও প্রাইভেট কার',
    category: 'Car',
    price: 185000,
    maxSpeed: 56,
    reverseSpeed: 18,
    accel: 27,
    braking: 42,
    turnSpeed: 2.35,
    mass: 1.4,
    radius: 2.1,
    color: 0xf8fafc,
    maxHealth: 130
  },
  suv: {
    id: 'suv',
    name: 'Gulshan Prado SUV',
    bnName: 'ল্যান্ড ক্রুজার এসইউভি',
    category: 'Car',
    price: 320000,
    maxSpeed: 58,
    reverseSpeed: 18,
    accel: 28,
    braking: 42,
    turnSpeed: 2.18,
    mass: 2.1,
    radius: 2.3,
    color: 0x1e293b,
    maxHealth: 185
  },
  sports_car: {
    id: 'sports_car',
    name: 'Bengal GT Turbo',
    bnName: 'বেঙ্গল জিটি স্পোর্টস কার',
    category: 'Car',
    price: 540000,
    maxSpeed: 80,
    reverseSpeed: 24,
    accel: 46,
    braking: 58,
    turnSpeed: 2.75,
    mass: 1.35,
    radius: 2.1,
    color: 0xef4444,
    maxHealth: 140
  },
  luxury_car: {
    id: 'luxury_car',
    name: 'Banani Maybach Limo',
    bnName: 'বনানী লাক্সারি লিমুজিন',
    category: 'Car',
    price: 680000,
    maxSpeed: 70,
    reverseSpeed: 20,
    accel: 36,
    braking: 48,
    turnSpeed: 2.3,
    mass: 1.9,
    radius: 2.35,
    color: 0xfbbf24,
    maxHealth: 190
  },
  bmw_m4: {
    id: 'bmw_m4',
    name: 'BMW M4 Competition Coupe',
    bnName: 'বিএমডব্লিউ এম৪ কম্পিটিশন কুপ',
    category: 'Modern Luxury & Sports Car',
    price: 520000,
    maxSpeed: 86,
    reverseSpeed: 24,
    accel: 52,
    braking: 64,
    turnSpeed: 2.85,
    mass: 1.65,
    radius: 2.15,
    color: 0x0284c7,
    maxHealth: 185
  },
  mercedes_amg: {
    id: 'mercedes_amg',
    name: 'Mercedes-Benz S-Class AMG',
    bnName: 'মার্সিডিজ-বেঞ্জ এস-ক্লাস এএমজি লাক্সারি',
    category: 'Modern Luxury & Sports Car',
    price: 580000,
    maxSpeed: 84,
    reverseSpeed: 22,
    accel: 49,
    braking: 62,
    turnSpeed: 2.7,
    mass: 1.9,
    radius: 2.25,
    color: 0x0f172a,
    maxHealth: 210
  },
  audi_r8: {
    id: 'audi_r8',
    name: 'Audi R8 V10 Plus Supercar',
    bnName: 'অডি আর৮ ভি১০ প্লাস সুপারকার',
    category: 'Modern Luxury & Sports Car',
    price: 640000,
    maxSpeed: 90,
    reverseSpeed: 25,
    accel: 56,
    braking: 68,
    turnSpeed: 2.95,
    mass: 1.6,
    radius: 2.15,
    color: 0xdc2626,
    maxHealth: 180
  },
  taxi: {
    id: 'taxi',
    name: 'Dhaka Metro Cab',
    bnName: 'ঢাকা মেট্রো ট্যাক্সি ক্যাব',
    category: 'Car',
    price: 120000,
    maxSpeed: 54,
    reverseSpeed: 18,
    accel: 27,
    braking: 44,
    turnSpeed: 2.45,
    mass: 1.4,
    radius: 2.1,
    color: 0xfacc15,
    maxHealth: 125
  },
  // Public Transit, Vans & Trucks
  bus: {
    id: 'bus',
    name: 'Dhaka City Express Bus',
    bnName: 'ঢাকা সিটি বাস (উত্তরা-মতিঝিল)',
    category: 'Public Transit',
    price: 290000,
    maxSpeed: 46,
    reverseSpeed: 12,
    accel: 16,
    braking: 30,
    turnSpeed: 1.6,
    mass: 4.5,
    radius: 3.4,
    color: 0x15803d,
    maxHealth: 300
  },
  minibus: {
    id: 'minibus',
    name: 'Local Minibus / Delivery Van',
    bnName: 'লোকাল মিনিবাস / ডেলিভারি ভ্যান',
    category: 'Public Transit',
    price: 145000,
    maxSpeed: 48,
    reverseSpeed: 14,
    accel: 20,
    braking: 34,
    turnSpeed: 1.95,
    mass: 2.8,
    radius: 2.6,
    color: 0x0284c7,
    maxHealth: 200
  },
  truck: {
    id: 'truck',
    name: 'Tejgaon Painted Cargo Truck',
    bnName: 'তেজগাঁও কার্গো ট্রাক',
    category: 'Public Transit',
    price: 260000,
    maxSpeed: 45,
    reverseSpeed: 12,
    accel: 17,
    braking: 29,
    turnSpeed: 1.65,
    mass: 4.8,
    radius: 3.1,
    color: 0xd97706,
    maxHealth: 320
  },
  cng: {
    id: 'cng',
    name: 'Dhaka CNG Auto-Rickshaw',
    bnName: 'সিএনজি অটোরিকশা',
    category: 'Public Transit',
    price: 55000,
    maxSpeed: 42,
    reverseSpeed: 12,
    accel: 25,
    braking: 38,
    turnSpeed: 3.05,
    mass: 0.8,
    radius: 1.55,
    color: 0x16a34a,
    maxHealth: 95
  },
  rickshaw: {
    id: 'rickshaw',
    name: 'Traditional Cycle Rickshaw',
    bnName: 'ঐতিহ্যবাহী প্যাডেল রিকশা',
    category: 'Public Transit',
    price: 18000,
    maxSpeed: 24,
    reverseSpeed: 8,
    accel: 16,
    braking: 32,
    turnSpeed: 3.4,
    mass: 0.35,
    radius: 1.35,
    color: 0xd946ef,
    maxHealth: 70
  },
  // Watercraft
  speed_boat: {
    id: 'speed_boat',
    name: 'Hatirjheel Water Taxi Boat',
    bnName: 'হাতিরঝিল ওয়াটার ট্যাক্সি বোট',
    category: 'Boat',
    isBoat: true,
    price: 220000,
    maxSpeed: 58,
    reverseSpeed: 16,
    accel: 30,
    braking: 28,
    turnSpeed: 2.2,
    mass: 1.6,
    radius: 2.2,
    color: 0x06b6d4,
    maxHealth: 150
  }
};

let sharedHeadlightPoolTex = null;
function getHeadlightPoolTexture() {
  if (sharedHeadlightPoolTex) return sharedHeadlightPoolTex;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 95, 4, 64, 55, 58);
  grad.addColorStop(0, 'rgba(254, 249, 195, 0.85)');
  grad.addColorStop(0.45, 'rgba(253, 224, 71, 0.32)');
  grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  sharedHeadlightPoolTex = new THREE.CanvasTexture(canvas);
  return sharedHeadlightPoolTex;
}

const _vehGeoCache = {};
function _vGeo(key, fn) {
  if (!_vehGeoCache[key]) _vehGeoCache[key] = fn();
  return _vehGeoCache[key];
}

const _vehMatCache = {};
function _vMat(key, fn) {
  if (!_vehMatCache[key]) _vehMatCache[key] = fn();
  return _vehMatCache[key];
}

export function computeVehicleSteerDelta(speed, steerInput, effTurn, maxSpeed, isHandbraking, dt, heading = 0, cameraYaw = undefined) {
  if (Math.abs(speed) <= 0.35) return 0;
  const dir = speed >= 0 ? 1 : -1;
  // If the camera is rotated to face the front of the vehicle, invert local yaw delta so A/Left ALWAYS turns Screen-Left and D/Right ALWAYS turns Screen-Right!
  const camAlign = cameraYaw !== undefined ? Math.cos(cameraYaw - (heading + Math.PI)) : 1.0;
  const camSign = camAlign < -0.25 ? -1 : 1;
  const lowSpeedRamp = Math.min(1, Math.abs(speed) / 10);
  const speedNorm = Math.min(1, Math.abs(speed) / Math.max(20, maxSpeed));
  const highSpeedStabilizer = 1 - speedNorm * 0.26;
  const driftBoost = isHandbraking && Math.abs(speed) > 8 ? 1.32 : 1.0;
  return steerInput * camSign * effTurn * lowSpeedRamp * highSpeedStabilizer * driftBoost * dir * dt;
}

export class Vehicle {
  constructor(scene, typeId, x, z, heading = 0, isOccupiedByNPC = false) {
    this.scene = scene;
    this.spec = VEHICLE_SPECS[typeId] || VEHICLE_SPECS.sedan;
    this.typeId = this.spec.id;
    this.isBoat = !!this.spec.isBoat;
    this.isMotorcycle = !!this.spec.isMotorcycle;
    this.x = x;
    this.y = 0;
    this.z = z;
    this.vy = 0;
    this.isAirborne = false;
    this.jumpStartX = x;
    this.jumpStartZ = z;
    this.heading = heading;
    this.speed = 0;
    this.steering = 0;
    this.leanAngle = 0;  // Realistic motorcycle cornering lean / car body roll
    this.pitchAngle = 0; // Dynamic acceleration squat / braking nose-dive pitch
    this.currentSteer = 0;
    this.skidTimer = 0;
    this.skidMeshes = [];
    this.health = this.spec.maxHealth;
    this.maxHealth = this.spec.maxHealth;
    this.driver = isOccupiedByNPC ? 'npc' : null;
    this.headlightsOn = true;
    this.isBraking = false;

    this.customColor = this.spec.color;
    this.paintFinish = 'metallic';
    this.engineLevel = 1;
    this.handlingLevel = 1;
    this.headlightColorHex = 0xfef08a;

    this.bodyMaterial = null;
    this.wheelMaterials = [];
    this.headlightMeshes = [];
    this.headlightBeamGroup = null;
    this.brakelightMeshes = [];
    this.wheels = [];
    this.handlebarPivot = null;
    this.riderMeshGroup = null;
    this.pillionMeshGroup = null;

    this.mesh = this.buildVehicleModel();
    const baseY = this.isBoat ? 0.12 : 0.28;
    if (this.mesh) {
      this.mesh.position.set(this.x, baseY, this.z);
      this.mesh.rotation.y = this.heading;
      if (this.scene) this.scene.add(this.mesh);
    }
  }

  applyCustomization({ colorHex, finish, engineLvl, handlingLvl, headlightHex, rimColorHex }) {
    if (colorHex !== undefined && this.bodyMaterial) {
      this.customColor = colorHex;
      this.bodyMaterial.color.setHex(colorHex);
    }
    if (finish && this.bodyMaterial) {
      this.paintFinish = finish;
      if (finish === 'matte') {
        this.bodyMaterial.roughness = 0.82;
        this.bodyMaterial.metalness = 0.1;
      } else if (finish === 'chrome') {
        this.bodyMaterial.roughness = 0.08;
        this.bodyMaterial.metalness = 0.92;
      } else {
        this.bodyMaterial.roughness = 0.28;
        this.bodyMaterial.metalness = 0.55;
      }
    }
    if (engineLvl) this.engineLevel = engineLvl;
    if (handlingLvl) this.handlingLevel = handlingLvl;
    if (headlightHex !== undefined) {
      this.headlightColorHex = headlightHex;
      for (const hm of this.headlightMeshes) {
        if (!hm.map) hm.color.setHex(headlightHex);
      }
    }
    if (rimColorHex !== undefined) {
      for (const wm of this.wheelMaterials) {
        wm.color.setHex(rimColorHex);
      }
    }
  }

  createLabelTexture(text, bgHex = '#14532d', textHex = '#fde047') {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = textHex;
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 42);
    return new THREE.CanvasTexture(canvas);
  }

  attachHeadlightBeams(group, frontZ, spreadX = 0.65, beamWidth = 4.2, beamLength = 14) {
    if (this.typeId === 'rickshaw' || typeof THREE === 'undefined') return;
    const beamGroup = new THREE.Group();

    const coneMat = new THREE.MeshBasicMaterial({
      color: this.headlightColorHex,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.headlightMeshes.push(coneMat);

    const offsets = spreadX === 0 ? [0] : [-spreadX, spreadX];
    offsets.forEach((ox) => {
      const coneGeo = _vGeo('Cone_' + (beamWidth * 0.36 + '_' + beamLength + '_' + 12 + '_' + 1 + '_' + true), () => new THREE.ConeGeometry(beamWidth * 0.36, beamLength, 12, 1, true));
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI / 2 + 0.07;
      cone.position.set(ox, 0.65, frontZ + beamLength / 2);
      beamGroup.add(cone);
    });

    const poolTex = getHeadlightPoolTexture();
    if (poolTex) {
      const poolMat = new THREE.MeshBasicMaterial({
        map: poolTex,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      this.headlightMeshes.push(poolMat);

      const poolPlane = new THREE.Mesh(
        _vGeo('Plane_' + (beamWidth * 1.4 + '_' + beamLength * 1.15), () => new THREE.PlaneGeometry(beamWidth * 1.4, beamLength * 1.15)),
        poolMat
      );
      poolPlane.rotation.x = -Math.PI / 2;
      poolPlane.position.set(0, 0.05, frontZ + beamLength * 0.55);
      beamGroup.add(poolPlane);
    }

    beamGroup.visible = false;
    group.add(beamGroup);
    this.headlightBeamGroup = beamGroup;
  }

  updateNightLighting(nightBlend = 0) {
    const activeGlow = this.headlightsOn ? nightBlend : 0;
    const showBeams = activeGlow > 0.02;
    if (this.headlightBeamGroup) {
      this.headlightBeamGroup.visible = showBeams;
    }
    if (showBeams) {
      for (let i = 0; i < this.headlightMeshes.length; i++) {
        const mat = this.headlightMeshes[i];
        if (mat.map) {
          mat.opacity = activeGlow * 0.68;
        } else {
          mat.opacity = activeGlow * 0.19;
        }
      }
    }

    for (const bm of this.brakelightMeshes) {
      if (this.isBraking) {
        bm.color.setHex(0xff2222);
      } else if (nightBlend > 0.25) {
        bm.color.setHex(0xdc2626);
      } else {
        bm.color.setHex(0x7f1d1d);
      }
    }
  }

  // Detailed 3D Motorcycle Builder supporting all 10 distinct Motorcycle Classes!
  buildDetailedMotorcycleModel(group, bodyMat, wheelMat, glassMat, headLightMat, brakeLightMat) {
    const chromeMat = _vMat('chrome', () => new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.88, roughness: 0.16 }));
    const darkMetalMat = _vMat('darkMetal', () => new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 }));
    const seatLeatherMat = _vMat('seatLeather', () => new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.75 }));
    const goldForkMat = _vMat('goldFork', () => new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.25 }));

    const isScooter = this.typeId === 'scooter' || this.typeId === 'delivery_scooter';
    const isCruiser = this.typeId === 'cruiser_motorcycle';
    const isDirt = this.typeId === 'dirt_bike';
    const isFairedSport = this.typeId === 'sport_motorcycle' || this.typeId === 'sports_bike' || this.typeId === 'vintage_sports_bike';

    // 1. Front & Rear Spoked / Alloy Wheels + Brake Discs + Tires
    const wheelRadius = isScooter ? 0.31 : isDirt ? 0.42 : 0.37;
    const wheelZFront = isCruiser ? 0.96 : 0.82;
    const wheelZRear = isCruiser ? -0.92 : -0.78;

    [wheelZRear, wheelZFront].forEach((wz, idx) => {
      const wGroup = new THREE.Group();
      const tire = new THREE.Mesh(
        _vGeo('Torus_' + (wheelRadius + '_' + isScooter ? 0.09 : 0.11 + '_' + 10 + '_' + 20), () => new THREE.TorusGeometry(wheelRadius, isScooter ? 0.09 : 0.11, 10, 20)),
        wheelMat
      );
      tire.rotation.y = Math.PI / 2;
      wGroup.add(tire);

      const rim = new THREE.Mesh(
        _vGeo('Cylinder_' + (wheelRadius * 0.68 + '_' + wheelRadius * 0.68 + '_' + 0.08 + '_' + 10), () => new THREE.CylinderGeometry(wheelRadius * 0.68, wheelRadius * 0.68, 0.08, 10)),
         idx === 1 && this.typeId === 'premium_street_bike' ? goldForkMat : chromeMat
      );
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      const disc = new THREE.Mesh(
        _vGeo('Cylinder_' + (wheelRadius * 0.48 + '_' + wheelRadius * 0.48 + '_' + 0.09 + '_' + 12), () => new THREE.CylinderGeometry(wheelRadius * 0.48, wheelRadius * 0.48, 0.09, 12)),
        darkMetalMat
      );
      disc.rotation.z = Math.PI / 2;
      wGroup.add(disc);

      wGroup.position.set(0, wheelRadius, wz);
      group.add(wGroup);
      this.wheels.push(wGroup);
    });

    // 2. Front Telescopic Fork Suspension & Steerable Handlebar Assembly
    const forkGroup = new THREE.Group();
    const forkMat = (this.typeId === 'premium_street_bike' || this.typeId === 'sports_bike' || isDirt) ? goldForkMat : chromeMat;
    [-0.14, 0.14].forEach((fx) => {
      const forkTube = new THREE.Mesh(_vGeo('Cylinder_' + (0.035 + '_' + 0.03 + '_' + 0.88 + '_' + 8), () => new THREE.CylinderGeometry(0.035, 0.03, 0.88, 8)), forkMat);
      forkTube.position.set(fx, 0.72, wheelZFront - 0.12);
      forkTube.rotation.x = isCruiser ? -0.42 : -0.25;
      forkGroup.add(forkTube);
    });

    // Handlebars + Grips + Mirrors
    const barWidth = isCruiser ? 0.85 : isFairedSport ? 0.62 : 0.74;
    const barY = isCruiser ? 1.24 : isFairedSport ? 1.04 : 1.15;
    const handleBar = new THREE.Mesh(_vGeo('Cylinder_' + (0.025 + '_' + 0.025 + '_' + barWidth + '_' + 8), () => new THREE.CylinderGeometry(0.025, 0.025, barWidth, 8)), chromeMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, barY, wheelZFront - 0.24);
    forkGroup.add(handleBar);

    [-barWidth / 2, barWidth / 2].forEach((mx) => {
      const mirrorStem = new THREE.Mesh(_vGeo('Cylinder_' + (0.012 + '_' + 0.012 + '_' + 0.16 + '_' + 6), () => new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6)), darkMetalMat);
      mirrorStem.position.set(mx * 0.9, barY + 0.1, wheelZFront - 0.22);
      forkGroup.add(mirrorStem);
      const mirrorHead = new THREE.Mesh(_vGeo('Sphere_' + (0.055 + '_' + 8 + '_' + 8), () => new THREE.SphereGeometry(0.055, 8, 8)), chromeMat);
      mirrorHead.position.set(mx, barY + 0.18, wheelZFront - 0.22);
      forkGroup.add(mirrorHead);
    });

    // Front Headlight & Windscreen
    const hl = new THREE.Mesh(_vGeo('Sphere_' + (0.14 + '_' + 10 + '_' + 10), () => new THREE.SphereGeometry(0.14, 10, 10)), headLightMat);
    hl.position.set(0, barY - 0.12, wheelZFront + 0.06);
    forkGroup.add(hl);

    if (isFairedSport || isScooter) {
      const visor = new THREE.Mesh(_vGeo('Box_' + (0.42 + '_' + 0.28 + '_' + 0.06), () => new THREE.BoxGeometry(0.42, 0.28, 0.06)), glassMat);
      visor.position.set(0, barY + 0.05, wheelZFront - 0.02);
      visor.rotation.x = -0.45;
      forkGroup.add(visor);
    }

    group.add(forkGroup);
    this.handlebarPivot = forkGroup;

    // 3. Engine Block, Rear Swingarm Suspension & Exhaust Pipe
    const engineBlock = new THREE.Mesh(_vGeo('Box_' + (0.36 + '_' + 0.42 + '_' + 0.55), () => new THREE.BoxGeometry(0.36, 0.42, 0.55)), darkMetalMat);
    engineBlock.position.set(0, 0.52, 0.05);
    group.add(engineBlock);

    // Rear mono-shock spring & swingarm
    const swingarm = new THREE.Mesh(_vGeo('Box_' + (0.28 + '_' + 0.1 + '_' + 0.72), () => new THREE.BoxGeometry(0.28, 0.1, 0.72)), darkMetalMat);
    swingarm.position.set(0, 0.42, -0.45);
    swingarm.rotation.x = 0.12;
    group.add(swingarm);

    const exhaust = new THREE.Mesh(_vGeo('Cylinder_' + (0.055 + '_' + 0.04 + '_' + 0.85 + '_' + 10), () => new THREE.CylinderGeometry(0.055, 0.04, 0.85, 10)), chromeMat);
    exhaust.rotation.x = Math.PI / 2 - 0.18;
    exhaust.position.set(0.22, 0.48, -0.48);
    group.add(exhaust);

    // 4. Sculpted Fuel Tank, Fairings / Step-Through Body & Contoured Seat
    if (isScooter) {
      const floorboard = new THREE.Mesh(_vGeo('Box_' + (0.48 + '_' + 0.14 + '_' + 0.95), () => new THREE.BoxGeometry(0.48, 0.14, 0.95)), darkMetalMat);
      floorboard.position.set(0, 0.36, 0.05);
      group.add(floorboard);

      const frontApron = new THREE.Mesh(_vGeo('Box_' + (0.48 + '_' + 0.75 + '_' + 0.32), () => new THREE.BoxGeometry(0.48, 0.75, 0.32)), bodyMat);
      frontApron.position.set(0, 0.72, 0.52);
      frontApron.rotation.x = -0.18;
      group.add(frontApron);

      const rearCowl = new THREE.Mesh(_vGeo('Box_' + (0.5 + '_' + 0.45 + '_' + 0.85), () => new THREE.BoxGeometry(0.5, 0.45, 0.85)), bodyMat);
      rearCowl.position.set(0, 0.66, -0.42);
      group.add(rearCowl);

      if (this.typeId === 'delivery_scooter') {
        // Thermal Food Delivery Box on rear rack
        const box = new THREE.Mesh(
          _vGeo('Box_' + (0.56 + '_' + 0.52 + '_' + 0.52), () => new THREE.BoxGeometry(0.56, 0.52, 0.52)),
          new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
        );
        box.position.set(0, 1.18, -0.68);
        group.add(box);
      }
    } else {
      // Sculpted Fuel Tank
      const tank = new THREE.Mesh(
        _vGeo('Cylinder_' + (0.22 + '_' + 0.26 + '_' + 0.68 + '_' + 12), () => new THREE.CylinderGeometry(0.22, 0.26, 0.68, 12)),
        bodyMat
      );
      tank.rotation.x = Math.PI / 2 - 0.15;
      tank.position.set(0, isDirt ? 0.98 : 0.88, 0.18);
      tank.castShadow = !this.driver;
      group.add(tank);

      if (isFairedSport) {
        // Full Aerodynamic Side Fairings
        const fairing = new THREE.Mesh(_vGeo('Box_' + (0.52 + '_' + 0.58 + '_' + 0.88), () => new THREE.BoxGeometry(0.52, 0.58, 0.88)), bodyMat);
        fairing.position.set(0, 0.68, 0.28);
        fairing.rotation.x = 0.15;
        group.add(fairing);
      }

      if (isDirt) {
        // High Front Mudguard Beak
        const beak = new THREE.Mesh(_vGeo('Box_' + (0.18 + '_' + 0.06 + '_' + 0.45), () => new THREE.BoxGeometry(0.18, 0.06, 0.45)), bodyMat);
        beak.position.set(0, 0.92, 0.78);
        beak.rotation.x = 0.22;
        group.add(beak);
      }

      // Tail Section
      const tail = new THREE.Mesh(_vGeo('Box_' + (0.34 + '_' + 0.22 + '_' + 0.68), () => new THREE.BoxGeometry(0.34, 0.22, 0.68)), bodyMat);
      tail.position.set(0, isDirt ? 0.96 : isCruiser ? 0.72 : 0.88, -0.52);
      tail.rotation.x = isCruiser ? -0.1 : 0.22;
      group.add(tail);
    }

    // Rider Saddle Seat
    const seat = new THREE.Mesh(_vGeo('Box_' + (0.38 + '_' + 0.14 + '_' + 0.68), () => new THREE.BoxGeometry(0.38, 0.14, 0.68)), seatLeatherMat);
    seat.position.set(0, isDirt ? 0.94 : isCruiser ? 0.72 : 0.84, -0.22);
    group.add(seat);

    // Rear Brake / Tail Light
    const taillight = new THREE.Mesh(_vGeo('Box_' + (0.22 + '_' + 0.12 + '_' + 0.08), () => new THREE.BoxGeometry(0.22, 0.12, 0.08)), brakeLightMat);
    taillight.position.set(0, isDirt ? 0.98 : 0.82, wheelZRear - 0.12);
    group.add(taillight);

    this.attachHeadlightBeams(group, wheelZFront + 0.15, 0, 2.8, 13);

    // Twin Yellow Rear Coil Shock Springs + Yellow License Plate (matching NibYw2Kx-YM 00:00-00:05!)
    [-0.14, 0.14].forEach((sx) => {
      const shock = new THREE.Mesh(_vGeo('Cylinder_' + (0.032 + '_' + 0.032 + '_' + 0.42 + '_' + 8), () => new THREE.CylinderGeometry(0.032, 0.032, 0.42, 8)), goldForkMat);
      shock.position.set(sx, 0.58, wheelZRear + 0.14);
      shock.rotation.x = -0.28;
      group.add(shock);
    });
    const plate = new THREE.Mesh(
      _vGeo('Box_' + (0.22 + '_' + 0.12 + '_' + 0.03), () => new THREE.BoxGeometry(0.22, 0.12, 0.03)),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    plate.position.set(0, 0.66, wheelZRear - 0.15);
    plate.rotation.x = 0.25;
    group.add(plate);

    // 5. Full 14-Joint Anatomical Seated Rider Rig (Tommy Vercetti-style Cyan Tropical Shirt & Blue Jeans!)
    const riderGroup = new THREE.Group();
    const riderRig = buildAnatomicalHumanRig({
      skinHex: 0xc68642,
      hairHex: 0x111827,
      topHex: 0x06b6d4,
      innerHex: 0xf8fafc,
      pantsHex: 0x1d4ed8,
      shoeHex: 0xf8fafc,
      hasBeard: true,
      hasHelmet: false
    });
    if (riderRig.root && riderRig.joints) {
      const rj = riderRig.joints;
      rj.pelvisJoint.position.set(0, isDirt ? 0.92 : isCruiser ? 0.74 : 0.84, -0.18);
      rj.spineJoint.rotation.x = isFairedSport ? 0.36 : isCruiser ? 0.08 : 0.22;
      rj.headGroup.rotation.x = isFairedSport ? -0.28 : -0.12;
      // Pose arms forward gripping handlebars
      rj.leftShoulder.rotation.x = -0.92;
      rj.leftShoulder.rotation.z = 0.16;
      rj.leftElbow.rotation.x = -0.48;
      rj.rightShoulder.rotation.x = -0.92;
      rj.rightShoulder.rotation.z = -0.16;
      rj.rightElbow.rotation.x = -0.48;
      // Pose thighs and knees astride the motorcycle tank & footpegs
      rj.leftHip.rotation.x = -1.05;
      rj.leftHip.rotation.z = -0.26;
      rj.leftKnee.rotation.x = 1.25;
      rj.rightHip.rotation.x = -1.05;
      rj.rightHip.rotation.z = 0.26;
      rj.rightKnee.rotation.x = 1.25;
      riderGroup.add(riderRig.root);
    }

    riderGroup.visible = !!this.driver;
    group.add(riderGroup);
    this.riderMeshGroup = riderGroup;

    // 6. Girlfriend (GF Nadia) Pillion Passenger Rig on Rear Motorcycle Seat (Lazy-built on demand!)
    const pillionGroup = new THREE.Group();
    pillionGroup.visible = false;
    group.add(pillionGroup);
    this.pillionMeshGroup = pillionGroup;
    this._pillionBuilt = false;
  }

  ensurePillionRig() {
    if (this._pillionBuilt || !this.pillionMeshGroup || typeof THREE === 'undefined') return;
    this._pillionBuilt = true;
    const isDirt = this.typeId === 'dirt_bike';
    const isCruiser = this.typeId === 'cruiser_motorcycle';
    const pillionRig = buildAnatomicalHumanRig({
      skinHex: 0xd2996c,
      hairHex: 0x111827,
      topHex: 0xf43f5e,
      innerHex: 0xfdf2f8,
      pantsHex: 0x1e293b,
      shoeHex: 0xf8fafc,
      isFemale: true,
      hasBeard: false,
      hasSunglasses: true
    });
    if (pillionRig.root && pillionRig.joints) {
      const pj = pillionRig.joints;
      pj.pelvisJoint.position.set(0, isDirt ? 0.96 : isCruiser ? 0.78 : 0.88, -0.52);
      pj.spineJoint.rotation.x = 0.24;
      pj.leftShoulder.rotation.x = -0.78;
      pj.leftShoulder.rotation.z = -0.18;
      pj.leftElbow.rotation.x = -0.35;
      pj.rightShoulder.rotation.x = -0.78;
      pj.rightShoulder.rotation.z = -0.18;
      pj.rightElbow.rotation.x = -0.35;
      pj.leftHip.rotation.x = -0.95;
      pj.leftHip.rotation.z = -0.28;
      pj.leftKnee.rotation.x = 1.2;
      pj.rightHip.rotation.x = -0.95;
      pj.rightHip.rotation.z = 0.28;
      pj.rightKnee.rotation.x = 1.2;
      this.pillionMeshGroup.add(pillionRig.root);
    }
  }

  buildVehicleModel() {
    if (typeof THREE === 'undefined') return null;
    const group = new THREE.Group();
    const wheelMat = this.driver === 'npc'
      ? _vMat('npc_wheel', () => new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7, metalness: 0.3 }))
      : new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7, metalness: 0.3 });
    this.wheelMaterials.push(wheelMat);

    const glassMat = _vMat('glass', () => new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.85,
      transparent: true,
      opacity: 0.78
    }));
    const headLightMat = _vMat('headLight', () => new THREE.MeshBasicMaterial({ color: 0xfef9c3 }));
    const brakeLightMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
    this.brakelightMeshes.push(brakeLightMat);

    const isSpecialCar = this.typeId === 'bmw_m4' || this.typeId === 'mercedes_amg' || this.typeId === 'audi_r8' || this.typeId === 'sports_car' || this.typeId === 'luxury_car' || this.typeId === 'suv' || this.typeId === 'sedan' || this.typeId === 'taxi';
    const bodyMat = this.driver === 'npc'
      ? _vMat(`npc_body_${this.typeId}_${this.spec.color}`, () => new THREE.MeshStandardMaterial({
          color: this.spec.color,
          roughness: isSpecialCar ? 0.14 : 0.28,
          metalness: isSpecialCar ? 0.78 : 0.52
        }))
      : new THREE.MeshStandardMaterial({
          color: this.spec.color,
          roughness: 0.28,
          metalness: 0.52
        });
    this.bodyMaterial = bodyMat;

    // 1. All 10 Motorcycle Classes use the Detailed 3D Motorcycle Builder!
    if (this.isMotorcycle) {
      this.buildDetailedMotorcycleModel(group, bodyMat, wheelMat, glassMat, headLightMat, brakeLightMat);
      return group;
    }

    // 2. Watercraft
    if (this.typeId === 'speed_boat') {
      const hull = new THREE.Mesh(_vGeo('Box_' + (2.4 + '_' + 0.85 + '_' + 5.6), () => new THREE.BoxGeometry(2.4, 0.85, 5.6)), bodyMat);
      hull.position.y = 0.45;
      hull.castShadow = !this.driver;
      group.add(hull);

      const bow = new THREE.Mesh(_vGeo('Cone_' + (1.7 + '_' + 2.2 + '_' + 4), () => new THREE.ConeGeometry(1.7, 2.2, 4)), bodyMat);
      bow.rotation.x = Math.PI / 2;
      bow.rotation.z = Math.PI / 4;
      bow.position.set(0, 0.45, 3.6);
      group.add(bow);

      const canopy = new THREE.Mesh(_vGeo('Box_' + (2.0 + '_' + 0.85 + '_' + 2.8), () => new THREE.BoxGeometry(2.0, 0.85, 2.8)), glassMat);
      canopy.position.set(0, 1.15, -0.2);
      group.add(canopy);

      this.attachHeadlightBeams(group, 3.8, 0, 3.8, 15);
      return group;
    }

    // 3. CNG Auto-Rickshaw
    if (this.typeId === 'cng') {
      const chassis = new THREE.Mesh(_vGeo('Box_' + (1.55 + '_' + 0.9 + '_' + 2.55), () => new THREE.BoxGeometry(1.55, 0.9, 2.55)), bodyMat);
      chassis.position.y = 0.65;
      chassis.castShadow = !this.driver;
      group.add(chassis);

      const cageMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.3 });
      const cage = new THREE.Mesh(_vGeo('Box_' + (1.58 + '_' + 0.75 + '_' + 1.8), () => new THREE.BoxGeometry(1.58, 0.75, 1.8)), cageMat);
      cage.position.set(0, 1.45, -0.15);
      group.add(cage);

      const canopy = new THREE.Mesh(
        _vGeo('Box_' + (1.62 + '_' + 0.18 + '_' + 2.3), () => new THREE.BoxGeometry(1.62, 0.18, 2.3)),
        new THREE.MeshStandardMaterial({ color: 0x15803d })
      );
      canopy.position.set(0, 1.88, -0.1);
      group.add(canopy);

      const wind = new THREE.Mesh(_vGeo('Box_' + (1.35 + '_' + 0.68 + '_' + 0.1), () => new THREE.BoxGeometry(1.35, 0.68, 0.1)), glassMat);
      wind.position.set(0, 1.4, 0.92);
      group.add(wind);

      const hl = new THREE.Mesh(_vGeo('Sphere_' + (0.18 + '_' + 8 + '_' + 8), () => new THREE.SphereGeometry(0.18, 8, 8)), headLightMat);
      hl.position.set(0, 0.85, 1.3);
      group.add(hl);

      [-0.55, 0.55].forEach((tx) => {
        const tl = new THREE.Mesh(_vGeo('Box_' + (0.24 + '_' + 0.16 + '_' + 0.08), () => new THREE.BoxGeometry(0.24, 0.16, 0.08)), brakeLightMat);
        tl.position.set(tx, 0.65, -1.29);
        group.add(tl);
      });

      this.attachHeadlightBeams(group, 1.3, 0, 2.8, 11);

      const wFront = new THREE.Mesh(_vGeo('Cylinder_' + (0.32 + '_' + 0.32 + '_' + 0.22 + '_' + 10), () => new THREE.CylinderGeometry(0.32, 0.32, 0.22, 10)), wheelMat);
      wFront.rotation.z = Math.PI / 2;
      wFront.position.set(0, 0.32, 1.15);
      group.add(wFront);
      this.wheels.push(wFront);

      [-0.78, 0.78].forEach((wx) => {
        const wRear = new THREE.Mesh(_vGeo('Cylinder_' + (0.34 + '_' + 0.34 + '_' + 0.24 + '_' + 10), () => new THREE.CylinderGeometry(0.34, 0.34, 0.24, 10)), wheelMat);
        wRear.rotation.z = Math.PI / 2;
        wRear.position.set(wx, 0.34, -0.88);
        group.add(wRear);
        this.wheels.push(wRear);
      });
      return group;
    }

    // 4. Cycle Rickshaw
    if (this.typeId === 'rickshaw') {
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.5 });
      const seat = new THREE.Mesh(
        _vGeo('Box_' + (1.35 + '_' + 0.45 + '_' + 1.1), () => new THREE.BoxGeometry(1.35, 0.45, 1.1)),
        new THREE.MeshStandardMaterial({ color: 0xdc2626 })
      );
      seat.position.set(0, 0.82, -0.45);
      group.add(seat);

      const hood = new THREE.Mesh(
        _vGeo('Cylinder_' + (0.75 + '_' + 0.75 + '_' + 1.4 + '_' + 12 + '_' + 1 + '_' + false + '_' + 0 + '_' + Math.PI), () => new THREE.CylinderGeometry(0.75, 0.75, 1.4, 12, 1, false, 0, Math.PI)),
        bodyMat
      );
      hood.rotation.z = Math.PI / 2;
      hood.position.set(0, 1.25, -0.55);
      group.add(hood);

      const bar = new THREE.Mesh(_vGeo('Cylinder_' + (0.06 + '_' + 0.06 + '_' + 1.1 + '_' + 8), () => new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8)), frameMat);
      bar.position.set(0, 0.9, 0.95);
      group.add(bar);

      const wf = new THREE.Mesh(_vGeo('Cylinder_' + (0.42 + '_' + 0.42 + '_' + 0.08 + '_' + 12), () => new THREE.CylinderGeometry(0.42, 0.42, 0.08, 12)), wheelMat);
      wf.rotation.z = Math.PI / 2;
      wf.position.set(0, 0.42, 1.05);
      group.add(wf);
      this.wheels.push(wf);

      [-0.72, 0.72].forEach((wx) => {
        const wr = new THREE.Mesh(_vGeo('Cylinder_' + (0.45 + '_' + 0.45 + '_' + 0.08 + '_' + 12), () => new THREE.CylinderGeometry(0.45, 0.45, 0.08, 12)), wheelMat);
        wr.rotation.z = Math.PI / 2;
        wr.position.set(wx, 0.45, -0.65);
        group.add(wr);
        this.wheels.push(wr);
      });
      return group;
    }

    // 5. Buses, Minibuses & Cargo Trucks
    if (this.typeId === 'bus' || this.typeId === 'minibus' || this.typeId === 'truck') {
      const isBigBus = this.typeId === 'bus' || this.typeId === 'truck';
      const bw = isBigBus ? 2.85 : 2.3;
      const bh = isBigBus ? 2.85 : 2.15;
      const bl = isBigBus ? 7.8 : 4.8;

      const hull = new THREE.Mesh(_vGeo('Box_' + (bw + '_' + bh + '_' + bl), () => new THREE.BoxGeometry(bw, bh, bl)), bodyMat);
      hull.position.y = bh / 2 + 0.35;
      hull.castShadow = !this.driver;
      group.add(hull);

      const stripe = new THREE.Mesh(
        _vGeo('Box_' + (bw + 0.06 + '_' + 0.45 + '_' + bl + 0.04), () => new THREE.BoxGeometry(bw + 0.06, 0.45, bl + 0.04)),
        new THREE.MeshStandardMaterial({ color: this.typeId === 'truck' ? 0x16a34a : 0xdc2626 })
      );
      stripe.position.y = 1.25;
      group.add(stripe);

      const winBand = new THREE.Mesh(_vGeo('Box_' + (bw + 0.04 + '_' + 0.85 + '_' + bl - 0.5), () => new THREE.BoxGeometry(bw + 0.04, 0.85, bl - 0.5)), glassMat);
      winBand.position.y = bh - 0.35;
      group.add(winBand);

      [-bw * 0.35, bw * 0.35].forEach((hx) => {
        const hl = new THREE.Mesh(_vGeo('Box_' + (0.38 + '_' + 0.26 + '_' + 0.1), () => new THREE.BoxGeometry(0.38, 0.26, 0.1)), headLightMat);
        hl.position.set(hx, 0.85, bl / 2 + 0.03);
        group.add(hl);

        const tl = new THREE.Mesh(_vGeo('Box_' + (0.4 + '_' + 0.26 + '_' + 0.1), () => new THREE.BoxGeometry(0.4, 0.26, 0.1)), brakeLightMat);
        tl.position.set(hx, 0.85, -bl / 2 - 0.03);
        group.add(tl);
      });

      this.attachHeadlightBeams(group, bl / 2 + 0.05, bw * 0.35, 4.8, 16);

      const wheelZ = isBigBus ? [-2.4, 2.4] : [-1.5, 1.5];
      [-bw / 2, bw / 2].forEach((wx) => {
        wheelZ.forEach((wz) => {
          const w = new THREE.Mesh(_vGeo('Cylinder_' + (0.52 + '_' + 0.52 + '_' + 0.32 + '_' + 12), () => new THREE.CylinderGeometry(0.52, 0.52, 0.32, 12)), wheelMat);
          w.rotation.z = Math.PI / 2;
          w.position.set(wx, 0.52, wz);
          group.add(w);
          this.wheels.push(w);
        });
      });
      return group;
    }

    // 6. Modern Sculpted Cars: BMW M4 Competition, Mercedes-Benz AMG, Audi R8 V10, Sports Car, Luxury Car, SUV, Sedan, Taxi
    const isBmw = this.typeId === 'bmw_m4';
    const isMercedes = this.typeId === 'mercedes_amg';
    const isAudi = this.typeId === 'audi_r8';
    const isSuv = this.typeId === 'suv';
    const isSports = this.typeId === 'sports_car' || isBmw || isAudi;
    const isLuxury = this.typeId === 'luxury_car' || isMercedes;

    bodyMat.roughness = 0.14;
    bodyMat.metalness = 0.78;
    const chromeTrimMat = _vMat('chromeTrim', () => new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.12 }));
    const carbonMat = _vMat('carbon', () => new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.32, metalness: 0.55 }));
    const alloyRimMat = _vMat(isBmw || isMercedes ? 'alloyLight' : 'alloyStd', () => new THREE.MeshStandardMaterial({
      color: isBmw || isMercedes ? 0xf8fafc : 0xcbd5e1,
      metalness: 0.88,
      roughness: 0.18
    }));

    const cw = isSuv ? 2.26 : isLuxury ? 2.22 : isSports ? 2.16 : 2.06;
    const ch = isSuv ? 1.02 : isSports ? 0.68 : 0.82;
    const cl = isLuxury ? 5.15 : isBmw ? 4.78 : isSuv ? 4.65 : 4.42;

    // Sculpted Lower Chassis + Aerodynamic Front Splitter & Rear Diffuser
    const lowerBody = new THREE.Mesh(_vGeo('Box_' + (cw + '_' + ch + '_' + cl), () => new THREE.BoxGeometry(cw, ch, cl)), bodyMat);
    lowerBody.position.y = ch / 2 + 0.31;
    lowerBody.castShadow = !this.driver;
    group.add(lowerBody);

    const frontLip = new THREE.Mesh(_vGeo('Box_' + (cw + 0.08 + '_' + 0.12 + '_' + 0.45), () => new THREE.BoxGeometry(cw + 0.08, 0.12, 0.45)), carbonMat);
    frontLip.position.set(0, 0.34, cl / 2 - 0.12);
    group.add(frontLip);

    // Sculpted Hood Bulge / Power Dome
    const hoodDome = new THREE.Mesh(_vGeo('Box_' + (cw * 0.68 + '_' + 0.09 + '_' + cl * 0.32), () => new THREE.BoxGeometry(cw * 0.68, 0.09, cl * 0.32)), bodyMat);
    hoodDome.position.set(0, ch + 0.33, cl * 0.25);
    hoodDome.rotation.x = 0.04;
    group.add(hoodDome);

    // Aerodynamic Cabin with Sloped Front Windshield & Sloped Fastback Rear Glass
    const cabinH = isSuv ? 0.84 : isSports ? 0.54 : 0.68;
    const cabinL = isLuxury ? 2.55 : isSuv ? 2.75 : 1.95;
    const cabin = new THREE.Mesh(_vGeo('Box_' + (cw * 0.84 + '_' + cabinH + '_' + cabinL), () => new THREE.BoxGeometry(cw * 0.84, cabinH, cabinL)), bodyMat);
    cabin.position.set(0, ch + cabinH / 2 + 0.28, isSuv ? -0.22 : -0.18);
    cabin.castShadow = !this.driver;
    group.add(cabin);

    // Panoramic Black Glass Roof on Mercedes / BMW / Luxury / Sports
    if (isMercedes || isBmw || isLuxury || isAudi) {
      const panoRoof = new THREE.Mesh(_vGeo('Plane_' + (cw * 0.78 + '_' + cabinL * 0.88), () => new THREE.PlaneGeometry(cw * 0.78, cabinL * 0.88)), carbonMat);
      panoRoof.rotation.x = -Math.PI / 2;
      panoRoof.position.set(0, ch + cabinH + 0.29, cabin.position.z);
      group.add(panoRoof);
    }

    // Sloped Front Windshield
    const frontGlass = new THREE.Mesh(_vGeo('Box_' + (cw * 0.82 + '_' + cabinH * 0.88 + '_' + 0.12), () => new THREE.BoxGeometry(cw * 0.82, cabinH * 0.88, 0.12)), glassMat);
    frontGlass.position.set(0, ch + cabinH * 0.48 + 0.28, cabin.position.z + cabinL / 2 + 0.18);
    frontGlass.rotation.x = -0.52;
    group.add(frontGlass);

    // Sloped Rear Fastback Window
    const rearGlass = new THREE.Mesh(_vGeo('Box_' + (cw * 0.8 + '_' + cabinH * 0.86 + '_' + 0.12), () => new THREE.BoxGeometry(cw * 0.8, cabinH * 0.86, 0.12)), glassMat);
    rearGlass.position.set(0, ch + cabinH * 0.48 + 0.28, cabin.position.z - cabinL / 2 - 0.2);
    rearGlass.rotation.x = 0.56;
    group.add(rearGlass);

    // Side Windows
    const sideWindows = new THREE.Mesh(_vGeo('Box_' + (cw * 0.86 + '_' + cabinH * 0.72 + '_' + cabinL * 0.92), () => new THREE.BoxGeometry(cw * 0.86, cabinH * 0.72, cabinL * 0.92)), glassMat);
    sideWindows.position.copy(cabin.position);
    group.add(sideWindows);

    // Aerodynamic Side Mirrors (Left & Right)
    [-cw / 2 - 0.12, cw / 2 + 0.12].forEach((mx) => {
      const mirror = new THREE.Mesh(_vGeo('Box_' + (0.24 + '_' + 0.14 + '_' + 0.18), () => new THREE.BoxGeometry(0.24, 0.14, 0.18)), bodyMat);
      mirror.position.set(mx, ch + 0.42, cl * 0.14);
      group.add(mirror);
    });

    // Brand-Specific Front Grilles & Badges (BMW Dual Kidney vs Mercedes Chrome Star vs Audi Honeycomb)
    if (isBmw) {
      [-0.22, 0.22].forEach((kx) => {
        const frame = new THREE.Mesh(_vGeo('Box_' + (0.36 + '_' + 0.34 + '_' + 0.08), () => new THREE.BoxGeometry(0.36, 0.34, 0.08)), chromeTrimMat);
        frame.position.set(kx, 0.68, cl / 2 + 0.02);
        group.add(frame);
        const inner = new THREE.Mesh(_vGeo('Box_' + (0.31 + '_' + 0.29 + '_' + 0.09), () => new THREE.BoxGeometry(0.31, 0.29, 0.09)), carbonMat);
        inner.position.set(kx, 0.68, cl / 2 + 0.025);
        group.add(inner);
      });
      const spoiler = new THREE.Mesh(_vGeo('Box_' + (cw * 0.88 + '_' + 0.07 + '_' + 0.28), () => new THREE.BoxGeometry(cw * 0.88, 0.07, 0.28)), carbonMat);
      spoiler.position.set(0, ch + 0.46, -cl / 2 + 0.18);
      group.add(spoiler);
    } else if (isMercedes || isLuxury) {
      const mGrille = new THREE.Mesh(_vGeo('Box_' + (cw * 0.52 + '_' + 0.36 + '_' + 0.08), () => new THREE.BoxGeometry(cw * 0.52, 0.36, 0.08)), chromeTrimMat);
      mGrille.position.set(0, 0.7, cl / 2 + 0.02);
      group.add(mGrille);
      const starRing = new THREE.Mesh(_vGeo('Torus_' + (0.085 + '_' + 0.015 + '_' + 6 + '_' + 16), () => new THREE.TorusGeometry(0.085, 0.015, 6, 16)), chromeTrimMat);
      starRing.position.set(0, ch + 0.42, cl / 2 - 0.12);
      group.add(starRing);
    } else {
      const stdGrille = new THREE.Mesh(_vGeo('Box_' + (cw * 0.48 + '_' + 0.28 + '_' + 0.08), () => new THREE.BoxGeometry(cw * 0.48, 0.28, 0.08)), carbonMat);
      stdGrille.position.set(0, 0.65, cl / 2 + 0.02);
      group.add(stdGrille);
    }

    if (isSports && !isBmw) {
      const wing = new THREE.Mesh(_vGeo('Box_' + (cw * 0.9 + '_' + 0.08 + '_' + 0.32), () => new THREE.BoxGeometry(cw * 0.9, 0.08, 0.32)), carbonMat);
      wing.position.set(0, ch + 0.52, -cl / 2 + 0.22);
      group.add(wing);
    }

    if (this.typeId === 'taxi') {
      const taxiSign = new THREE.Mesh(
        _vGeo('Box_' + (0.75 + '_' + 0.26 + '_' + 0.3), () => new THREE.BoxGeometry(0.75, 0.26, 0.3)),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      taxiSign.position.set(0, ch + cabinH + 0.42, -0.1);
      group.add(taxiSign);
    }

    // Modern LED Projector Headlights + Full-Width LED Taillight Bar
    [-cw * 0.36, cw * 0.36].forEach((hx) => {
      const hl = new THREE.Mesh(_vGeo('Box_' + (0.42 + '_' + 0.16 + '_' + 0.1), () => new THREE.BoxGeometry(0.42, 0.16, 0.1)), headLightMat);
      hl.position.set(hx, 0.74, cl / 2 + 0.03);
      group.add(hl);

      const tl = new THREE.Mesh(_vGeo('Box_' + (0.46 + '_' + 0.16 + '_' + 0.1), () => new THREE.BoxGeometry(0.46, 0.16, 0.1)), brakeLightMat);
      tl.position.set(hx, 0.78, -cl / 2 - 0.03);
      group.add(tl);
    });
    const ledBar = new THREE.Mesh(_vGeo('Box_' + (cw * 0.78 + '_' + 0.06 + '_' + 0.09), () => new THREE.BoxGeometry(cw * 0.78, 0.06, 0.09)), brakeLightMat);
    ledBar.position.set(0, 0.8, -cl / 2 - 0.03);
    group.add(ledBar);

    this.attachHeadlightBeams(group, cl / 2 + 0.05, cw * 0.35, 4.4, 15);

    // Multi-Spoke Alloy Wheels + Tires
    [-cw / 2, cw / 2].forEach((wx) => {
      [-cl * 0.32, cl * 0.32].forEach((wz) => {
        const wGroup = new THREE.Group();
        const tire = new THREE.Mesh(_vGeo('Cylinder_' + (0.41 + '_' + 0.41 + '_' + 0.28 + '_' + 16), () => new THREE.CylinderGeometry(0.41, 0.41, 0.28, 16)), wheelMat);
        tire.rotation.z = Math.PI / 2;
        wGroup.add(tire);

        const alloy = new THREE.Mesh(_vGeo('Cylinder_' + (0.28 + '_' + 0.28 + '_' + 0.3 + '_' + 12), () => new THREE.CylinderGeometry(0.28, 0.28, 0.3, 12)), alloyRimMat);
        alloy.rotation.z = Math.PI / 2;
        wGroup.add(alloy);

        wGroup.position.set(wx, 0.41, wz);
        group.add(wGroup);
        this.wheels.push(wGroup);
      });
    });

    return group;
  }

  updatePlayerControl(dt, keys, city, sound, onPropertyDamage, onTrafficCollision, allVehicles, cameraYaw, onStuntJumpCompleted) {
    let throttle = 0;
    let brake = false;
    let steerInput = 0;

    if (keys['KeyW'] || keys['ArrowUp']) throttle = 1;
    if (keys['KeyS'] || keys['ArrowDown']) throttle = -1;
    if (keys['KeyA'] || keys['ArrowLeft']) steerInput = 1;
    if (keys['KeyD'] || keys['ArrowRight']) steerInput = -1;
    if (keys['Space']) brake = true;

    this.isBraking = throttle < 0 || brake;
    if (this.riderMeshGroup) {
      this.riderMeshGroup.visible = !!this.driver;
    }

    const speedMult = 1 + (this.engineLevel - 1) * 0.14;
    const accelMult = 1 + (this.engineLevel - 1) * 0.18;
    const turnMult = 1 + (this.handlingLevel - 1) * 0.15;

    const effMaxSpeed = this.spec.maxSpeed * speedMult;
    const effAccel = this.spec.accel * accelMult;
    const effTurn = this.spec.turnSpeed * turnMult;

    if (throttle > 0) {
      if (this.speed < 0) {
        this.speed += this.spec.braking * dt;
      } else {
        this.speed = Math.min(effMaxSpeed, this.speed + effAccel * dt);
      }
    } else if (throttle < 0) {
      if (this.speed > 0) {
        this.speed -= this.spec.braking * dt;
      } else {
        this.speed = Math.max(-this.spec.reverseSpeed, this.speed - effAccel * 0.75 * dt);
      }
    } else {
      this.speed *= Math.pow(this.isBoat ? 0.45 : 0.28, dt);
      if (Math.abs(this.speed) < 0.15) this.speed = 0;
    }

    if (brake) {
      if (Math.abs(this.speed) > 1.2) {
        this.speed -= Math.sign(this.speed) * this.spec.braking * 1.35 * dt;
      } else {
        this.speed = 0;
      }
    }

    this.currentSteer += (steerInput - this.currentSteer) * Math.min(1, dt * 12);

    if (Math.abs(this.speed) > 0.35) {
      this.heading += computeVehicleSteerDelta(
        this.speed,
        this.currentSteer,
        effTurn,
        effMaxSpeed,
        brake,
        dt,
        this.heading,
        cameraYaw
      );
    }

    // Dynamic Motorcycle Leaning, Car Suspension Body Roll & Braking/Acceleration Pitch
    const speedRatio = Math.min(1, Math.abs(this.speed) / 35);
    if (this.isMotorcycle) {
      const targetLean = -this.currentSteer * speedRatio * 0.46;
      this.leanAngle += (targetLean - this.leanAngle) * Math.min(1, dt * 11);
      if (this.handlebarPivot) {
        this.handlebarPivot.rotation.y = this.currentSteer * 0.3;
      }
      const targetPitch = throttle > 0 && this.speed > 4 ? -0.055 * speedRatio : this.isBraking && this.speed > 3 ? 0.065 * speedRatio : 0;
      this.pitchAngle += (targetPitch - this.pitchAngle) * Math.min(1, dt * 9);
    } else {
      const targetRoll = this.currentSteer * speedRatio * 0.055;
      this.leanAngle += (targetRoll - this.leanAngle) * Math.min(1, dt * 9);
      const targetPitch = throttle > 0 && this.speed > 4 ? -0.025 : this.isBraking && this.speed > 3 ? 0.038 : 0;
      this.pitchAngle += (targetPitch - this.pitchAngle) * Math.min(1, dt * 9);
    }

    const dx = Math.sin(this.heading) * this.speed * dt;
    const dz = Math.cos(this.heading) * this.speed * dt;

    if (this.isBoat) {
      const inWater = city.isPointInWater(this.x + dx, this.z + dz);
      if (inWater) {
        this.x += dx;
        this.z += dz;
      } else {
        this.speed *= -0.4;
      }
    } else {
      const col = city.checkCollision(this.x + dx, this.z + dz, this.spec.radius);
      if (col.hit) {
        if (Math.abs(this.speed) > 12) {
          sound.playCollision(Math.min(1, Math.abs(this.speed) / 45));
          this.health = Math.max(15, this.health - Math.abs(this.speed) * 0.28);
        }
        this.speed *= -0.35;
      } else {
        this.x += dx;
        this.z += dz;
      }
    }

    for (const prop of city.destructibles) {
      if (prop.hitCooldown <= 0) {
        const dist = Math.hypot(this.x - prop.mesh.position.x, this.z - prop.mesh.position.z);
        if (dist < this.spec.radius + 0.65 && Math.abs(this.speed) > 5) {
          prop.hitCooldown = 4.0;
          prop.vx = Math.sin(this.heading) * Math.abs(this.speed) * 0.8 + (Math.random() - 0.5) * 6;
          prop.vy = 6 + Math.random() * 4;
          prop.vz = Math.cos(this.heading) * Math.abs(this.speed) * 0.8 + (Math.random() - 0.5) * 6;
          sound.playCollision(0.35);
          if (onPropertyDamage) onPropertyDamage();
        }
      }
    }

    if (allVehicles && !this.isBoat) {
      for (const other of allVehicles) {
        if (other === this || other.isBoat || other.isShowroomDisplay) continue;
        const dist = Math.hypot(this.x - other.x, this.z - other.z);
        const minDist = this.spec.radius + other.spec.radius * 0.85;
        if (dist < minDist && dist > 0.01) {
          const overlap = minDist - dist;
          const nx = (this.x - other.x) / dist;
          const nz = (this.z - other.z) / dist;
          this.x += nx * overlap * 0.6;
          this.z += nz * overlap * 0.6;
          other.x -= nx * overlap * 0.4;
          other.z -= nz * overlap * 0.4;
          if (other.mesh) other.mesh.position.set(other.x, 0.28, other.z);

          if (Math.abs(this.speed) > 16) {
            sound.playCollision(0.6);
            this.health = Math.max(15, this.health - 4);
            if (onTrafficCollision) onTrafficCollision(Math.abs(this.speed));
          }
          this.speed *= 0.55;
        }
      }
    }

    for (const w of this.wheels) {
      w.rotation.x += this.speed * dt * 1.3;
    }

    // Spawn dark Tire Skid Marks on road when leaning/turning hard or handbraking (matching NibYw2Kx-YM 00:01)
    this.skidTimer -= dt;
    if (
      this.scene &&
      typeof THREE !== 'undefined' &&
      !this.isBoat &&
      this.skidTimer <= 0 &&
      Math.abs(this.speed) > 9 &&
      (Math.abs(this.currentSteer) > 0.35 || brake)
    ) {
      this.skidTimer = 0.085;
      const skidMat = _vMat('skid', () => new THREE.MeshBasicMaterial({
        color: 0x090d16,
        transparent: true,
        opacity: 0.52,
        depthWrite: false
      }));
      const skidGeo = _vGeo(this.isMotorcycle ? 'skid_moto' : 'skid_car', () =>
        _vGeo('Plane_' + (this.isMotorcycle ? 0.28 : 1.5 + '_' + 1.35), () => new THREE.PlaneGeometry(this.isMotorcycle ? 0.28 : 1.5, 1.35))
      );
      const skid = new THREE.Mesh(skidGeo, skidMat);
      skid.rotation.x = -Math.PI / 2;
      skid.rotation.z = -this.heading;
      skid.position.set(this.x - Math.sin(this.heading) * 1.1, 0.305, this.z - Math.cos(this.heading) * 1.1);
      skid.updateMatrix();
      skid.matrixAutoUpdate = false;
      this.scene.add(skid);
      this.skidMeshes.push(skid);
      if (this.skidMeshes.length > 22) {
        const oldSkid = this.skidMeshes.shift();
        this.scene.remove(oldSkid);
      }
    }

    // Vice City 3D Stunt Ramp Launch & Airborne Physics
    if (!this.isBoat && city && Array.isArray(city.stuntRamps)) {
      if (!this.isAirborne && Math.abs(this.speed) > 13) {
        for (const ramp of city.stuntRamps) {
          if (Math.hypot(this.x - ramp.x, this.z - ramp.z) < ramp.radius) {
            this.isAirborne = true;
            this.vy = Math.min(24, Math.max(10, Math.abs(this.speed) * 0.34));
            this.y = 0.6;
            this.jumpStartX = this.x;
            this.jumpStartZ = this.z;
            if (sound) sound.playChime('checkpoint');
            break;
          }
        }
      }
    }

    if (this.isAirborne) {
      this.y += this.vy * dt;
      this.vy -= 25 * dt;
      this.pitchAngle = Math.max(-0.45, Math.min(0.45, -this.vy * 0.024));
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isAirborne = false;
        const jumpDist = Math.round(Math.hypot(this.x - this.jumpStartX, this.z - this.jumpStartZ));
        if (jumpDist >= 12 && onStuntJumpCompleted) {
          const bonus = Math.min(50000, Math.round((jumpDist * 450) / 500) * 500);
          onStuntJumpCompleted(jumpDist, bonus);
        }
      }
    }

    if (this.mesh) {
      const baseY = (this.isBoat ? 0.12 + Math.sin(performance.now() * 0.004) * 0.05 : 0.28) + (this.y || 0);
      this.mesh.position.set(this.x, baseY, this.z);
      this.mesh.rotation.order = 'YXZ';
      this.mesh.rotation.y = this.heading;
      this.mesh.rotation.x = this.pitchAngle || 0;
      this.mesh.rotation.z = this.leanAngle;
    }
  }
}

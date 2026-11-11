// src/game.js — Version 5.0 Ultimate Open-World Engine
// Integrates:
// - 3D Walk-In Motorcycle Showroom with 360° Camera Inspection & Purchase Validation ("PURCHASE BIKE" vs "INSUFFICIENT FUNDS")
// - 5 Interactive Retail Shop Categories (Clothing, Convenience, Bike Accessories, Vehicle Repair, General Market)
// - Wallet Balance (৳), Floating "+ ৳500" Cash Pickup Popups, and Income/Expense Transaction Ledger
// - 10 Detailed Motorcycles with Leaning Physics, 14-Joint Anatomical Human Rig, 8-State Police AI, and 2,900x2,900m Map

import { SoundEngine } from './audio.js';
import { DhakaCity, DHAKA_DISTRICTS, SHOP_CATALOGS, CITY_LANDMARK_VENUES, BAR_DRINKS_MENU } from './city.js';
import { PlayerCharacter, PLAYER_OUTFITS, GF_OUTFITS } from './player.js';
import { Vehicle, VEHICLE_SPECS, BIKE_SHOWROOM_CATALOG } from './vehicles.js';
import { TrafficSystem } from './traffic.js';
import { PoliceSystem } from './police.js';
import { MissionSystem } from './missions.js';
import { MinimapRenderer } from './minimap.js';
import { UIManager } from './ui.js';

export const WORLD_MODE_PRESETS = {
  day_morning: {
    mode: 'day',
    subTime: 'morning',
    label: 'Day Mode • Morning (07:30)',
    bnLabel: 'দিনের মোড • স্নিগ্ধ সকাল',
    timeOfDay: 7.5,
    skyHex: 0x60a5fa,
    fogHex: 0x93c5fd,
    fogDensity: 0.0012,
    sunHex: 0xfef08a,
    sunIntensity: 1.18,
    hemiSkyHex: 0xe0f2fe,
    hemiGroundHex: 0x3f6212,
    hemiIntensity: 0.78,
    exposure: 1.08,
    nightBlend: 0.0,
    sunPos: { x: 140, y: 85, z: -60 }
  },
  day_afternoon: {
    mode: 'day',
    subTime: 'afternoon',
    label: 'Day Mode • Afternoon (13:30)',
    bnLabel: 'দিনের মোড • রৌদ্রোজ্জ্বল দুপুর',
    timeOfDay: 13.5,
    skyHex: 0x38bdf8,
    fogHex: 0x7dd3fc,
    fogDensity: 0.001,
    sunHex: 0xffffff,
    sunIntensity: 1.42,
    hemiSkyHex: 0xf0f9ff,
    hemiGroundHex: 0x334155,
    hemiIntensity: 0.88,
    exposure: 1.15,
    nightBlend: 0.0,
    sunPos: { x: 40, y: 195, z: 35 }
  },
  day_sunset: {
    mode: 'day',
    subTime: 'sunset',
    label: 'Day Mode • Evening Sunset (17:45)',
    bnLabel: 'দিনের মোড • গোধূলি সন্ধ্যা',
    timeOfDay: 17.75,
    skyHex: 0xea580c,
    fogHex: 0xf97316,
    fogDensity: 0.0016,
    sunHex: 0xfdba74,
    sunIntensity: 1.05,
    hemiSkyHex: 0xffedd5,
    hemiGroundHex: 0x431407,
    hemiIntensity: 0.68,
    exposure: 1.04,
    nightBlend: 0.28,
    sunPos: { x: -155, y: 52, z: 85 }
  },
  night: {
    mode: 'night',
    subTime: 'night',
    label: 'Night Mode • Dhaka by Night (21:30)',
    bnLabel: 'রাতের মোড • আলোকজ্জ্বল ঢাকা',
    timeOfDay: 21.5,
    skyHex: 0x040814,
    fogHex: 0x060c1e,
    fogDensity: 0.0016,
    sunHex: 0x93c5fd,
    sunIntensity: 0.34,
    hemiSkyHex: 0x1e293b,
    hemiGroundHex: 0x090d16,
    hemiIntensity: 0.36,
    exposure: 0.96,
    nightBlend: 1.0,
    sunPos: { x: -95, y: 145, z: -110 }
  }
};

export class DhakaGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'MAP', 'EMPIRE', 'SHOWROOM', 'SHOP', 'ARRESTED'
    this.keys = {};

    // Camera Orbit State (Classic Vice City-style third-person camera framing)
    this.cameraYaw = 0;
    this.cameraPitch = 0.22;
    this.cameraDistMode = 1;
    this.isPointerDragging = false;
    this.mouseIdleTimer = 2.0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // 3D Bike Showroom Inspection State
    this.inspectedShowroomIndex = 0;
    this.showroomOrbitAngle = 0;

    // Active Shop Modal State & Vice City FM Radio Stations
    this.activeShop = null;
    this.radioStations = [
      '🎵 FLASH DHAKA FM 98.4 — 80s Vice Synthwave',
      '🎵 BANGLA ROCK 101.2 — Underground Guitar',
      '🎵 DESHI BASS 104.0 — Street Hip-Hop Beats',
      '🎵 PURAN DHAKA RETRO 89.6 — Classic Melodies',
      '🔇 RADIO OFF'
    ];
    this.currentRadioIndex = 0;

    // Wallet Transaction History Ledger
    this.walletHistory = [
      { type: 'income', label: 'Starting Dhaka Wallet Balance', amount: 95000 }
    ];

    this.worldMode = 'day';
    this.daySubTime = 'afternoon';
    this.timeOfDay = 13.5;
    this.autoDayNight = false;
    this.weather = 'clear';
    this.passiveIncomeTimer = 15.0;

    this.currentNightBlend = 0.0;
    this.targetNightBlend = 0.0;
    this.currentSkyColor = new THREE.Color(0x38bdf8);
    this.targetSkyColor = new THREE.Color(0x38bdf8);
    this.currentFogColor = new THREE.Color(0x7dd3fc);
    this.targetFogColor = new THREE.Color(0x7dd3fc);
    this.currentSunColor = new THREE.Color(0xffffff);
    this.targetSunColor = new THREE.Color(0xffffff);
    this.currentHemiSky = new THREE.Color(0xf0f9ff);
    this.targetHemiSky = new THREE.Color(0xf0f9ff);
    this.currentHemiGround = new THREE.Color(0x334155);
    this.targetHemiGround = new THREE.Color(0x334155);
    this.targetSunPos = new THREE.Vector3(40, 195, 35);
    this.currentSunOffset = new THREE.Vector3(40, 195, 35);
    this.targetSunIntensity = 1.42;
    this.targetHemiIntensity = 0.88;
    this.targetExposure = 1.15;
    this.targetFogDensity = 0.001;
    this._camTargetPos = new THREE.Vector3();
    this._rainSkyDay = new THREE.Color(0x475569);
    this._rainSkyNight = new THREE.Color(0x050811);
    this._rainFogDay = new THREE.Color(0x64748b);
    this._rainFogNight = new THREE.Color(0x070b16);
    this._lastVehicleNightBlend = -1;
    this._hudUpdateAccumulator = 0;
    this._cachedPrompt = null;

    this.sound = new SoundEngine();
    this.initThreeScene();
    this.createSkyCelestialBodies();

    this.city = new DhakaCity(this.scene);
    this.player = new PlayerCharacter(this.scene, this.city, this.sound);
    this.traffic = new TrafficSystem(this.scene, this.city, this.sound);
    this.police = new PoliceSystem(this.scene, this.city, this.sound);
    this.missions = new MissionSystem(this.scene, this.sound);
    this.minimap = new MinimapRenderer('minimap-canvas', 'full-map-canvas');
    this.ui = new UIManager(this);

    this.createRainParticles();
    this.setupInputListeners();
    this.loadSavedProgress();

    this.setWorldMode(this.worldMode, this.daySubTime, true);

    this.lastFrameTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  recordWalletTransaction(type, label, amount) {
    this.walletHistory.unshift({
      type,
      label,
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (this.walletHistory.length > 25) {
      this.walletHistory.pop();
    }
  }

  // Purchase Motorcycle from the 3D Bike Showroom (Validates Wallet Balance vs Bike Price!)
  purchaseBikeFromShowroom(bikeId) {
    const bikeCatalog = BIKE_SHOWROOM_CATALOG.find((b) => b.id === bikeId);
    if (!bikeCatalog) {
      return { success: false, reason: 'INVALID_BIKE', message: 'Motorcycle not found' };
    }

    if (this.player.ownedVehicles.has(bikeId)) {
      return { success: true, alreadyOwned: true, message: 'ALREADY OWNED' };
    }

    if (this.player.money < bikeCatalog.price) {
      const deficit = bikeCatalog.price - this.player.money;
      return {
        success: false,
        reason: 'INSUFFICIENT_FUNDS',
        deficit,
        message: `INSUFFICIENT FUNDS — Need ৳${deficit.toLocaleString()} more`
      };
    }

    this.player.money -= bikeCatalog.price;
    this.player.ownedVehicles.add(bikeId);
    this.recordWalletTransaction('expense', `Purchased ${bikeCatalog.name}`, bikeCatalog.price);
    this.saveProgress();
    if (this.sound) this.sound.playChime('mission_complete');

    return {
      success: true,
      bike: bikeCatalog,
      remainingBalance: this.player.money,
      message: 'PURCHASE SUCCESSFUL'
    };
  }

  // Purchase Product from any of the 5 Interactive Retail Shops
  purchaseShopItem(shopId, itemId) {
    const shop = SHOP_CATALOGS[shopId];
    if (!shop) return { success: false, reason: 'INVALID_SHOP' };
    const item = shop.items.find((i) => i.id === itemId);
    if (!item) return { success: false, reason: 'INVALID_ITEM' };

    if (this.player.money < item.price) {
      const deficit = item.price - this.player.money;
      return {
        success: false,
        reason: 'INSUFFICIENT_MONEY',
        deficit,
        message: `INSUFFICIENT MONEY — Need ৳${deficit.toLocaleString()} more`
      };
    }

    this.player.money -= item.price;
    this.player.inventory.push(item.id);
    this.recordWalletTransaction('expense', `${shop.name}: ${item.name}`, item.price);

    // Apply item effects immediately
    if (item.outfitId) {
      this.player.ownedOutfits.add(item.outfitId);
      this.player.equipOutfit(item.outfitId);
    }
    if (item.heal) {
      if (item.maxHealthBoost) {
        this.player.maxHealth += item.maxHealthBoost;
      }
      this.player.health = Math.min(this.player.maxHealth, this.player.health + item.heal);
    }
    if (item.clearWanted) {
      this.police.clearWanted();
    }
    if (item.gfBonus && this.player.gf) {
      this.player.addGirlfriendRelationship(item.gfBonus);
    }
    if (this.player.inVehicle) {
      const pv = this.player.inVehicle;
      if (item.repairFull) pv.health = pv.maxHealth;
      if (item.paintHex !== undefined) pv.applyCustomization({ colorHex: item.paintHex });
      if (item.finish) pv.applyCustomization({ finish: item.finish });
      if (item.rimHex !== undefined) pv.applyCustomization({ rimColorHex: item.rimHex });
      if (item.engineBoost) {
        pv.applyCustomization({ engineLvl: Math.min(3, pv.engineLevel + item.engineBoost) });
      }
      if (item.handlingBoost) {
        pv.applyCustomization({ handlingLvl: Math.min(3, pv.handlingLevel + item.handlingBoost) });
      }
    }

    this.saveProgress();
    if (this.sound) this.sound.playChime('mission_complete');
    return {
      success: true,
      item,
      remainingBalance: this.player.money,
      message: 'PURCHASE SUCCESSFUL'
    };
  }

  // Order Drinks, VIP Booths, or Dance with GF Nadia at the Blue Moon Vice Bar & Lounge!
  purchaseBarDrinkOrActivity(drinkId) {
    const item = BAR_DRINKS_MENU.find((d) => d.id === drinkId);
    if (!item) return { success: false, reason: 'INVALID_DRINK' };

    if (this.player.money < item.price) {
      const deficit = item.price - this.player.money;
      return {
        success: false,
        reason: 'INSUFFICIENT_MONEY',
        deficit,
        message: `INSUFFICIENT MONEY — Need ৳${deficit.toLocaleString()} more`
      };
    }

    this.player.money -= item.price;
    this.recordWalletTransaction('expense', `Blue Moon Bar: ${item.name}`, item.price);

    if (item.maxHealthBoost) {
      this.player.maxHealth += item.maxHealthBoost;
    }
    if (item.heal) {
      this.player.health = this.player.maxHealth;
    }
    if (item.armor) {
      this.player.armor = Math.min(100, (this.player.armor || 0) + item.armor);
    }
    if (item.isDance) {
      this.player.danceTimer = 9.0;
    }

    let gfRewardBonus = 0;
    if (item.gfBonus && this.player.gf) {
      const withGfMult = this.player.gf.following ? 1.25 : 1.0;
      const newRel = this.player.addGirlfriendRelationship(Math.round(item.gfBonus * withGfMult));
      if (newRel >= 100) {
        gfRewardBonus = 25000;
        this.player.money += gfRewardBonus;
        this.recordWalletTransaction('income', 'GF Nadia 100% ♥ VIP Date Bonus', gfRewardBonus);
      }
    }

    this.saveProgress();
    if (this.sound) this.sound.playChime('mission_complete');
    return {
      success: true,
      item,
      gfRewardBonus,
      remainingBalance: this.player.money,
      message: gfRewardBonus > 0
        ? `CHEERS! 🍹 +100% ♥ GF LOVE MAXED (+৳${gfRewardBonus.toLocaleString()} VIP BONUS!)`
        : `CHEERS! 🍹 Enjoyed ${item.name} (${item.vibeBoost})!`
    };
  }

  setGPSWaypointToVenue(venue) {
    if (!venue) return;
    this.minimap.customWaypoint = {
      x: venue.doorX,
      z: venue.doorZ,
      label: `${venue.icon} ${venue.shortLabel}: ${venue.name}`,
      color: venue.color
    };
    if (this.sound) this.sound.playChime('ui');
    this.ui.showToast(
      `📍 GPS SET TO ${venue.shortLabel}`,
      `Follow the pink GPS line on the Radar & 3D Arrow to (${venue.doorX}, ${venue.doorZ})!`,
      'cyan'
    );
  }

  teleportToVenueDoor(venue) {
    if (!venue) return;
    this.setGPSWaypointToVenue(venue);
    this.teleportPlayerToDistrict({
      name: `${venue.icon} ${venue.name}`,
      bnName: venue.bnName,
      x: venue.doorX,
      z: venue.doorZ
    });
  }

  initThreeScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2563eb);
    this.scene.fog = new THREE.FogExp2(0x60a5fa, 0.001);

    this.camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.5,
      560
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: window.devicePixelRatio <= 1.25,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.hemiLight = new THREE.HemisphereLight(0xf0f9ff, 0x334155, 0.85);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
    this.dirLight.position.set(120, 180, 90);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 15;
    this.dirLight.shadow.camera.far = 280;
    const d = 75;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLightTarget = new THREE.Object3D();
    this.scene.add(this.dirLightTarget);
    this.dirLight.target = this.dirLightTarget;
    this.scene.add(this.dirLight);

    this.vehicleSpotLight = new THREE.SpotLight(0xfef9c3, 0, 58, Math.PI / 4.2, 0.45, 1.4);
    this.vehicleSpotLight.position.set(0, 1.2, 0);
    this.vehicleSpotLight.visible = false;
    this.vehicleSpotTarget = new THREE.Object3D();
    this.scene.add(this.vehicleSpotTarget);
    this.vehicleSpotLight.target = this.vehicleSpotTarget;
    this.scene.add(this.vehicleSpotLight);

    // 3D Floating Neon Pink GPS Pointer Arrow above player leading straight to selected Map/Radar venue!
    this.gpsArrowGroup = new THREE.Group();
    const arrowCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 1.35, 8),
      new THREE.MeshBasicMaterial({ color: 0xff2a85 })
    );
    arrowCone.rotation.x = Math.PI / 2;
    arrowCone.position.z = 0.5;
    this.gpsArrowGroup.add(arrowCone);
    this.gpsArrowGroup.visible = false;
    this.scene.add(this.gpsArrowGroup);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  createSkyCelestialBodies() {
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.46;
      const r = 680;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.max(45, r * Math.cos(phi));
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    this.starMaterial = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 1.75,
      transparent: true,
      opacity: 0.0,
      fog: false
    });
    this.starField = new THREE.Points(starGeo, this.starMaterial);
    this.scene.add(this.starField);

    this.sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 1.0,
      fog: false
    });
    this.sunDisc = new THREE.Mesh(new THREE.SphereGeometry(18, 16, 16), this.sunMaterial);
    this.scene.add(this.sunDisc);

    this.moonMaterial = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.0,
      fog: false
    });
    this.moonDisc = new THREE.Mesh(new THREE.SphereGeometry(14, 16, 16), this.moonMaterial);
    this.scene.add(this.moonDisc);
  }

  createRainParticles() {
    const rainCount = 1800;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = Math.random() * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.45,
      transparent: true,
      opacity: 0.7
    });
    this.rainSystem = new THREE.Points(geo, mat);
    this.rainSystem.visible = false;
    this.scene.add(this.rainSystem);
  }

  setWorldMode(mode, subTime = null, instant = false) {
    this.worldMode = mode === 'night' ? 'night' : 'day';
    if (subTime && ['morning', 'afternoon', 'sunset'].includes(subTime)) {
      this.daySubTime = subTime;
    }

    const presetKey = this.worldMode === 'night' ? 'night' : `day_${this.daySubTime}`;
    const preset = WORLD_MODE_PRESETS[presetKey] || WORLD_MODE_PRESETS.day_afternoon;

    this.timeOfDay = preset.timeOfDay;
    this.targetNightBlend = preset.nightBlend;
    this.targetSkyColor.setHex(preset.skyHex);
    this.targetFogColor.setHex(preset.fogHex);
    this.targetFogDensity = preset.fogDensity;
    this.targetSunColor.setHex(preset.sunHex);
    this.targetSunIntensity = preset.sunIntensity;
    this.targetHemiSky.setHex(preset.hemiSkyHex);
    this.targetHemiGround.setHex(preset.hemiGroundHex);
    this.targetHemiIntensity = preset.hemiIntensity;
    this.targetExposure = preset.exposure;
    this.targetSunPos.set(preset.sunPos.x, preset.sunPos.y, preset.sunPos.z);

    if (instant) {
      this.currentNightBlend = this.targetNightBlend;
      this.currentSkyColor.copy(this.targetSkyColor);
      this.currentFogColor.copy(this.targetFogColor);
      this.currentSunColor.copy(this.targetSunColor);
      this.currentHemiSky.copy(this.targetHemiSky);
      this.currentHemiGround.copy(this.targetHemiGround);
      this.currentSunOffset.copy(this.targetSunPos);
      this.renderer.toneMappingExposure = this.targetExposure;
    }

    const sliderTime = document.getElementById('slider-time');
    if (sliderTime) sliderTime.value = String(this.timeOfDay);
    const timeLabel = document.getElementById('label-time-val');
    if (timeLabel) {
      const hrs = Math.floor(this.timeOfDay);
      const mins = Math.floor((this.timeOfDay - hrs) * 60);
      timeLabel.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    if (this.ui && typeof this.ui.syncModeButtons === 'function') {
      this.ui.syncModeButtons(this.worldMode, this.daySubTime);
    }
  }

  toggleDayNightMode() {
    if (this.worldMode === 'day') {
      this.setWorldMode('night');
      this.ui.showToast(
        '🌙 NIGHT MODE ACTIVATED',
        'রাতের ঢাকা • Moonlight, street lights, glowing Bengali neon signs & vehicle headlights enabled!',
        'cyan'
      );
    } else {
      this.setWorldMode('day', this.daySubTime);
      const preset = WORLD_MODE_PRESETS[`day_${this.daySubTime}`];
      this.ui.showToast(
        `☀️ ${preset.label.toUpperCase()}`,
        `${preset.bnLabel} • Natural sunlight, sky & daytime shadows active!`,
        'gold'
      );
    }
    this.sound.playChime('ui');
  }

  cycleDaySubTime() {
    const order = ['morning', 'afternoon', 'sunset'];
    const nextIdx = (order.indexOf(this.daySubTime) + 1) % order.length;
    this.setWorldMode('day', order[nextIdx]);
    const preset = WORLD_MODE_PRESETS[`day_${this.daySubTime}`];
    this.ui.showToast(`☀️ ${preset.label.toUpperCase()}`, preset.bnLabel, 'gold');
    this.sound.playChime('ui');
  }

  openBikeShowroomModal(bikeIndex = 0) {
    this.inspectedShowroomIndex = (bikeIndex + this.city.showroomBikes.length) % this.city.showroomBikes.length;
    this.state = 'SHOWROOM';
    document.getElementById('map-overlay').classList.add('hidden');
    document.getElementById('empire-overlay').classList.add('hidden');
    const shopEl = document.getElementById('shop-overlay');
    if (shopEl) shopEl.classList.add('hidden');
    const srEl = document.getElementById('showroom-overlay');
    if (srEl) srEl.classList.remove('hidden');
    this.ui.renderBikeShowroomModal();
    this.sound.playChime('ui');
  }

  closeBikeShowroomModal() {
    const srEl = document.getElementById('showroom-overlay');
    if (srEl) srEl.classList.add('hidden');
    this.state = 'PLAYING';
    this.sound.playChime('ui');
  }

  openShopModal(shop) {
    this.activeShop = shop;
    this.state = 'SHOP';
    const shopEl = document.getElementById('shop-overlay');
    if (shopEl) shopEl.classList.remove('hidden');
    this.ui.renderInteractiveShopModal(shop);
    this.sound.playChime('ui');
  }

  closeShopModal() {
    const shopEl = document.getElementById('shop-overlay');
    if (shopEl) shopEl.classList.add('hidden');
    this.activeShop = null;
    this.state = 'PLAYING';
    this.sound.playChime('ui');
  }

  setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.sound.resume();
      this.keys[e.code] = true;

      if (e.code === 'Escape') {
        if (this.state === 'MAP') {
          this.toggleMapModal(false);
        } else if (this.state === 'EMPIRE') {
          this.toggleEmpireModal(false);
        } else if (this.state === 'SHOWROOM') {
          this.closeBikeShowroomModal();
        } else if (this.state === 'SHOP') {
          this.closeShopModal();
        } else if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          this.togglePauseMenu();
        }
      } else if (e.code === 'KeyM' && (this.state === 'PLAYING' || this.state === 'MAP')) {
        this.toggleMapModal();
      } else if ((e.code === 'KeyG' || e.code === 'KeyO') && (this.state === 'PLAYING' || this.state === 'EMPIRE')) {
        this.toggleEmpireModal();
      } else if (e.code === 'KeyN' && this.state === 'PLAYING') {
        this.toggleDayNightMode();
      } else if (this.state === 'SHOWROOM' && (e.code === 'ArrowLeft' || e.code === 'KeyA')) {
        this.openBikeShowroomModal(this.inspectedShowroomIndex - 1);
      } else if (this.state === 'SHOWROOM' && (e.code === 'ArrowRight' || e.code === 'KeyD')) {
        this.openBikeShowroomModal(this.inspectedShowroomIndex + 1);
      } else if ((e.code === 'KeyV' || e.code === 'KeyC') && this.state === 'PLAYING') {
        this.cycleCameraDistance();
      } else if (e.code === 'KeyT' && this.state === 'PLAYING') {
        this.cycleDaySubTime();
      } else if (e.code === 'KeyL' && this.state === 'PLAYING' && this.player.inVehicle) {
        this.player.inVehicle.headlightsOn = !this.player.inVehicle.headlightsOn;
        this.sound.playChime('ui');
        this.ui.showToast(
          this.player.inVehicle.headlightsOn ? '💡 HEADLIGHTS ON' : '💡 HEADLIGHTS OFF',
          'Press [L] to toggle vehicle headlights.',
          'cyan'
        );
      } else if (this.state === 'PLAYING') {
        if (e.code === 'KeyE') this.handleInteractKeyE();
        if (e.code === 'KeyF') this.handleExitKeyF();
        if (e.code === 'KeyH') this.handleHornKeyH();
        if (e.code === 'KeyP') this.handlePhotoKeyP();
        if (e.code === 'KeyB') this.handleTeaStallPurchase();
        if (e.code === 'KeyQ' || e.code === 'KeyX') this.handleMeleeKnockdownKeyQ();
        if (e.code === 'KeyR' && this.player.inVehicle) {
          this.currentRadioIndex = (this.currentRadioIndex + 1) % this.radioStations.length;
          this.sound.playChime('ui');
          this.ui.showToast(this.radioStations[this.currentRadioIndex], 'Press [R] to switch FM Radio Station', 'cyan');
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.sound.resume();
      this.isPointerDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isPointerDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerDragging || this.state !== 'PLAYING') return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      this.mouseIdleTimer = 0;
      this.cameraYaw -= dx * 0.0065;
      this.cameraPitch = Math.max(0.08, Math.min(1.15, this.cameraPitch + dy * 0.005));
    });
  }

  startNewOrContinue(loadExisting = false) {
    this.sound.resume();
    this.sound.playChime('ui');

    if (!loadExisting) {
      if (this.player.inVehicle) this.player.exitVehicle();
      this.player.x = -38;
      this.player.z = 72; // Starts right in front of the 3D Dhaka Motorcycle Showroom & Shahbagh Hub!
      this.player.heading = Math.PI;
      this.cameraYaw = 0;
      if (this.player.mesh) this.player.mesh.rotation.y = this.player.heading;
      this.player.health = 100;
      this.player.money = 95000;
      this.police.clearWanted();
      this.missions.cancelMission();
    } else {
      this.loadSavedProgress();
    }

    document.getElementById('main-menu-overlay').classList.add('hidden');
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('hud-layer').classList.remove('hidden');
    this.state = 'PLAYING';

    this.ui.showToast(
      `WELCOME TO DHAKA STREETS v5.0`,
      'Walk into the 3D Motorcycle Showroom right beside you and press [E] to inspect & buy any of the 10 Motorcycles!',
      'emerald'
    );
  }

  togglePauseMenu(forceState) {
    const pauseEl = document.getElementById('pause-overlay');
    const shouldPause = forceState !== undefined ? forceState : this.state === 'PLAYING';
    if (shouldPause) {
      this.state = 'PAUSED';
      pauseEl.classList.remove('hidden');
    } else {
      this.state = 'PLAYING';
      pauseEl.classList.add('hidden');
    }
    this.sound.playChime('ui');
  }

  toggleMapModal(forceState) {
    const mapEl = document.getElementById('map-overlay');
    const shouldOpen = forceState !== undefined ? forceState : this.state !== 'MAP';
    if (shouldOpen) {
      this.state = 'MAP';
      document.getElementById('empire-overlay').classList.add('hidden');
      mapEl.classList.remove('hidden');
      this.minimap.renderFullCityMap(this.player, this.city, this.police, this.missions);
    } else {
      this.state = 'PLAYING';
      mapEl.classList.add('hidden');
    }
    this.sound.playChime('ui');
  }

  toggleEmpireModal(forceState) {
    const empEl = document.getElementById('empire-overlay');
    if (!empEl) return;
    const shouldOpen = forceState !== undefined ? forceState : this.state !== 'EMPIRE';
    if (shouldOpen) {
      this.state = 'EMPIRE';
      document.getElementById('map-overlay').classList.add('hidden');
      empEl.classList.remove('hidden');
      this.ui.renderEmpireAndGarageModal();
    } else {
      this.state = 'PLAYING';
      empEl.classList.add('hidden');
    }
    this.sound.playChime('ui');
  }

  returnToMainMenu() {
    this.saveProgress();
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('map-overlay').classList.add('hidden');
    const empEl = document.getElementById('empire-overlay');
    if (empEl) empEl.classList.add('hidden');
    const srEl = document.getElementById('showroom-overlay');
    if (srEl) srEl.classList.add('hidden');
    const shEl = document.getElementById('shop-overlay');
    if (shEl) shEl.classList.add('hidden');
    document.getElementById('hud-layer').classList.add('hidden');
    document.getElementById('main-menu-overlay').classList.remove('hidden');
    this.ui.showMenuPanel('panel-main');
    this.state = 'MENU';
  }

  toggleMute() {
    this.sound.setMuted(!this.sound.muted);
    const btn = document.getElementById('btn-hud-mute');
    if (btn) btn.textContent = this.sound.muted ? '🔇' : '🔊';
  }

  cycleCameraDistance() {
    this.cameraDistMode = (this.cameraDistMode + 1) % 3;
    this.sound.playChime('ui');
  }

  setTimeOfDay(val) {
    this.timeOfDay = ((val % 24) + 24) % 24;
    if (this.timeOfDay >= 19 || this.timeOfDay < 5.5) {
      this.setWorldMode('night');
    } else if (this.timeOfDay < 11) {
      this.setWorldMode('day', 'morning');
    } else if (this.timeOfDay < 16.5) {
      this.setWorldMode('day', 'afternoon');
    } else {
      this.setWorldMode('day', 'sunset');
    }
    this.timeOfDay = ((val % 24) + 24) % 24;
  }

  setWeather(weatherType) {
    this.weather = weatherType;
    if (this.rainSystem) {
      this.rainSystem.visible = weatherType === 'rain';
    }
    if (weatherType === 'sunset') {
      this.setWorldMode('day', 'sunset');
    }
  }

  teleportPlayerToDistrict(district) {
    if (this.player.inVehicle) {
      if (this.player.inVehicle.isBoat && !this.city.isPointInWater(district.x, district.z)) {
        this.player.exitVehicle();
      } else {
        this.player.inVehicle.x = district.x;
        this.player.inVehicle.z = district.z;
        this.player.inVehicle.speed = 0;
        if (this.player.inVehicle.mesh) {
          this.player.inVehicle.mesh.position.set(district.x, 0.28, district.z);
        }
      }
    }
    this.player.x = district.x;
    this.player.z = district.z;
    if (this.player.mesh) this.player.mesh.position.set(district.x, 0, district.z);
    this.toggleMapModal(false);
    this.ui.showToast(`FAST TRAVELED TO ${district.name.toUpperCase()}`, district.bnName, 'emerald');
  }

  spawnVehicleForPlayer(typeId) {
    const spec = VEHICLE_SPECS[typeId];
    if (!spec) return;

    let spawnX = this.player.x + Math.sin(this.player.heading) * 5.0;
    let spawnZ = this.player.z + Math.cos(this.player.heading) * 5.0;

    // If inside the Showroom building, spawn outside in the Showroom Parking Bay
    if (Math.hypot(this.player.x - this.city.showroomCenter.x, this.player.z - this.city.showroomCenter.z) < 22) {
      spawnX = -32;
      spawnZ = 72;
    }

    if (spec.isBoat && !this.city.isPointInWater(spawnX, spawnZ)) {
      spawnX = 262;
      spawnZ = -10;
      this.player.x = spawnX;
      this.player.z = spawnZ;
    }

    const v = new Vehicle(this.scene, typeId, spawnX, spawnZ, this.player.heading, false);
    this.traffic.vehicles.push(v);
    if (this.player.inVehicle) this.player.exitVehicle();
    this.player.enterVehicle(v);
    this.cameraYaw = v.heading + Math.PI;
    this.toggleMapModal(false);
    this.toggleEmpireModal(false);
    this.closeBikeShowroomModal();
    this.ui.showToast(`RIDING / DRIVING: ${v.spec.name.toUpperCase()}`, `${v.spec.bnName} ready!`, 'gold');
  }

  purchaseOrUpgradeProperty(propId) {
    const prop = this.city.properties.find((p) => p.id === propId);
    if (!prop) return false;

    if (!prop.owned) {
      if (this.player.money < prop.price) {
        this.ui.showToast('INSUFFICIENT FUNDS', `Need ৳${prop.price.toLocaleString()} to purchase ${prop.name}.`, 'crimson');
        return false;
      }
      this.player.money -= prop.price;
      prop.owned = true;
      prop.level = 1;
      if (prop.ringMat) prop.ringMat.color.setHex(0x10b981);
      this.recordWalletTransaction('expense', `Bought Property: ${prop.name}`, prop.price);
      this.sound.playChime('mission_complete');
      this.saveProgress();
      this.ui.showToast(
        `🏢 PROPERTY PURCHASED: ${prop.name}`,
        `Generating +৳${prop.incomePerMin.toLocaleString()}/min passive income!`,
        'emerald'
      );
      return true;
    } else if (prop.level < 3) {
      const cost = prop.upgradeCost * prop.level;
      if (this.player.money < cost) {
        this.ui.showToast('INSUFFICIENT FUNDS', `Need ৳${cost.toLocaleString()} to upgrade ${prop.name}.`, 'crimson');
        return false;
      }
      this.player.money -= cost;
      prop.level++;
      prop.incomePerMin = Math.round(prop.incomePerMin * 1.45);
      this.recordWalletTransaction('expense', `Upgraded ${prop.name} Lv.${prop.level}`, cost);
      this.sound.playChime('mission_complete');
      this.saveProgress();
      this.ui.showToast(
        `⬆️ BUSINESS UPGRADED TO LEVEL ${prop.level}`,
        `${prop.name} now generates +৳${prop.incomePerMin.toLocaleString()}/min!`,
        'gold'
      );
      return true;
    }
    return false;
  }

  handleInteractKeyE() {
    // 0A. Check if near a 3D VIP Date Table inside the Walk-In Blue Moon Bar ("Press E to Sit & Have Drinks with GF")
    const nearBarTable = this.city.getNearestBarDateTable(this.player.x, this.player.z, 4.5);
    if (nearBarTable) {
      this.player.sitAtVIPDateTable(nearBarTable.x, nearBarTable.z, 'Blue Moon Vice Bar');
      this.openShopModal({
        id: 'bar_lounge',
        name: 'Blue Moon Vice Bar — Seated at VIP Table',
        bnName: 'ভিআইপি টেবিলে গার্লফ্রেন্ড নাদিয়ার সাথে ডেটিং ও ড্রিংকস',
        category: '🍸 Bar & GF Lounge'
      });
      return;
    }

    // 0B. Check if near one of the 5 Walk-In Interior Boutiques inside the Grand Shopping Mall
    const nearMallStall = this.city.getNearestMallInteriorShop(this.player.x, this.player.z, 4.2);
    if (nearMallStall) {
      if (nearMallStall.id === 'gf_dresses') {
        this.openShopModal({
          id: 'gf_dresses',
          name: 'GF Nadia Glamorous Dress & Bridal Boutique',
          bnName: 'নাদিয়ার গ্ল্যামারাস পার্টি ড্রেস বুটিক',
          category: '👗 GF Nadia Dresses'
        });
      } else {
        this.openShopModal(SHOP_CATALOGS[nearMallStall.id] || SHOP_CATALOGS.clothing);
      }
      return;
    }

    // 1. Check if near a Displayed Motorcycle inside the 3D Walk-In Bike Showroom ("Press E to View Bike")
    const nearShowroomBike = this.city.getNearestShowroomBike(this.player.x, this.player.z, 4.2);
    if (nearShowroomBike) {
      const idx = this.city.showroomBikes.indexOf(nearShowroomBike);
      this.openBikeShowroomModal(idx >= 0 ? idx : 0);
      return;
    }

    // 2. Check if at any of the 6 Major Landmark Venues (Bike Showroom Entrance, Grand Shopping Mall, Blue Moon Vice Bar, GF Nadia Villa, Restaurant, Customs Garage)
    const nearVenue = this.city.getNearestLandmarkVenue(this.player.x, this.player.z, 9.5);
    if (nearVenue) {
      if (nearVenue.type === 'showroom') {
        this.openBikeShowroomModal(0);
        return;
      } else if (nearVenue.type === 'mall') {
        this.openShopModal(SHOP_CATALOGS.clothing);
        return;
      } else if (nearVenue.type === 'bar') {
        this.openShopModal({ id: 'bar_lounge', name: nearVenue.name, bnName: nearVenue.bnName, category: '🍸 Bar & GF Lounge' });
        return;
      } else if (nearVenue.type === 'gf_spot') {
        const isFollowing = this.player.toggleGirlfriendCompanion(true);
        this.sound.playChime('mission_complete');
        this.ui.showToast(
          `💖 GF NADIA JOINED YOUR DATE! (♥ ${this.player.gf.relationship}%)`,
          'Nadia will now ride on your bike/car with you! Take her to the Blue Moon Bar (🍸) or Shopping Mall (🛍️)!',
          'emerald'
        );
        this.setGPSWaypointToVenue(CITY_LANDMARK_VENUES[2]); // Point GPS straight to the Blue Moon Bar!
        return;
      } else if (nearVenue.type === 'restaurant') {
        this.openShopModal(SHOP_CATALOGS.convenience);
        return;
      } else if (nearVenue.type === 'repair') {
        this.openShopModal(SHOP_CATALOGS.repair_shop);
        return;
      }
    }

    // 3. Check if near one of the 5 Interactive Retail Shops
    const nearShop = this.city.getNearestInteractiveShop(this.player.x, this.player.z, 6.8);
    if (nearShop) {
      this.openShopModal(nearShop);
      return;
    }

    // 3. Near Mission Starter
    const nearMission = this.missions.getNearestStartMarker(this.player.x, this.player.z);
    if (nearMission) {
      this.missions.startMission(nearMission.id, (t, s, c) => this.ui.showToast(t, s, c));
      return;
    }

    // 4. Near Purchasable Property Kiosk
    for (const prop of this.city.properties) {
      if (Math.hypot(this.player.x - prop.x, this.player.z - prop.z) < 6.5) {
        this.purchaseOrUpgradeProperty(prop.id);
        return;
      }
    }

    // 5. Near Commercial Store Register
    for (const st of this.city.stores) {
      if (Math.hypot(this.player.x - st.x, this.player.z - st.z) < 6.5) {
        if (st.robbedCooldown > 0) {
          this.ui.showToast(
            'STORE REGISTER LOCKED',
            `${st.name} security shutters are active for ${Math.ceil(st.robbedCooldown)}s.`,
            'crimson'
          );
          return;
        }
        st.robbedCooldown = 90;
        const payout = st.payout;
        this.player.money += payout;
        this.recordWalletTransaction('income', `Arcade Vault Encounter: ${st.name}`, payout);
        this.player.triggerInteractionGesture();
        this.sound.playChime('mission_complete');
        this.ui.showFloorCashPopup(`+ ৳${payout.toLocaleString()}`);
        this.ui.showToast(
          `💰 STORE VAULT COLLECTED: +৳${payout.toLocaleString()}`,
          `${st.name} triggered a 2-Star Police Alert! Escape the area!`,
          'gold'
        );
        this.police.reportCrime(
          38,
          `Store Alarm at ${st.name}`,
          (lvl, r) => this.ui.showToast(`WANTED LEVEL ★${lvl}`, r, 'crimson'),
          this.player.x,
          this.player.z
        );
        this.saveProgress();
        return;
      }
    }

    if (this.player.inVehicle) return;

    // 6. Enter Nearby Driveable Vehicle or Boat (excluding locked Showroom display models)
    let bestVeh = null;
    let bestDist = 7.0;
    for (const v of this.traffic.vehicles) {
      if (v.isShowroomDisplay) continue;
      const d = Math.hypot(this.player.x - v.x, this.player.z - v.z);
      if (d < bestDist) {
        bestDist = d;
        bestVeh = v;
      }
    }

    if (bestVeh) {
      const wasOccupiedByNPC = bestVeh.driver === 'npc';
      this.player.enterVehicle(bestVeh);
      this.cameraYaw = bestVeh.heading + Math.PI;

      if (wasOccupiedByNPC) {
        this.police.reportCrime(
          22,
          'Commandeering an NPC Vehicle in Traffic',
          (lvl, reason) => {
            this.ui.showToast(`WANTED LEVEL ★${lvl}`, reason, 'crimson');
          },
          this.player.x,
          this.player.z
        );
      } else {
        this.ui.showToast(`RIDING / DRIVING: ${bestVeh.spec.name}`, bestVeh.spec.bnName, 'emerald');
      }
      return;
    }

    // 7. Vice City-Style On-Foot Pedestrian Takedown -> Transfers their full dynamic ৳1,000–৳200,000 cash immediately!
    const nearNPC = this.traffic.findNearestInteractableNPC(this.player.x, this.player.z, 5.2);
    if (nearNPC) {
      this.handleMeleeKnockdownKeyQ();
    }
  }

  handleMeleeKnockdownKeyQ() {
    if (this.player.inVehicle) return;
    const nearNPC = this.traffic.findNearestInteractableNPC(this.player.x, this.player.z, 5.2);
    if (!nearNPC) return;
    const res = this.traffic.interactWithNPC(nearNPC, this.player);
    if (res.success) {
      this.player.triggerInteractionGesture();
      this.recordWalletTransaction('income', `Street Takedown (${res.role})`, res.amount);
      this.sound.playChime('mission_complete');
      this.ui.showFloorCashPopup(`+ ৳${res.amount.toLocaleString()}`);
      this.ui.showToast(
        `💵 +৳${res.amount.toLocaleString()} COLLECTED!`,
        `Took ${res.role}'s cash! Wallet: ৳${Math.floor(this.player.money).toLocaleString()}`,
        'emerald'
      );
      this.police.reportCrime(
        15,
        `Street Mugging Reported (${res.role})`,
        (lvl, reason) => this.ui.showToast(`WANTED LEVEL ★${lvl}`, reason, 'crimson'),
        this.player.x,
        this.player.z
      );
      this.saveProgress();
    }
  }

  handleExitKeyF() {
    if (this.player.isSeatedAtTable) {
      this.player.standUpFromDateTable();
      this.ui.showToast('STOOD UP FROM VIP TABLE', 'Walk around the Bar or exit to the street.', 'cyan');
      return;
    }
    if (this.player.inVehicle) {
      const exited = this.player.exitVehicle();
      if (exited) {
        this.ui.showToast('EXITED VEHICLE', 'Exploring Dhaka on foot. Press [E] to re-enter.', 'cyan');
      }
    }
  }

  handleHornKeyH() {
    if (this.player.inVehicle) {
      this.sound.playHorn(this.player.inVehicle.typeId, 1.0);
    } else {
      this.sound.playHorn('rickshaw', 0.5);
    }
    this.traffic.triggerHornReaction(this.player.x, this.player.z, 26);
  }

  handlePhotoKeyP() {
    if (this.missions.canSnapPhoto(this.player)) {
      this.missions.triggerPhotoSnap(
        this.player,
        (t, s, c) => this.ui.showToast(t, s, c),
        (finished, reward) => {
          if (reward) this.recordWalletTransaction('income', `Mission: ${finished.title}`, reward);
          this.saveProgress();
        }
      );
    } else {
      this.sound.playChime('camera_shutter');
      const dist = this.city.getDistrictAt(this.player.x, this.player.z);
      this.ui.showToast(`📸 SNAPSHOT: ${dist.name}`, `${dist.bnName} captured!`, 'cyan');
    }
  }

  handleTeaStallPurchase() {
    for (const st of this.city.teaStalls) {
      if (Math.hypot(this.player.x - st.x, this.player.z - st.z) < 8.5) {
        if (this.player.money >= 200) {
          this.player.money -= 200;
          this.recordWalletTransaction('expense', `Mama Cha & Repair at ${st.name}`, 200);
          this.player.health = this.player.maxHealth;
          if (this.player.inVehicle) {
            this.player.inVehicle.health = this.player.inVehicle.maxHealth;
          }
          if (this.police.wantedLevel > 0) {
            this.police.clearWanted();
          }
          this.sound.playChime('mission_complete');
          this.ui.showToast(
            `☕ MAMA CHA & FUCHKA (-৳200)`,
            `Restored 100% health/vehicle condition & cleared police wanted level at ${st.name}!`,
            'emerald'
          );
        }
        return;
      }
    }
  }

  triggerArrestScreen() {
    this.state = 'ARRESTED';
    const fine = Math.min(this.player.money, 2500 * Math.max(1, this.police.wantedLevel));
    this.player.money = Math.max(0, this.player.money - fine);
    this.recordWalletTransaction('expense', 'Police Apprehension Fine', fine);

    const fineEl = document.getElementById('arrest-fine-amount');
    if (fineEl) fineEl.textContent = `৳${fine.toLocaleString()}`;

    document.getElementById('arrest-overlay').classList.remove('hidden');
    this.sound.playCollision(0.9);
    this.saveProgress();
  }

  respawnAfterArrest() {
    document.getElementById('arrest-overlay').classList.add('hidden');
    if (this.player.inVehicle) this.player.exitVehicle();
    this.police.clearWanted();

    this.player.x = 0;
    this.player.z = 75;
    this.player.health = 100;
    if (this.player.mesh) this.player.mesh.position.set(0, 0, 75);
    this.state = 'PLAYING';
    this.ui.showToast('RELEASED FROM SHAHBAGH STATION', 'Wanted level reset to 0. Drive safely!', 'cyan');
  }

  getContextInteractionPrompt() {
    if (this.player.isSeatedAtTable) {
      return {
        key: 'F',
        text: '🪑 Seated at VIP Date Table with GF Nadia — Press [E] to Order Drinks or [W/A/S/D / F] to Stand Up'
      };
    }

    const nearBarTable = this.city.getNearestBarDateTable(this.player.x, this.player.z, 4.5);
    if (nearBarTable) {
      return {
        key: 'E',
        text: `${nearBarTable.label} [PRESS E]`
      };
    }

    const nearMallStall = this.city.getNearestMallInteriorShop(this.player.x, this.player.z, 4.2);
    if (nearMallStall) {
      return {
        key: 'E',
        text: `${nearMallStall.label} [PRESS E]`
      };
    }

    // 1. Check 3D Walk-In Bike Showroom Display Pedestals first!
    const nearShowroomBike = this.city.getNearestShowroomBike(this.player.x, this.player.z, 3.8);
    if (nearShowroomBike) {
      return {
        key: 'E',
        text: `Press E to View Bike — ${nearShowroomBike.catalog.name} (৳${nearShowroomBike.catalog.price.toLocaleString()})`
      };
    }

    // 2. Check 6 Major Landmark Venues (Bike Showroom, Grand Shopping Mall, Blue Moon Vice Bar, GF Nadia Villa, Restaurant, Customs)
    const nearVenue = this.city.getNearestLandmarkVenue(this.player.x, this.player.z, 9.5);
    if (nearVenue) {
      if (nearVenue.type === 'gf_spot') {
        return {
          key: 'E',
          text: `${nearVenue.icon} Press E to Pick Up GF Nadia for Bike Ride, Bar Drinks & Shopping (♥ ${this.player.gf.relationship}%)`
        };
      }
      if (nearVenue.type === 'bar') {
        return {
          key: 'E',
          text: `${nearVenue.icon} Press E to Enter ${nearVenue.name} (Order Drinks & Dance with GF)`
        };
      }
      return {
        key: 'E',
        text: `${nearVenue.icon} Press E to Enter ${nearVenue.name} (${nearVenue.shortLabel})`
      };
    }

    // 3. Check 5 Interactive Retail Shops
    const nearShop = this.city.getNearestInteractiveShop(this.player.x, this.player.z, 6.8);
    if (nearShop) {
      return {
        key: 'E',
        text: `Press E to Shop at ${nearShop.name} (${nearShop.category})`
      };
    }

    if (this.missions.canSnapPhoto(this.player)) {
      return { key: 'P', text: 'Snap Landmark Photo for Mission' };
    }
    const nearMission = this.missions.getNearestStartMarker(this.player.x, this.player.z);
    if (nearMission) {
      return { key: 'E', text: `Start Mission: ${nearMission.title} (Reward ৳${nearMission.reward.toLocaleString()})` };
    }
    for (const prop of this.city.properties) {
      if (Math.hypot(this.player.x - prop.x, this.player.z - prop.z) < 6.5) {
        if (!prop.owned) {
          return { key: 'E', text: `Buy ${prop.name} for ৳${prop.price.toLocaleString()}` };
        } else if (prop.level < 3) {
          return { key: 'E', text: `Upgrade ${prop.name} to Lv.${prop.level + 1} (৳${(prop.upgradeCost * prop.level).toLocaleString()})` };
        } else {
          return { key: 'G', text: `${prop.name} (MAX LEVEL) — Open Empire & Garage` };
        }
      }
    }
    for (const st of this.city.stores) {
      if (Math.hypot(this.player.x - st.x, this.player.z - st.z) < 6.5) {
        return st.robbedCooldown > 0
          ? { key: '⏳', text: `${st.name} Vault Locked (${Math.ceil(st.robbedCooldown)}s)` }
          : { key: 'E', text: `Raid Vault at ${st.name} (+৳${st.payout.toLocaleString()})` };
      }
    }
    for (const st of this.city.teaStalls) {
      if (Math.hypot(this.player.x - st.x, this.player.z - st.z) < 8.5) {
        return { key: 'B', text: `Drink Mama Cha & Repair/Clear Wanted (৳200) at ${st.name}` };
      }
    }
    if (this.player.inVehicle) {
      return null;
    }
    let bestVeh = null;
    let bestDist = 7.0;
    for (const v of this.traffic.vehicles) {
      if (v.isShowroomDisplay) continue;
      const d = Math.hypot(this.player.x - v.x, this.player.z - v.z);
      if (d < bestDist) {
        bestDist = d;
        bestVeh = v;
      }
    }
    if (bestVeh) {
      return {
        key: 'E',
        text: `Enter ${bestVeh.spec.name} (${bestVeh.spec.bnName})`
      };
    }

    const nearNPC = this.traffic.findNearestInteractableNPC(this.player.x, this.player.z, 4.8);
    if (nearNPC) {
      return nearNPC.hasProvidedCash
        ? { key: 'E', text: `${nearNPC.role} (Cash Already Collected)` }
        : { key: 'E', text: `Arcade Encounter with ${nearNPC.role} (Drops +৳${nearNPC.cashAmount})` };
    }
    return null;
  }

  updatePassivePropertyIncome(dt) {
    const ownedProps = this.city.properties.filter((p) => p.owned);
    if (ownedProps.length === 0) return;

    this.passiveIncomeTimer -= dt;
    if (this.passiveIncomeTimer <= 0) {
      this.passiveIncomeTimer = 15.0;
      const totalPerMin = ownedProps.reduce((acc, p) => acc + p.incomePerMin, 0);
      const payout = Math.round(totalPerMin * 0.25);
      if (payout > 0) {
        this.player.money += payout;
        this.recordWalletTransaction('income', `Passive Property Income (${ownedProps.length} properties)`, payout);
        this.ui.showFloorCashPopup(`+ ৳${payout.toLocaleString()}`);
      }
    }
  }

  updateDayNightAndWeather(dt) {
    if (this.autoDayNight && this.state === 'PLAYING') {
      const nextTime = (this.timeOfDay + dt * 0.08) % 24;
      this.setTimeOfDay(nextTime);
    }

    const blendSpeed = Math.min(1, dt * 2.2);
    this.currentNightBlend += (this.targetNightBlend - this.currentNightBlend) * blendSpeed;

    const isRain = this.weather === 'rain';
    const desiredSky = isRain
      ? (this.worldMode === 'night' ? this._rainSkyNight : this._rainSkyDay)
      : this.targetSkyColor;
    const desiredFog = isRain
      ? (this.worldMode === 'night' ? this._rainFogNight : this._rainFogDay)
      : this.targetFogColor;

    this.currentSkyColor.lerp(desiredSky, blendSpeed);
    this.currentFogColor.lerp(desiredFog, blendSpeed);
    this.currentSunColor.lerp(this.targetSunColor, blendSpeed);
    this.currentHemiSky.lerp(this.targetHemiSky, blendSpeed);
    this.currentHemiGround.lerp(this.targetHemiGround, blendSpeed);
    this.currentSunOffset.lerp(this.targetSunPos, blendSpeed);

    this.scene.background.copy(this.currentSkyColor);
    this.scene.fog.color.copy(this.currentFogColor);
    this.scene.fog.density += ((isRain ? 0.0022 : this.targetFogDensity) - this.scene.fog.density) * blendSpeed;

    this.dirLight.color.copy(this.currentSunColor);
    const targetSunInt = isRain ? this.targetSunIntensity * 0.55 : this.targetSunIntensity;
    this.dirLight.intensity += (targetSunInt - this.dirLight.intensity) * blendSpeed;

    this.hemiLight.color.copy(this.currentHemiSky);
    this.hemiLight.groundColor.copy(this.currentHemiGround);
    this.hemiLight.intensity += (this.targetHemiIntensity - this.hemiLight.intensity) * blendSpeed;

    this.renderer.toneMappingExposure += (this.targetExposure - this.renderer.toneMappingExposure) * blendSpeed;

    this.dirLight.position.set(
      this.player.x + this.currentSunOffset.x * 0.45,
      this.currentSunOffset.y * 0.55,
      this.player.z + this.currentSunOffset.z * 0.45
    );
    if (this.dirLightTarget) {
      this.dirLightTarget.position.set(this.player.x, 0, this.player.z);
    }

    if (this.starField) {
      this.starField.position.set(this.player.x, 0, this.player.z);
      this.starMaterial.opacity = Math.max(0, (this.currentNightBlend - 0.35) * 1.45) * (isRain ? 0.15 : 1.0);
    }
    if (this.sunDisc) {
      this.sunDisc.position.set(
        this.player.x + this.currentSunOffset.x * 2.4,
        this.currentSunOffset.y * 2.1,
        this.player.z + this.currentSunOffset.z * 2.4
      );
      this.sunMaterial.color.copy(this.currentSunColor);
      this.sunMaterial.opacity = Math.max(0, 1 - this.currentNightBlend * 1.35) * (isRain ? 0.2 : 1.0);
    }
    if (this.moonDisc) {
      this.moonDisc.position.set(this.player.x - 190, 240, this.player.z - 220);
      this.moonMaterial.opacity = Math.max(0, (this.currentNightBlend - 0.25) * 1.3) * (isRain ? 0.25 : 1.0);
    }

    if (Math.abs(this.currentNightBlend - this._lastVehicleNightBlend) > 0.015) {
      this._lastVehicleNightBlend = this.currentNightBlend;
      for (let i = 0; i < this.traffic.vehicles.length; i++) {
        this.traffic.vehicles[i].updateNightLighting(this.currentNightBlend);
      }
    } else if (this.player.inVehicle) {
      this.player.inVehicle.updateNightLighting(this.currentNightBlend);
    }

    if (
      this.player.inVehicle &&
      this.player.inVehicle.typeId !== 'rickshaw' &&
      this.player.inVehicle.headlightsOn &&
      this.currentNightBlend > 0.1
    ) {
      const pv = this.player.inVehicle;
      const fwdX = Math.sin(pv.heading);
      const fwdZ = Math.cos(pv.heading);
      this.vehicleSpotLight.position.set(pv.x + fwdX * 1.8, 1.35, pv.z + fwdZ * 1.8);
      this.vehicleSpotTarget.position.set(pv.x + fwdX * 26, 0.2, pv.z + fwdZ * 26);
      this.vehicleSpotLight.intensity = this.currentNightBlend * 2.6;
      this.vehicleSpotLight.visible = true;
    } else if (this.vehicleSpotLight.visible) {
      this.vehicleSpotLight.intensity = 0;
      this.vehicleSpotLight.visible = false;
    }

    if (this.rainSystem && this.rainSystem.visible) {
      const pos = this.rainSystem.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] -= 42 * dt;
        if (pos[i + 1] < 0) {
          pos[i] = this.player.x + (Math.random() - 0.5) * 120;
          pos[i + 1] = 45 + Math.random() * 15;
          pos[i + 2] = this.player.z + (Math.random() - 0.5) * 120;
        }
      }
      this.rainSystem.geometry.attributes.position.needsUpdate = true;
    }

    this.city.update(dt, this.currentNightBlend, isRain, this.player.x, this.player.z);
  }

  updateThirdPersonCamera(dt) {
    if (this.player.isSeatedAtTable && this.player.seatedVenue) {
      this.showroomOrbitAngle += dt * 0.45;
      const tv = this.player.seatedVenue;
      const camX = tv.x + Math.sin(this.showroomOrbitAngle) * 3.6;
      const camZ = tv.z + Math.cos(this.showroomOrbitAngle) * 3.6;
      this._camTargetPos.set(camX, 1.85, camZ);
      this.camera.position.lerp(this._camTargetPos, Math.min(1, dt * 8));
      this.camera.lookAt(tv.x, 1.05, tv.z);
      return;
    }
    if (!this.isPointerDragging) {
      this.mouseIdleTimer += dt;
    }
    const isDriving = !!this.player.inVehicle;
    const distMultipliers = [0.76, 1.0, 1.38];
    const mult = distMultipliers[this.cameraDistMode] || 1.0;

    // Classic GTA Vice City third-person framing: comfortable over-shoulder/center-high distance
    let baseDist = 5.2;
    let baseHeight = 1.95;
    let targetFov = 62;
    let lookAheadDist = 0;

    if (isDriving) {
      const v = this.player.inVehicle;
      const absSpeed = Math.abs(v.speed);
      if (v.typeId === 'bus' || v.typeId === 'truck') {
        baseDist = 13.8;
        baseHeight = 5.2;
      } else if (v.typeId === 'minibus' || v.typeId === 'suv' || v.typeId === 'luxury_car') {
        baseDist = 9.8;
        baseHeight = 3.8;
      } else if (v.isMotorcycle) {
        baseDist = 5.4;
        baseHeight = 2.05;
      } else {
        baseDist = 8.2;
        baseHeight = 3.05;
      }

      const speedRatio = Math.min(1, absSpeed / Math.max(30, v.spec.maxSpeed));
      targetFov = 62 + speedRatio * (v.isMotorcycle ? 10.5 : 7.5);
      lookAheadDist = Math.min(4.2, v.speed * 0.075);

      if (!this.isPointerDragging && this.mouseIdleTimer > 0.85 && absSpeed > 0.35) {
        const desiredYaw = v.heading + Math.PI;
        let diff = desiredYaw - this.cameraYaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.cameraYaw += diff * Math.min(1, dt * 5.2);
      }
    } else if (this.player.isMoving) {
      lookAheadDist = this.player.isSprinting ? 1.35 : 0.75;
      targetFov = this.player.isSprinting ? 65 : 62;
    }

    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 6);
      this.camera.updateProjectionMatrix();
    }

    const dist = baseDist * mult;
    const height = baseHeight * mult + Math.sin(this.cameraPitch) * 3.2;

    const camX = this.player.x + Math.sin(this.cameraYaw) * dist;
    const camZ = this.player.z + Math.cos(this.cameraYaw) * dist;
    const camY = Math.max(1.35, this.player.y + height);

    this._camTargetPos.set(camX, camY, camZ);
    this.camera.position.lerp(this._camTargetPos, Math.min(1, dt * 14));

    const lookX = this.player.x + Math.sin(this.player.heading) * lookAheadDist;
    const lookZ = this.player.z + Math.cos(this.player.heading) * lookAheadDist;
    this.camera.lookAt(lookX, this.player.y + (isDriving ? 1.55 : 1.5), lookZ);
  }

  saveProgress() {
    try {
      const data = {
        x: this.player.x,
        z: this.player.z,
        money: this.player.money,
        currentOutfit: this.player.currentOutfit,
        ownedOutfits: Array.from(this.player.ownedOutfits),
        ownedVehicles: Array.from(this.player.ownedVehicles),
        inventory: this.player.inventory,
        walletHistory: this.walletHistory,
        completedMissions: Array.from(this.missions.completedIds),
        collectedTokens: Array.from(this.missions.collectedIds),
        ownedProperties: this.city.properties
          .filter((p) => p.owned)
          .map((p) => ({ id: p.id, level: p.level, incomePerMin: p.incomePerMin })),
        worldMode: this.worldMode,
        daySubTime: this.daySubTime
      };
      localStorage.setItem('dhaka_streets_save_v5', JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  loadSavedProgress() {
    try {
      const raw =
        localStorage.getItem('dhaka_streets_save_v5') ||
        localStorage.getItem('dhaka_streets_save_v4') ||
        localStorage.getItem('dhaka_streets_save_v1');
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.money === 'number') this.player.money = data.money;
        if (typeof data.x === 'number' && typeof data.z === 'number') {
          this.player.x = data.x;
          this.player.z = data.z;
          if (this.player.mesh) this.player.mesh.position.set(data.x, 0, data.z);
        }
        if (Array.isArray(data.ownedOutfits)) {
          data.ownedOutfits.forEach((id) => this.player.ownedOutfits.add(id));
        }
        if (data.currentOutfit && PLAYER_OUTFITS[data.currentOutfit]) {
          this.player.equipOutfit(data.currentOutfit);
        }
        if (Array.isArray(data.ownedVehicles)) {
          data.ownedVehicles.forEach((id) => this.player.ownedVehicles.add(id));
        }
        if (Array.isArray(data.inventory)) {
          this.player.inventory = data.inventory;
        }
        if (Array.isArray(data.walletHistory)) {
          this.walletHistory = data.walletHistory;
        }
        if (Array.isArray(data.completedMissions)) {
          data.completedMissions.forEach((id) => this.missions.completedIds.add(id));
        }
        if (Array.isArray(data.collectedTokens)) {
          data.collectedTokens.forEach((id) => this.missions.collectedIds.add(id));
        }
        if (Array.isArray(data.ownedProperties)) {
          data.ownedProperties.forEach((savedProp) => {
            const p = this.city.properties.find((item) => item.id === savedProp.id);
            if (p) {
              p.owned = true;
              p.level = savedProp.level || 1;
              if (savedProp.incomePerMin) p.incomePerMin = savedProp.incomePerMin;
              if (p.ringMat) p.ringMat.color.setHex(0x10b981);
            }
          });
        }
        if (data.worldMode) {
          this.setWorldMode(data.worldMode, data.daySubTime || 'afternoon', true);
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  animate(now) {
    requestAnimationFrame(this.animate);
    const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    this.updateDayNightAndWeather(dt);

    if (this.state === 'PLAYING') {
      this.updatePassivePropertyIncome(dt);

      if (this.player.inVehicle) {
        this.player.inVehicle.updatePlayerControl(
          dt,
          this.keys,
          this.city,
          this.sound,
          () => {
            this.police.reportCrime(
              12,
              'Damaging City Road Property',
              (lvl, r) => this.ui.showToast(`WANTED LEVEL ★${lvl}`, r, 'crimson'),
              this.player.x,
              this.player.z
            );
          },
          (impactSpeed) => {
            if (impactSpeed > 28) {
              this.police.reportCrime(
                18,
                'Reckless Driving & Traffic Collision',
                (lvl, r) => this.ui.showToast(`WANTED LEVEL ★${lvl}`, r, 'crimson'),
                this.player.x,
                this.player.z
              );
            }
          },
          this.traffic.vehicles,
          this.cameraYaw,
          (jumpDist, bonus) => {
            this.player.money += bonus;
            this.recordWalletTransaction('income', `Insane Stunt Bonus (${jumpDist}m Jump)`, bonus);
            this.sound.playChime('mission_complete');
            this.ui.showFloorCashPopup(`STUNT +৳${bonus.toLocaleString()}`);
            this.ui.showToast(
              `🔥 INSANE STUNT BONUS! +৳${bonus.toLocaleString()}`,
              `Airborne Distance: ${jumpDist}m! Added to your Dhaka Wallet!`,
              'gold'
            );
            this.saveProgress();
          }
        );
      }

      this.player.update(dt, this.keys, this.cameraYaw);

      // Update Vice City Spinning Health Hearts (♥) & Body Armor Shields (🛡)
      if (this.city && Array.isArray(this.city.healthArmorPickups)) {
        const t = now * 0.0035;
        for (const hp of this.city.healthArmorPickups) {
          if (hp.cooldown > 0) {
            hp.cooldown -= dt;
            if (hp.cooldown <= 0 && hp.mesh) hp.mesh.visible = true;
            continue;
          }
          if (hp.mesh) hp.mesh.rotation.y = t;
          if (Math.hypot(this.player.x - hp.x, this.player.z - hp.z) < 3.4) {
            hp.cooldown = 45;
            if (hp.mesh) hp.mesh.visible = false;
            if (hp.type === 'armor') {
              this.player.armor = 100;
              this.ui.showToast('🛡️ BODY ARMOR 100%', 'Vice-Style Body Armor equipped!', 'cyan');
            } else {
              this.player.health = this.player.maxHealth;
              if (this.player.inVehicle) this.player.inVehicle.health = this.player.inVehicle.maxHealth;
              this.ui.showToast('❤️ HEALTH RESTORED 100%', 'Full player and vehicle health restored!', 'emerald');
            }
            this.sound.playChime('mission_complete');
          }
        }
      }
      this.traffic.update(
        dt,
        this.player,
        (amount, label) => {
          this.recordWalletTransaction('income', label || 'Auto-Collected Cash Pickup', amount);
          this.ui.showFloorCashPopup(`+ ৳${amount.toLocaleString()}`);
          this.ui.showToast(`+ ৳${amount.toLocaleString()} AUTO-COLLECTED`, `${label || 'Cash Pickup'} added to Wallet.`, 'emerald');
          this.saveProgress();
        },
        (npc, takenCash) => {
          // Vice City-Style Pedestrian Cash Transfer: whatever money the pedestrian had is now yours!
          this.recordWalletTransaction('income', `Pedestrian Cash Drop (${npc.role})`, takenCash);
          if (this.sound) this.sound.playCollision(0.42);
          this.ui.showFloorCashPopup(`+ ৳${takenCash.toLocaleString()}`);
          this.ui.showToast(
            `💵 +৳${takenCash.toLocaleString()} COLLECTED!`,
            `Took ${npc.role}'s cash! Wallet: ৳${Math.floor(this.player.money).toLocaleString()}`,
            'emerald'
          );
          this.police.reportCrime(
            14,
            `Hit & Run Cash Grab (${npc.role})`,
            (lvl, r) => this.ui.showToast(`WANTED LEVEL ★${lvl}`, r, 'crimson'),
            this.player.x,
            this.player.z
          );
          this.saveProgress();
        }
      );

      const { nearestDist } = this.police.update(dt, this.player, () => this.triggerArrestScreen());

      this.missions.update(
        dt,
        this.player,
        (t, s, c) => this.ui.showToast(t, s, c),
        (finished, reward) => {
          if (reward) {
            this.recordWalletTransaction('income', `Reward: ${finished.title || finished.name}`, reward);
            this.ui.showFloorCashPopup(`+ ৳${reward.toLocaleString()}`);
          }
          this.saveProgress();
        }
      );

      const speedRatio = this.player.inVehicle
        ? this.player.inVehicle.speed / this.player.inVehicle.spec.maxSpeed
        : 0;
      const vehType = this.player.inVehicle ? this.player.inVehicle.typeId : null;
      this.sound.updateEngine(!!this.player.inVehicle, speedRatio, vehType);
      this.sound.updateWorldAudio(dt, this.police.wantedLevel, this.weather, nearestDist);

      this.updateThirdPersonCamera(dt);

      // Update 3D Floating Neon GPS Direction Arrow pointing to active Map/Mission destination
      const activeWp = this.missions.getCurrentWaypoint() || this.minimap.customWaypoint;
      if (this.gpsArrowGroup) {
        if (activeWp) {
          const distWp = Math.hypot(activeWp.x - this.player.x, activeWp.z - this.player.z);
          if (distWp > 6) {
            this.gpsArrowGroup.visible = true;
            this.gpsArrowGroup.position.set(this.player.x, this.player.y + 3.1, this.player.z);
            this.gpsArrowGroup.rotation.y = Math.atan2(activeWp.x - this.player.x, activeWp.z - this.player.z);
          } else {
            this.gpsArrowGroup.visible = false;
          }
        } else {
          this.gpsArrowGroup.visible = false;
        }
      }

      this._hudUpdateAccumulator += dt;
      if (this._hudUpdateAccumulator >= 0.045) {
        this._hudUpdateAccumulator = 0;
        this._cachedPrompt = this.getContextInteractionPrompt();
        this.ui.updateHUD(
          this.player,
          this.city,
          this.police,
          this.missions,
          this.timeOfDay,
          this.weather,
          this._cachedPrompt
        );
        this.minimap.renderHUDMinimap(
          this.player,
          this.city,
          this.traffic,
          this.police,
          this.missions,
          this.cameraYaw
        );
      }
    } else if (this.state === 'SHOWROOM') {
      // 360° Showroom Camera Orbit around the currently inspected 3D Motorcycle!
      this.sound.updateEngine(false, 0, null);
      this.showroomOrbitAngle += dt * 0.75;
      const item = this.city.showroomBikes[this.inspectedShowroomIndex];
      if (item) {
        const camX = item.x + Math.sin(this.showroomOrbitAngle) * 3.8;
        const camZ = item.z + Math.cos(this.showroomOrbitAngle) * 3.8;
        this._camTargetPos.set(camX, 1.95, camZ);
        this.camera.position.lerp(this._camTargetPos, Math.min(1, dt * 10));
        this.camera.lookAt(item.x, 1.05, item.z);
      }
    } else {
      this.sound.updateEngine(false, 0, null);
      if (this.state === 'MENU') {
        const t = now * 0.00025;
        this.camera.position.set(Math.sin(t) * 95, 38, 65 + Math.cos(t) * 95);
        this.camera.lookAt(0, 8, 65);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

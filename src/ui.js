// src/ui.js — Version 5.0 UI Manager: 3D Bike Showroom Interface, 5 Interactive Shops, Wallet Ledger & HUD
import { DHAKA_DISTRICTS, SHOP_CATALOGS, CITY_LANDMARK_VENUES, BAR_DRINKS_MENU } from './city.js';
import { VEHICLE_SPECS, BIKE_SHOWROOM_CATALOG } from './vehicles.js';
import { PLAYER_OUTFITS, GF_OUTFITS } from './player.js';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.toastTimeout = null;
    this.cashPopupTimeout = null;
    this._domCache = {};
    this._hudState = {};
    this.bindEvents();
    this.populateFastTravelAndSpawner();
  }

  _el(id) {
    let el = this._domCache[id];
    if (el === undefined) {
      el = typeof document !== 'undefined' ? document.getElementById(id) : null;
      this._domCache[id] = el;
    }
    return el;
  }

  _qs(sel) {
    let el = this._domCache[sel];
    if (el === undefined) {
      el = typeof document !== 'undefined' ? document.querySelector(sel) : null;
      this._domCache[sel] = el;
    }
    return el;
  }

  _setText(id, val) {
    if (this._hudState['t_' + id] === val) return;
    this._hudState['t_' + id] = val;
    const el = this._el(id);
    if (el) el.textContent = val;
  }

  _setClass(idOrSel, val, isSelector = false) {
    if (this._hudState['c_' + idOrSel] === val) return;
    this._hudState['c_' + idOrSel] = val;
    const el = isSelector ? this._qs(idOrSel) : this._el(idOrSel);
    if (el) el.className = val;
  }

  _setHidden(idOrSel, hidden, isSelector = false) {
    const key = 'h_' + idOrSel;
    if (this._hudState[key] === hidden) return;
    this._hudState[key] = hidden;
    const el = isSelector ? this._qs(idOrSel) : this._el(idOrSel);
    if (el) {
      if (hidden) el.classList.add('hidden');
      else el.classList.remove('hidden');
    }
  }

  _setWidth(id, widthStr) {
    if (this._hudState['w_' + id] === widthStr) return;
    this._hudState['w_' + id] = widthStr;
    const el = this._el(id);
    if (el) el.style.width = widthStr;
  }

  bindEvents() {
    const on = (id, evt, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener(evt, fn);
    };

    // Main Menu Buttons
    on('btn-play-game', 'click', () => this.game.startNewOrContinue(false));
    on('btn-continue-game', 'click', () => this.game.startNewOrContinue(true));
    on('btn-open-modes', 'click', () => this.showMenuPanel('panel-modes'));
    on('btn-open-showroom-menu', 'click', () => {
      document.getElementById('main-menu-overlay').classList.add('hidden');
      document.getElementById('hud-layer').classList.remove('hidden');
      this.game.openBikeShowroomModal(0);
    });
    on('btn-open-empire-menu', 'click', () => {
      document.getElementById('main-menu-overlay').classList.add('hidden');
      document.getElementById('hud-layer').classList.remove('hidden');
      this.game.toggleEmpireModal(true);
    });
    on('btn-open-settings', 'click', () => this.showMenuPanel('panel-settings'));
    on('btn-open-controls', 'click', () => this.showMenuPanel('panel-controls'));
    on('btn-open-about', 'click', () => this.showMenuPanel('panel-about'));

    // Quick Day/Night Mode Selection Buttons
    on('btn-menu-day-mode', 'click', () => {
      this.game.setWorldMode('day', this.game.daySubTime);
      this.game.sound.playChime('ui');
    });
    on('btn-menu-night-mode', 'click', () => {
      this.game.setWorldMode('night');
      this.game.sound.playChime('ui');
    });

    on('btn-subtime-morning', 'click', () => {
      this.game.setWorldMode('day', 'morning');
      this.game.sound.playChime('ui');
    });
    on('btn-subtime-afternoon', 'click', () => {
      this.game.setWorldMode('day', 'afternoon');
      this.game.sound.playChime('ui');
    });
    on('btn-subtime-sunset', 'click', () => {
      this.game.setWorldMode('day', 'sunset');
      this.game.sound.playChime('ui');
    });

    on('card-select-day-morning', 'click', () => {
      this.game.setWorldMode('day', 'morning');
      this.game.sound.playChime('ui');
    });
    on('card-select-day-afternoon', 'click', () => {
      this.game.setWorldMode('day', 'afternoon');
      this.game.sound.playChime('ui');
    });
    on('card-select-day-sunset', 'click', () => {
      this.game.setWorldMode('day', 'sunset');
      this.game.sound.playChime('ui');
    });
    on('card-select-night', 'click', () => {
      this.game.setWorldMode('night');
      this.game.sound.playChime('ui');
    });
    on('btn-launch-selected-mode', 'click', () => this.game.startNewOrContinue(false));

    document.querySelectorAll('.btn-back-menu').forEach((btn) => {
      btn.addEventListener('click', () => this.showMenuPanel('panel-main'));
    });

    // Top HUD Action Buttons
    on('btn-hud-mode-toggle', 'click', () => this.game.toggleDayNightMode());
    on('btn-hud-subtime-cycle', 'click', () => this.game.cycleDaySubTime());
    on('btn-hud-showroom', 'click', () => this.game.openBikeShowroomModal(0));
    on('btn-hud-shops', 'click', () => this.game.openShopModal(SHOP_CATALOGS.clothing));
    on('btn-hud-empire', 'click', () => this.game.toggleEmpireModal());
    on('btn-hud-save', 'click', () => {
      this.game.saveProgress();
      this.game.sound.playChime('mission_complete');
      this.showToast('💾 GAME PROGRESS SAVED', 'Wallet, Owned Bikes, Cars, Properties & Outfits saved!', 'emerald');
    });
    on('btn-hud-map', 'click', () => this.game.toggleMapModal());
    on('btn-hud-quick-map', 'click', () => this.game.toggleMapModal());
    on('btn-hud-quick-showroom', 'click', () => this.game.openBikeShowroomModal(0));
    on('btn-hud-quick-mall', 'click', () => this.game.openShopModal(SHOP_CATALOGS.clothing));
    on('btn-hud-quick-bar', 'click', () =>
      this.game.openShopModal({ id: 'bar_lounge', name: 'Blue Moon Vice Bar & Nightclub', bnName: 'ব্লু মুন বার, লাউঞ্জ ও গার্লফ্রেন্ড ডেট', category: '🍸 Bar & GF Lounge' })
    );
    on('minimap-click-box', 'click', () => this.game.toggleMapModal());

    // Map Zoom Level Buttons
    const setZoomBtn = (span) => {
      this.game.minimap.setMapZoom(span);
      this.game.minimap.renderFullCityMap(this.game.player, this.game.city, this.game.police, this.game.missions);
    };
    on('btn-map-zoom-street', 'click', () => setZoomBtn(1400));
    on('btn-map-zoom-city', 'click', () => setZoomBtn(5000));
    on('btn-map-zoom-full', 'click', () => setZoomBtn(16000));
    on('btn-hud-pause', 'click', () => this.game.togglePauseMenu());
    on('btn-hud-mute', 'click', () => this.game.toggleMute());
    on('btn-hud-camera', 'click', () => this.game.cycleCameraDistance());
    on('btn-close-map', 'click', () => this.game.toggleMapModal(false));
    on('btn-close-empire', 'click', () => this.game.toggleEmpireModal(false));
    on('btn-close-showroom', 'click', () => this.game.closeBikeShowroomModal());
    on('btn-close-shop', 'click', () => this.game.closeShopModal());

    // 3D Bike Showroom Navigation & Purchase Buttons
    on('btn-showroom-prev', 'click', () => {
      this.game.openBikeShowroomModal(this.game.inspectedShowroomIndex - 1);
    });
    on('btn-showroom-next', 'click', () => {
      this.game.openBikeShowroomModal(this.game.inspectedShowroomIndex + 1);
    });
    on('btn-showroom-purchase', 'click', () => {
      const item = this.game.city.showroomBikes[this.game.inspectedShowroomIndex];
      if (!item) return;
      const bikeId = item.catalog.id;

      if (this.game.player.ownedVehicles.has(bikeId)) {
        this.game.spawnVehicleForPlayer(bikeId);
        return;
      }

      const res = this.game.purchaseBikeFromShowroom(bikeId);
      const statusBanner = document.getElementById('showroom-purchase-feedback');
      if (res.success) {
        if (statusBanner) {
          statusBanner.textContent = 'PURCHASE SUCCESSFUL — Bike unlocked & added to your Garage!';
          statusBanner.className = 'p-2.5 rounded-lg bg-emerald-500/25 border border-emerald-400 text-emerald-200 text-xs font-black text-center';
          statusBanner.classList.remove('hidden');
        }
        this.showToast('🏍️ PURCHASE SUCCESSFUL!', `${item.catalog.name} unlocked and saved to your Garage!`, 'emerald');
        this.renderBikeShowroomModal();
      } else {
        if (statusBanner) {
          statusBanner.textContent = res.message;
          statusBanner.className = 'p-2.5 rounded-lg bg-red-500/25 border border-red-400 text-red-200 text-xs font-black text-center';
          statusBanner.classList.remove('hidden');
        }
        this.showToast('INSUFFICIENT FUNDS', res.message, 'crimson');
      }
    });

    on('btn-clear-waypoint', 'click', () => {
      this.game.minimap.customWaypoint = null;
      this.showToast('GPS Waypoint Cleared', 'Click anywhere on the map to set a new destination.', 'cyan');
    });

    // Pause Menu Buttons
    on('btn-resume-game', 'click', () => this.game.togglePauseMenu(false));
    on('btn-pause-toggle-mode', 'click', () => this.game.toggleDayNightMode());
    on('btn-pause-save', 'click', () => {
      this.game.saveProgress();
      this.showToast('💾 GAME PROGRESS SAVED', 'All progress saved to browser storage.', 'emerald');
    });
    on('btn-pause-settings', 'click', () => {
      document.getElementById('pause-overlay').classList.add('hidden');
      document.getElementById('main-menu-overlay').classList.remove('hidden');
      this.showMenuPanel('panel-settings');
    });
    on('btn-pause-controls', 'click', () => {
      document.getElementById('pause-overlay').classList.add('hidden');
      document.getElementById('main-menu-overlay').classList.remove('hidden');
      this.showMenuPanel('panel-controls');
    });
    on('btn-pause-mainmenu', 'click', () => this.game.returnToMainMenu());

    on('btn-arrest-respawn', 'click', () => this.game.respawnAfterArrest());

    on('btn-abort-mission', 'click', () => {
      this.game.missions.cancelMission('Mission Canceled', (t, s, c) => this.showToast(t, s, c));
    });

    // Settings Controls
    on('slider-time', 'input', (e) => {
      const val = parseFloat(e.target.value);
      this.game.setTimeOfDay(val);
    });

    on('select-weather', 'change', (e) => {
      this.game.setWeather(e.target.value);
    });

    on('slider-volume', 'input', (e) => {
      const v = parseFloat(e.target.value);
      this.game.sound.setVolume(v);
      const lbl = document.getElementById('label-vol-val');
      if (lbl) lbl.textContent = `${Math.round(v * 100)}%`;
    });

    on('toggle-auto-daynight', 'change', (e) => {
      this.game.autoDayNight = e.target.checked;
    });

    // Interactive Full Map Click-to-Set-Waypoint (Scaled to 2,900x2,900m world [-1450..1450])
    const fullMapCanvas = document.getElementById('full-map-canvas');
    if (fullMapCanvas) {
      fullMapCanvas.addEventListener('click', (e) => {
        const rect = fullMapCanvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        const mc = this.game.minimap.lastMapCenter || { x: 0, z: 65, span: 1400 };
        let wx = mc.x - mc.span / 2 + nx * mc.span;
        let wz = mc.z - mc.span / 2 + ny * mc.span;
        let label = 'Custom GPS Pin';

        // Snap to any nearby Landmark Venue if clicked close to its icon!
        for (const v of CITY_LANDMARK_VENUES) {
          if (Math.hypot(wx - v.doorX, wz - v.doorZ) < mc.span * 0.045) {
            wx = v.doorX;
            wz = v.doorZ;
            label = `${v.icon} ${v.shortLabel}`;
            break;
          }
        }

        this.game.minimap.customWaypoint = { x: wx, z: wz, label };
        this.game.sound.playChime('ui');
        this.showToast(`📍 GPS PIN SET: ${label}`, `Follow the pink Radar line & 3D Arrow to (${Math.round(wx)}, ${Math.round(wz)})`, 'cyan');
        this.game.minimap.renderFullCityMap(
          this.game.player,
          this.game.city,
          this.game.police,
          this.game.missions
        );
      });
    }

    // Touch / On-Screen Controls
    const bindHold = (btnId, keyCode) => {
      const el = document.getElementById(btnId);
      if (!el) return;
      const start = (ev) => {
        ev.preventDefault();
        this.game.keys[keyCode] = true;
      };
      const end = (ev) => {
        ev.preventDefault();
        this.game.keys[keyCode] = false;
      };
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('mouseleave', end);
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
    };

    bindHold('touch-up', 'KeyW');
    bindHold('touch-down', 'KeyS');
    bindHold('touch-left', 'KeyA');
    bindHold('touch-right', 'KeyD');
    bindHold('touch-brake', 'Space');
    bindHold('touch-sprint', 'ShiftLeft');

    on('touch-action-e', 'click', () => this.game.handleInteractKeyE());
    on('touch-action-f', 'click', () => this.game.handleExitKeyF());
    on('touch-action-h', 'click', () => this.game.handleHornKeyH());
    on('touch-action-p', 'click', () => this.game.handlePhotoKeyP());
  }

  // Render the 3D Walk-In Bike Showroom Inspection & Purchase Interface
  renderBikeShowroomModal() {
    const item = this.game.city.showroomBikes[this.game.inspectedShowroomIndex];
    if (!item) return;
    const cat = item.catalog;
    const owned = this.game.player.ownedVehicles.has(cat.id);
    const canAfford = this.game.player.money >= cat.price;
    const deficit = Math.max(0, cat.price - this.game.player.money);

    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('showroom-wallet-balance', `WALLET: ৳${Math.floor(this.game.player.money).toLocaleString()}`);
    setTxt('showroom-bike-index', `Display Platform ${this.game.inspectedShowroomIndex + 1} of ${this.game.city.showroomBikes.length}`);
    setTxt('showroom-bike-name', cat.name);
    setTxt('showroom-bike-bn', `${cat.bnName} • ${cat.bikeClass}`);
    setTxt('showroom-bike-price', `৳${cat.price.toLocaleString()}`);
    setTxt('showroom-bike-desc', cat.desc);

    const speedPct = Math.min(100, Math.round((cat.maxSpeed / 92) * 100));
    const accelPct = Math.min(100, Math.round((cat.accel / 60) * 100));
    const handPct = Math.min(100, cat.handling);

    const barSpeed = document.getElementById('showroom-bar-speed');
    const barAccel = document.getElementById('showroom-bar-accel');
    const barHand = document.getElementById('showroom-bar-handling');
    if (barSpeed) barSpeed.style.width = `${speedPct}%`;
    if (barAccel) barAccel.style.width = `${accelPct}%`;
    if (barHand) barHand.style.width = `${handPct}%`;

    setTxt('showroom-val-speed', `${Math.round(cat.maxSpeed * 2.2)} km/h`);
    setTxt('showroom-val-accel', `${cat.accel} m/s²`);
    setTxt('showroom-val-handling', `${cat.handling}/100`);

    const buyBtn = document.getElementById('btn-showroom-purchase');
    const stateBadge = document.getElementById('showroom-afford-state');
    if (buyBtn && stateBadge) {
      if (owned) {
        stateBadge.textContent = '✓ ALREADY IN YOUR GARAGE COLLECTION';
        stateBadge.className = 'text-xs font-black text-emerald-400';
        buyBtn.textContent = '🏍️ RIDE / SPAWN THIS MOTORCYCLE NOW';
        buyBtn.className = 'w-full py-3 px-4 rounded-xl font-black text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg cursor-pointer';
      } else if (canAfford) {
        stateBadge.textContent = '✓ WALLET HAS SUFFICIENT FUNDS';
        stateBadge.className = 'text-xs font-black text-emerald-400';
        buyBtn.textContent = `PURCHASE BIKE (৳${cat.price.toLocaleString()})`;
        buyBtn.className = 'w-full py-3 px-4 rounded-xl font-black text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-lg cursor-pointer';
      } else {
        stateBadge.textContent = `INSUFFICIENT FUNDS — Need ৳${deficit.toLocaleString()} more`;
        stateBadge.className = 'text-xs font-black text-red-400';
        buyBtn.textContent = `INSUFFICIENT FUNDS (Need ৳${deficit.toLocaleString()} More)`;
        buyBtn.className = 'w-full py-3 px-4 rounded-xl font-black text-sm bg-red-950/80 border border-red-500/60 text-red-300 cursor-not-allowed';
      }
    }

    // Quick Bike Selector Strip inside Showroom
    const strip = document.getElementById('showroom-catalog-strip');
    if (strip) {
      strip.innerHTML = '';
      BIKE_SHOWROOM_CATALOG.forEach((b, idx) => {
        const isSel = idx === this.game.inspectedShowroomIndex;
        const isOwn = this.game.player.ownedVehicles.has(b.id);
        const btn = document.createElement('button');
        btn.className = `px-2.5 py-1.5 rounded-lg border text-left transition flex flex-col ${
          isSel
            ? 'bg-emerald-600/30 border-emerald-400 text-white'
            : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:border-slate-500'
        }`;
        btn.innerHTML = `
          <span class="text-[11px] font-extrabold truncate">${b.name}</span>
          <span class="text-[10px] ${isOwn ? 'text-emerald-400' : 'text-amber-300'} font-bold">${
            isOwn ? '✓ Owned' : `৳${b.price.toLocaleString()}`
          }</span>
        `;
        btn.addEventListener('click', () => {
          const feedback = document.getElementById('showroom-purchase-feedback');
          if (feedback) feedback.classList.add('hidden');
          this.game.openBikeShowroomModal(idx);
        });
        strip.appendChild(btn);
      });
    }
  }

  // Render the 5 Interactive Retail Shops + 🍸 Blue Moon Vice Bar & GF Date Lounge Modal!
  renderInteractiveShopModal(shop) {
    if (!shop) return;
    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    const isBarTab = shop.id === 'bar_lounge';
    setTxt('shop-modal-title', `${shop.name} (${shop.category})`);
    setTxt('shop-modal-bn', shop.bnName);
    setTxt('shop-wallet-balance', `WALLET: ৳${Math.floor(this.game.player.money).toLocaleString()}`);

    // Shop & Bar Category Tabs
    const tabsEl = document.getElementById('shop-category-tabs');
    if (tabsEl) {
      tabsEl.innerHTML = '';
      const allTabs = [
        ...Object.values(SHOP_CATALOGS),
        {
          id: 'gf_dresses',
          name: 'GF Nadia Glamorous Dress Boutique',
          bnName: 'গার্লফ্রেন্ড নাদিয়ার পার্টি ড্রেস বুটিক',
          category: '👗 GF Nadia Dresses'
        },
        {
          id: 'bar_lounge',
          name: 'Blue Moon Vice Bar & Nightclub',
          bnName: 'ব্লু মুন বার, লাউঞ্জ ও গার্লফ্রেন্ড ডেট',
          category: '🍸 Bar & GF Date Lounge'
        }
      ];
      allTabs.forEach((sc) => {
        const active = sc.id === shop.id;
        const btn = document.createElement('button');
        btn.className = `px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
          active
            ? sc.id === 'bar_lounge'
              ? 'bg-pink-500 text-white shadow-lg'
              : 'bg-emerald-500 text-slate-950'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
        }`;
        btn.textContent = sc.category;
        btn.addEventListener('click', () => {
          const fb = document.getElementById('shop-purchase-feedback');
          if (fb) fb.classList.add('hidden');
          this.game.openShopModal(sc);
        });
        tabsEl.appendChild(btn);
      });
    }

    const itemsGrid = document.getElementById('shop-items-grid');
    if (!itemsGrid) return;
    itemsGrid.innerHTML = '';

    // Always show GF Nadia Companion & Date Control Banner at top of Bar & Shopping Mall!
    if (this.game.player && this.game.player.gf) {
      const gf = this.game.player.gf;
      const gfBanner = document.createElement('div');
      gfBanner.className = 'sm:col-span-2 p-3.5 rounded-xl bg-gradient-to-r from-pink-950/80 via-slate-900 to-purple-950/80 border border-pink-500/50 flex flex-wrap items-center justify-between gap-3';
      gfBanner.innerHTML = `
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-pink-300">💖 Girlfriend Nadia (গার্লফ্রেন্ড নাদিয়া)</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              gf.following ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400' : 'bg-slate-800 text-slate-300'
            }">${gf.following ? '✓ On Date With You (Rides on Your Bike/Car!)' : 'Waiting at Villa (-34, 112)'}</span>
          </div>
          <div class="text-xs text-amber-300 font-bold mt-1">Relationship Love Meter: ♥ ${gf.relationship}% • Dates Completed: ${gf.datesCompleted}</div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="btn-sit-vip-table" class="px-3.5 py-2 rounded-lg text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg transition">
            🪑 Sit at 3D VIP Bar Table & Drink Together
          </button>
          <button id="btn-toggle-gf-date" class="px-3.5 py-2 rounded-lg text-xs font-extrabold ${
            gf.following ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-pink-500 hover:bg-pink-400 text-white shadow-lg'
          } transition">${gf.following ? 'Drop Off GF Nadia' : '💖 Invite GF Nadia on Date Now'}</button>
        </div>
      `;
      gfBanner.querySelector('#btn-sit-vip-table').addEventListener('click', () => {
        this.game.player.sitAtVIPDateTable(49, 102, 'Blue Moon Vice Bar');
        this.game.purchaseBarDrinkOrActivity('drink_blue_lagoon');
        this.game.closeShopModal();
        this.showToast(
          '🪑 SEATED AT 3D VIP BAR TABLE WITH GF NADIA!',
          'Enjoying Blue Moon Neon Lagoon drinks together! Press [F] or [W/A/S/D] anytime to stand up.',
          'emerald'
        );
      });
      gfBanner.querySelector('#btn-toggle-gf-date').addEventListener('click', () => {
        const nowFollowing = this.game.player.toggleGirlfriendCompanion();
        this.game.sound.playChime('mission_complete');
        this.showToast(
          nowFollowing ? '💖 GF NADIA IS NOW WITH YOU!' : '👋 GF NADIA DROPPED OFF',
          nowFollowing ? 'She will walk beside you, ride on the back of your motorcycle, and join you for drinks!' : 'Visit her Villa anytime!',
          nowFollowing ? 'emerald' : 'cyan'
        );
        this.renderInteractiveShopModal(shop);
      });
      itemsGrid.appendChild(gfBanner);
    }

    if (shop.id === 'gf_dresses') {
      Object.values(GF_OUTFITS).forEach((dress) => {
        const owned = this.game.player.gf.ownedOutfits.has(dress.id);
        const equipped = this.game.player.gf.currentOutfit === dress.id;
        const canAfford = this.game.player.money >= dress.price;
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-slate-900/95 border border-pink-500/40 flex flex-col justify-between gap-2.5';
        card.innerHTML = `
          <div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-extrabold text-white">👗 ${dress.name}</span>
              <span class="text-xs font-black text-amber-300">${owned ? '✓ OWNED' : `৳${dress.price.toLocaleString()}`}</span>
            </div>
            <div class="text-[11px] text-pink-300 bengali-text">${dress.bnName}</div>
            <p class="text-[11px] text-slate-300 mt-1">Instantly changes GF Nadia’s 3D dress & boosts Relationship +25% ♥!</p>
          </div>
          <button class="btn-gf-dress w-full py-2 px-3 rounded-lg text-xs font-extrabold ${
            equipped
              ? 'bg-emerald-500 text-slate-950'
              : owned || canAfford
              ? 'bg-pink-600 hover:bg-pink-500 text-white'
              : 'bg-red-950/80 border border-red-500/50 text-red-300'
          } transition">${
            equipped ? '✓ Currently Wearing' : owned ? '👗 Equip Dress on GF Nadia' : `Buy & Equip Dress (৳${dress.price.toLocaleString()})`
          }</button>
        `;
        card.querySelector('.btn-gf-dress').addEventListener('click', () => {
          if (!owned && !canAfford) {
            this.showToast('INSUFFICIENT MONEY', `Need ৳${(dress.price - this.game.player.money).toLocaleString()} more.`, 'crimson');
            return;
          }
          if (!owned) {
            this.game.player.money -= dress.price;
            this.game.recordWalletTransaction('expense', `GF Dress: ${dress.name}`, dress.price);
            this.game.player.addGirlfriendRelationship(25);
          }
          this.game.player.equipGirlfriendOutfit(dress.id);
          this.game.sound.playChime('mission_complete');
          this.game.saveProgress();
          this.showToast('👗 GF NADIA DRESS CHANGED!', `Nadia is now wearing ${dress.name}!`, 'emerald');
          this.renderInteractiveShopModal(shop);
        });
        itemsGrid.appendChild(card);
      });
      return;
    }

    if (isBarTab) {
      BAR_DRINKS_MENU.forEach((drink) => {
        const canAfford = this.game.player.money >= drink.price;
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-slate-900/95 border border-pink-500/40 flex flex-col justify-between gap-2.5';
        card.innerHTML = `
          <div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-extrabold text-white">🍹 ${drink.name}</span>
              <span class="text-xs font-black text-amber-300 whitespace-nowrap">৳${drink.price.toLocaleString()}</span>
            </div>
            <div class="text-[11px] text-pink-300 bengali-text">${drink.bnName}</div>
            <div class="text-[11px] font-bold text-emerald-400 mt-1">${drink.vibeBoost}</div>
            <p class="text-[11px] text-slate-300 mt-0.5">${drink.desc}</p>
          </div>
          <button class="btn-order-drink w-full py-2 px-3 rounded-lg text-xs font-extrabold ${
            canAfford
              ? 'bg-pink-600 hover:bg-pink-500 text-white'
              : 'bg-red-950/80 border border-red-500/50 text-red-300'
          } transition">${
            canAfford ? `🍸 Order / Enjoy Now (৳${drink.price.toLocaleString()})` : `INSUFFICIENT MONEY`
          }</button>
        `;
        card.querySelector('.btn-order-drink').addEventListener('click', () => {
          const res = this.game.purchaseBarDrinkOrActivity(drink.id);
          const fb = document.getElementById('shop-purchase-feedback');
          if (res.success) {
            if (fb) {
              fb.textContent = res.message;
              fb.className = 'p-2.5 rounded-lg bg-pink-500/25 border border-pink-400 text-pink-200 text-xs font-black text-center mb-3';
              fb.classList.remove('hidden');
            }
            this.showToast('🍹 BLUE MOON BAR & LOUNGE', res.message, 'emerald');
            this.renderInteractiveShopModal(shop);
          } else {
            this.showToast('INSUFFICIENT MONEY', res.message, 'crimson');
          }
        });
        itemsGrid.appendChild(card);
      });
      return;
    }

    if (shop.items) {
      shop.items.forEach((item) => {
        const canAfford = this.game.player.money >= item.price;
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between gap-2.5';
        card.innerHTML = `
          <div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-extrabold text-white">${item.name}</span>
              <span class="text-xs font-black text-amber-300 whitespace-nowrap">৳${item.price.toLocaleString()}</span>
            </div>
            <div class="text-[11px] text-emerald-300 bengali-text">${item.bnName}</div>
            <p class="text-[11px] text-slate-300 mt-1">${item.desc}</p>
          </div>
          <button class="btn-buy-shop-item w-full py-2 px-3 rounded-lg text-xs font-extrabold ${
            canAfford
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              : 'bg-red-950/80 border border-red-500/50 text-red-300'
          } transition">${
            canAfford ? `Buy Now (৳${item.price.toLocaleString()})` : `INSUFFICIENT MONEY (Need ৳${(item.price - this.game.player.money).toLocaleString()} more)`
          }</button>
        `;

        card.querySelector('.btn-buy-shop-item').addEventListener('click', () => {
          const res = this.game.purchaseShopItem(shop.id, item.id);
          const fb = document.getElementById('shop-purchase-feedback');
          if (res.success) {
            if (fb) {
              fb.textContent = `PURCHASE SUCCESSFUL: ${item.name} (-৳${item.price.toLocaleString()})`;
              fb.className = 'p-2.5 rounded-lg bg-emerald-500/25 border border-emerald-400 text-emerald-200 text-xs font-black text-center mb-3';
              fb.classList.remove('hidden');
            }
            this.showToast('🛍️ PURCHASE SUCCESSFUL', `${item.name} purchased!`, 'emerald');
            this.renderInteractiveShopModal(shop);
          } else {
            if (fb) {
              fb.textContent = res.message;
              fb.className = 'p-2.5 rounded-lg bg-red-500/25 border border-red-400 text-red-200 text-xs font-black text-center mb-3';
              fb.classList.remove('hidden');
            }
            this.showToast('INSUFFICIENT MONEY', res.message, 'crimson');
          }
        });
        itemsGrid.appendChild(card);
      });
    }
  }

  renderEmpireAndGarageModal() {
    const cashEl = document.getElementById('empire-cash-display');
    if (cashEl) cashEl.textContent = `WALLET: ৳${Math.floor(this.game.player.money).toLocaleString()}`;

    // 1. Properties & Businesses List
    const propGrid = document.getElementById('empire-properties-grid');
    if (propGrid) {
      propGrid.innerHTML = '';
      this.game.city.properties.forEach((p) => {
        const card = document.createElement('div');
        card.className = `p-3 rounded-xl border ${
          p.owned ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-800/90 border-slate-700'
        } flex flex-col justify-between gap-2`;

        const actionLabel = !p.owned
          ? `Buy ৳${p.price.toLocaleString()}`
          : p.level < 3
          ? `Upgrade Lv.${p.level + 1} (৳${(p.upgradeCost * p.level).toLocaleString()})`
          : 'MAX LEVEL ★3';

        card.innerHTML = `
          <div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-extrabold text-white">${p.name}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${
                p.owned ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-300'
              }">${p.owned ? `OWNED Lv.${p.level}` : p.type}</span>
            </div>
            <div class="text-[11px] text-amber-300 bengali-text">${p.bnName}</div>
            <div class="text-[11px] text-emerald-400 font-bold mt-1">Passive Income: +৳${p.incomePerMin.toLocaleString()}/min</div>
          </div>
          <div class="flex gap-1.5">
            <button class="btn-prop-buy flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold ${
              p.owned && p.level >= 3
                ? 'bg-slate-700 text-slate-400 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
            } transition">${actionLabel}</button>
            <button class="btn-prop-visit py-1.5 px-2.5 rounded-lg text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition">Go</button>
          </div>
        `;

        card.querySelector('.btn-prop-buy').addEventListener('click', () => {
          if (this.game.purchaseOrUpgradeProperty(p.id)) {
            this.renderEmpireAndGarageModal();
          }
        });
        card.querySelector('.btn-prop-visit').addEventListener('click', () => {
          this.game.teleportPlayerToDistrict({ name: p.name, bnName: p.bnName, x: p.x, z: p.z });
          this.game.toggleEmpireModal(false);
        });
        propGrid.appendChild(card);
      });
    }

    // 2. Owned & Purchasable Vehicle / Motorcycle Collection (21 Total Vehicles!)
    const garGrid = document.getElementById('empire-garage-grid');
    if (garGrid) {
      garGrid.innerHTML = '';
      Object.values(VEHICLE_SPECS).forEach((spec) => {
        const owned = this.game.player.ownedVehicles.has(spec.id);
        const card = document.createElement('div');
        card.className = `p-2.5 rounded-xl border ${
          owned ? 'bg-amber-950/30 border-amber-500/50' : 'bg-slate-800/90 border-slate-700'
        } flex flex-col justify-between gap-2`;

        card.innerHTML = `
          <div>
            <div class="text-xs font-extrabold text-amber-300 truncate">${spec.name}</div>
            <div class="text-[10px] text-slate-300 bengali-text truncate">${spec.bnName}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${spec.bikeClass || spec.category} • ${Math.round(spec.maxSpeed * 2.2)} km/h</div>
          </div>
          <button class="btn-veh-act w-full py-1.5 rounded-lg text-xs font-extrabold ${
            owned
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-slate-700 hover:bg-emerald-600 text-white'
          } transition">${owned ? '🏍️ Spawn Owned' : `Buy ৳${spec.price.toLocaleString()}`}</button>
        `;

        card.querySelector('.btn-veh-act').addEventListener('click', () => {
          if (owned) {
            this.game.spawnVehicleForPlayer(spec.id);
          } else if (this.game.player.money >= spec.price) {
            this.game.player.money -= spec.price;
            this.game.player.ownedVehicles.add(spec.id);
            this.game.recordWalletTransaction('expense', `Garage Purchase: ${spec.name}`, spec.price);
            this.game.sound.playChime('mission_complete');
            this.game.saveProgress();
            this.game.spawnVehicleForPlayer(spec.id);
          } else {
            this.showToast('INSUFFICIENT FUNDS', `Need ৳${(spec.price - this.game.player.money).toLocaleString()} more to buy ${spec.name}.`, 'crimson');
          }
        });
        garGrid.appendChild(card);
      });
    }

    // 3. Active Vehicle Customizer
    const custContainer = document.getElementById('active-vehicle-customizer');
    if (custContainer) {
      const pv = this.game.player.inVehicle;
      if (!pv) {
        custContainer.innerHTML = `<div class="text-xs text-slate-400">Enter or spawn any motorcycle or car to customize paint, finish, rims, and performance upgrades.</div>`;
      } else {
        const colors = [
          { name: 'Crimson', hex: 0xef4444 },
          { name: 'Emerald', hex: 0x10b981 },
          { name: 'Royal Gold', hex: 0xfacc15 },
          { name: 'Cyber Cyan', hex: 0x06b6d4 },
          { name: 'Midnight', hex: 0x0f172a },
          { name: 'Pearl White', hex: 0xf8fafc }
        ];
        custContainer.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span class="text-xs font-extrabold text-emerald-300">Active: ${pv.spec.name} (Engine Lv.${pv.engineLevel} • Handling Lv.${pv.handlingLevel})</span>
            <div class="flex gap-1.5">
              <button id="btn-cust-repair" class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-extrabold">🔧 Repair (৳1,500)</button>
              <button id="btn-cust-upgrade" class="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold">⚡ Stage Tune (৳6,000)</button>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${colors
              .map(
                (c) =>
                  `<button data-hex="${c.hex}" class="btn-paint-swatch px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-bold text-white">${c.name}</button>`
              )
              .join('')}
            <button data-finish="metallic" class="btn-finish-swatch px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-[11px] text-amber-300 font-bold">Metallic</button>
            <button data-finish="matte" class="btn-finish-swatch px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-[11px] text-cyan-300 font-bold">Matte</button>
            <button data-finish="chrome" class="btn-finish-swatch px-2.5 py-1 rounded bg-slate-800 border border-slate-600 text-[11px] text-emerald-300 font-bold">Chrome</button>
          </div>
        `;

        const repBtn = document.getElementById('btn-cust-repair');
        if (repBtn) {
          repBtn.addEventListener('click', () => {
            if (this.game.player.money >= 1500) {
              this.game.player.money -= 1500;
              pv.health = pv.maxHealth;
              this.game.recordWalletTransaction('expense', `Vehicle Repair: ${pv.spec.name}`, 1500);
              this.game.sound.playChime('mission_complete');
              this.renderEmpireAndGarageModal();
              this.showToast('🔧 VEHICLE REPAIRED', '100% Condition restored!', 'emerald');
            }
          });
        }

        const upgBtn = document.getElementById('btn-cust-upgrade');
        if (upgBtn) {
          upgBtn.addEventListener('click', () => {
            if (pv.engineLevel >= 3 && pv.handlingLevel >= 3) {
              this.showToast('MAX PERFORMANCE', 'Already tuned to Stage 3!', 'cyan');
              return;
            }
            if (this.game.player.money >= 6000) {
              this.game.player.money -= 6000;
              pv.applyCustomization({
                engineLvl: Math.min(3, pv.engineLevel + 1),
                handlingLvl: Math.min(3, pv.handlingLevel + 1)
              });
              this.game.recordWalletTransaction('expense', `Stage Tune: ${pv.spec.name}`, 6000);
              this.game.sound.playChime('mission_complete');
              this.renderEmpireAndGarageModal();
              this.showToast('⚡ STAGE TUNING APPLIED', `Upgraded to Lv.${pv.engineLevel}!`, 'gold');
            }
          });
        }

        custContainer.querySelectorAll('.btn-paint-swatch').forEach((btn) => {
          btn.addEventListener('click', () => {
            const hex = Number(btn.getAttribute('data-hex'));
            pv.applyCustomization({ colorHex: hex });
            this.game.sound.playChime('ui');
          });
        });

        custContainer.querySelectorAll('.btn-finish-swatch').forEach((btn) => {
          btn.addEventListener('click', () => {
            const fin = btn.getAttribute('data-finish');
            pv.applyCustomization({ finish: fin });
            this.game.sound.playChime('ui');
          });
        });
      }
    }

    // 4. Character Wardrobe Outfits & Wallet Ledger History
    const outfitGrid = document.getElementById('empire-wardrobe-grid');
    if (outfitGrid) {
      outfitGrid.innerHTML = '';
      Object.values(PLAYER_OUTFITS).forEach((out) => {
        const owned = this.game.player.ownedOutfits.has(out.id);
        const equipped = this.game.player.currentOutfit === out.id;
        const btn = document.createElement('button');
        btn.className = `p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
          equipped
            ? 'bg-emerald-950/60 border-emerald-400'
            : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
        }`;
        btn.innerHTML = `
          <div>
            <div class="text-xs font-bold text-white">${out.name}</div>
            <div class="text-[11px] text-emerald-300 bengali-text">${out.bnName}</div>
          </div>
          <div class="text-[11px] font-extrabold mt-1 ${
            equipped ? 'text-emerald-400' : 'text-amber-300'
          }">${equipped ? '✓ Equipped' : owned ? 'Equip Outfit' : `Buy ৳${out.price.toLocaleString()}`}</div>
        `;
        btn.addEventListener('click', () => {
          if (owned) {
            this.game.player.equipOutfit(out.id);
            this.game.sound.playChime('ui');
            this.game.saveProgress();
            this.renderEmpireAndGarageModal();
          } else if (this.game.player.money >= out.price) {
            this.game.player.money -= out.price;
            this.game.player.ownedOutfits.add(out.id);
            this.game.player.equipOutfit(out.id);
            this.game.recordWalletTransaction('expense', `Outfit: ${out.name}`, out.price);
            this.game.sound.playChime('mission_complete');
            this.game.saveProgress();
            this.renderEmpireAndGarageModal();
          } else {
            this.showToast('INSUFFICIENT MONEY', `Need ৳${(out.price - this.game.player.money).toLocaleString()} more.`, 'crimson');
          }
        });
        outfitGrid.appendChild(btn);
      });
    }

    // 5. Wallet Income & Expense History Log
    const ledgerEl = document.getElementById('wallet-ledger-list');
    if (ledgerEl) {
      ledgerEl.innerHTML = this.game.walletHistory
        .slice(0, 8)
        .map(
          (tx) => `
          <div class="flex justify-between items-center py-1 border-b border-slate-800 text-[11px]">
            <span class="text-slate-300 truncate">${tx.label}</span>
            <span class="font-extrabold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}">
              ${tx.type === 'income' ? '+' : '-'}৳${tx.amount.toLocaleString()}
            </span>
          </div>
        `
        )
        .join('');
    }
  }

  showFloorCashPopup(text = '+ ৳500') {
    const pop = document.getElementById('cash-pickup-popup');
    if (!pop) return;
    pop.textContent = text;
    pop.style.opacity = '1';
    pop.style.transform = 'translate(-50%, -28px) scale(1.1)';
    if (this.cashPopupTimeout) clearTimeout(this.cashPopupTimeout);
    this.cashPopupTimeout = setTimeout(() => {
      pop.style.opacity = '0';
      pop.style.transform = 'translate(-50%, 0px) scale(0.95)';
    }, 1800);
  }

  syncModeButtons(worldMode, daySubTime) {
    const isNight = worldMode === 'night';

    const btnDay = document.getElementById('btn-menu-day-mode');
    const btnNight = document.getElementById('btn-menu-night-mode');
    const subTimeRow = document.getElementById('menu-day-subtime-row');

    if (btnDay && btnNight) {
      btnDay.className = !isNight
        ? 'flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs border-2 border-amber-400 bg-amber-500/25 text-amber-200 transition flex items-center justify-center gap-1.5 shadow-lg'
        : 'flex-1 py-2.5 px-3 rounded-xl font-bold text-xs border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500 transition flex items-center justify-center gap-1.5';

      btnNight.className = isNight
        ? 'flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs border-2 border-cyan-400 bg-cyan-500/25 text-cyan-200 transition flex items-center justify-center gap-1.5 shadow-lg'
        : 'flex-1 py-2.5 px-3 rounded-xl font-bold text-xs border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500 transition flex items-center justify-center gap-1.5';
    }

    if (subTimeRow) {
      subTimeRow.style.opacity = isNight ? '0.45' : '1';
    }

    ['morning', 'afternoon', 'sunset'].forEach((st) => {
      const el = document.getElementById(`btn-subtime-${st}`);
      if (el) {
        const active = !isNight && daySubTime === st;
        el.className = active
          ? 'flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold bg-emerald-500/30 border border-emerald-400 text-emerald-200 transition'
          : 'flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-slate-800/90 border border-slate-700 text-slate-300 hover:border-slate-500 transition';
      }
    });

    const hudModeBtn = document.getElementById('btn-hud-mode-toggle');
    if (hudModeBtn) {
      hudModeBtn.textContent = isNight ? '🌙 Night Mode [N]' : '☀️ Day Mode [N]';
      hudModeBtn.className = isNight
        ? 'px-2.5 py-1 rounded bg-indigo-950/90 hover:bg-indigo-800 text-cyan-300 border border-cyan-500/50 text-[11px] font-extrabold transition'
        : 'px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-400/50 text-[11px] font-extrabold transition';
    }

    const hudSubBtn = document.getElementById('btn-hud-subtime-cycle');
    if (hudSubBtn) {
      const labels = { morning: '🌅 Morning [T]', afternoon: '☀️ Afternoon [T]', sunset: '🌇 Sunset [T]' };
      hudSubBtn.textContent = isNight ? '✨ Stars & Neon' : (labels[daySubTime] || '☀️ Afternoon [T]');
    }
  }

  populateFastTravelAndSpawner() {
    const venueDir = document.getElementById('landmark-venues-directory');
    if (venueDir) {
      venueDir.innerHTML = '';
      CITY_LANDMARK_VENUES.forEach((v) => {
        const card = document.createElement('div');
        card.className = 'p-2.5 rounded-xl bg-slate-800/95 border border-slate-700 flex flex-col justify-between gap-2';
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between gap-1">
              <span class="text-xs font-black text-white truncate">${v.icon} ${v.shortLabel}</span>
              <span class="text-[10px] font-mono text-slate-400">(${v.doorX}, ${v.doorZ})</span>
            </div>
            <div class="text-[11px] text-amber-300 bengali-text truncate">${v.bnName}</div>
          </div>
          <div class="flex gap-1.5">
            <button class="btn-venue-gps flex-1 py-1 px-2 rounded bg-slate-700 hover:bg-pink-600 text-[11px] font-extrabold text-white transition">📍 Set GPS</button>
            <button class="btn-venue-go flex-1 py-1 px-2 rounded bg-emerald-500 hover:bg-emerald-400 text-[11px] font-extrabold text-slate-950 transition">🚀 Go to Door</button>
          </div>
        `;
        card.querySelector('.btn-venue-gps').addEventListener('click', () => {
          this.game.setGPSWaypointToVenue(v);
          this.game.toggleMapModal(false);
        });
        card.querySelector('.btn-venue-go').addEventListener('click', () => {
          this.game.teleportToVenueDoor(v);
        });
        venueDir.appendChild(card);
      });
    }

    const ftGrid = document.getElementById('landmark-fast-travel-grid');
    if (ftGrid) {
      ftGrid.innerHTML = '';
      DHAKA_DISTRICTS.forEach((d) => {
        const btn = document.createElement('button');
        btn.className =
          'px-2.5 py-2 rounded-lg bg-slate-800/90 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-400 text-left transition flex flex-col justify-between';
        btn.innerHTML = `
          <span class="text-xs font-bold text-white truncate">${d.name}</span>
          <span class="text-[11px] text-emerald-300 bengali-text truncate">${d.bnName}</span>
        `;
        btn.addEventListener('click', () => {
          this.game.teleportPlayerToDistrict(d);
        });
        ftGrid.appendChild(btn);
      });
    }

    const vGrid = document.getElementById('vehicle-spawner-grid');
    if (vGrid) {
      vGrid.innerHTML = '';
      Object.values(VEHICLE_SPECS).forEach((spec) => {
        const btn = document.createElement('button');
        btn.className =
          'px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-500/25 border border-slate-700 hover:border-amber-400 text-left transition flex flex-col';
        btn.innerHTML = `
          <span class="text-xs font-bold text-amber-300 truncate">${spec.name}</span>
          <span class="text-[10px] text-slate-300 bengali-text truncate">${spec.bnName}</span>
        `;
        btn.addEventListener('click', () => {
          this.game.spawnVehicleForPlayer(spec.id);
        });
        vGrid.appendChild(btn);
      });
    }
  }

  showMenuPanel(panelId) {
    ['panel-main', 'panel-modes', 'panel-settings', 'panel-controls', 'panel-about'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (id === panelId) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });
    this.game.sound.playChime('ui');
  }

  showToast(title, subtitle = '', theme = 'emerald') {
    const banner = document.getElementById('toast-banner');
    const titleEl = document.getElementById('toast-title');
    const subEl = document.getElementById('toast-subtitle');
    if (!banner || !titleEl || !subEl) return;

    const colors = {
      emerald: 'border-emerald-400 bg-slate-900/95 text-emerald-300',
      gold: 'border-amber-400 bg-slate-900/95 text-amber-300',
      crimson: 'border-red-500 bg-slate-900/95 text-red-300',
      cyan: 'border-cyan-400 bg-slate-900/95 text-cyan-300'
    };

    banner.className = `glass-panel px-6 py-3 border-2 shadow-2xl transition-all duration-300 ${
      colors[theme] || colors.emerald
    }`;
    titleEl.textContent = title;
    subEl.textContent = subtitle;
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) translateY(0)';

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(-50%) translateY(-16px)';
    }, 2600);
  }

  updateHUD(player, city, police, missions, timeOfDay, weather, contextPrompt) {
    const dist = city.getDistrictAt(player.x, player.z);
    this._setText('hud-district-en', dist.name);
    this._setText('hud-district-bn', dist.bnName);

    const hrs = Math.floor(timeOfDay);
    const mins = Math.floor((timeOfDay - hrs) * 60);
    this._setText('hud-clock', `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);

    let weatherTxt = '☀️ Day Mode';
    if (weather === 'rain') {
      weatherTxt = '🌧️ Monsoon Rain';
    } else if (this.game.worldMode === 'night') {
      weatherTxt = '🌙 Night Mode';
    } else {
      const subMap = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', sunset: '🌇 Sunset' };
      weatherTxt = subMap[this.game.daySubTime] || '☀️ Day Mode';
    }
    this._setText('hud-weather-badge', weatherTxt);

    for (let i = 1; i <= 5; i++) {
      const starClass = i <= police.wantedLevel
        ? `star-icon active ${police.inSightOfPolice ? 'police-flash' : ''}`
        : 'star-icon';
      this._setClass(`wanted-star-${i}`, starClass);
    }

    this._setHidden('.wanted-container', !(police.wantedLevel > 0 || police.state !== 'IDLE'), true);

    this._setText('hud-wanted-status', police.getStateDescription());
    const wantedStatusClass =
      police.wantedLevel === 0
        ? 'text-[10px] font-bold tracking-wider text-slate-400'
        : police.inSightOfPolice
        ? 'text-[10px] font-extrabold tracking-wider text-red-400 animate-pulse'
        : 'text-[10px] font-bold tracking-wider text-amber-300';
    this._setClass('hud-wanted-status', wantedStatusClass);

    this._setText('hud-money', `WALLET: ৳${Math.floor(player.money).toLocaleString()}`);

    const activeHealthPct = player.inVehicle
      ? Math.round((player.inVehicle.health / player.inVehicle.maxHealth) * 100)
      : Math.round((player.health / player.maxHealth) * 100);

    this._setWidth('hud-health-bar', `${Math.max(0, Math.min(100, activeHealthPct))}%`);
    this._setText(
      'hud-health-text',
      player.inVehicle
        ? `Vehicle Condition: ${activeHealthPct}%`
        : `♥ ${activeHealthPct}% • 🛡️ Armor: ${Math.round(player.armor || 100)}%`
    );

    if (missions.activeMission) {
      this._setHidden('.mission-card', false, true);
      const m = missions.activeMission;
      const wp = missions.getCurrentWaypoint();
      this._setText('hud-mission-title', `${m.title} (${m.bnTitle})`);
      this._setText('hud-mission-obj', wp ? `• ${wp.label}` : m.description);
      const sec = Math.max(0, Math.ceil(missions.timer));
      this._setText('hud-mission-timer', `⏱️ ${sec}s remaining | Reward: ৳${m.reward.toLocaleString()}`);
      this._setHidden('hud-mission-timer', false);
      this._setHidden('btn-abort-mission', false);
    } else {
      this._setHidden('.mission-card', true, true);
      const ownedBikesCount = player.ownedVehicles ? player.ownedVehicles.size : 3;
      this._setText(
        'hud-mission-title',
        `Free Roam • Owned Vehicles ${ownedBikesCount} • Missions ${missions.completedIds.size}/${missions.missions.length}`
      );
      this._setText(
        'hud-mission-obj',
        `Walk inside the 3D Bike Showroom beside Shahbagh & press [E] to inspect/buy motorcycles, or visit any of the 5 Retail Shops!`
      );
      this._setHidden('hud-mission-timer', true);
      this._setHidden('btn-abort-mission', true);
    }

    if (player.inVehicle) {
      this._setHidden('.speedometer-panel', false, true);
      const v = player.inVehicle;
      const kmh = Math.round(Math.abs(v.speed) * 2.2);
      this._setText('hud-speed-val', String(kmh).padStart(3, '0'));
      this._setText('hud-vehicle-name', v.spec.name);
      this._setText('hud-vehicle-bn', v.spec.bnName);
      const pct = Math.round(Math.min(100, (Math.abs(v.speed) / v.spec.maxSpeed) * 100));
      this._setWidth('hud-speed-bar', `${pct}%`);
      const gearTxt = v.isBoat
        ? 'BOAT'
        : v.speed < -0.5
        ? 'REV'
        : v.speed > 0.5
        ? `D${Math.min(6, Math.ceil(kmh / 28))}`
        : 'N';
      this._setText('hud-gear-badge', gearTxt);
    } else {
      this._setHidden('.speedometer-panel', true, true);
    }

    const promptBox = this._el('hud-interaction-prompt');
    if (promptBox) {
      if (contextPrompt) {
        this._setText('hud-prompt-key', contextPrompt.key);
        this._setText('hud-prompt-text', contextPrompt.text);
        if (this._hudState.promptVis !== true) {
          this._hudState.promptVis = true;
          promptBox.style.opacity = '1';
          promptBox.style.transform = 'translateX(-50%) translateY(0)';
        }
      } else if (this._hudState.promptVis !== false) {
        this._hudState.promptVis = false;
        promptBox.style.opacity = '0';
        promptBox.style.transform = 'translateX(-50%) translateY(10px)';
      }
    }
  }
}

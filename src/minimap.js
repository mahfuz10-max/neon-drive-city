// src/minimap.js — Version 10.0 Interactive Zoomable City Map & Vice City Radar with Exact Venue Icons (🏍️ Bike Showroom, 🛍️ Shopping Mall, 🍸 Bar, 💖 GF, 🍽️ Restaurant, 🔧 Customs)
import { DHAKA_DISTRICTS, CITY_LANDMARK_VENUES } from './city.js';

export class MinimapRenderer {
  constructor(minimapCanvasId, fullMapCanvasId) {
    this.miniCanvas = typeof document !== 'undefined' ? document.getElementById(minimapCanvasId) : null;
    this.miniCtx = this.miniCanvas ? this.miniCanvas.getContext('2d') : null;

    this.fullCanvas = typeof document !== 'undefined' ? document.getElementById(fullMapCanvasId) : null;
    this.fullCtx = this.fullCanvas ? this.fullCanvas.getContext('2d') : null;

    this.customWaypoint = null;
    // Default Full Map Zoom to 1,400m span around Central Dhaka so Bike Showroom, Shopping Mall, Bar, and GF Villa are large and crystal clear!
    this.mapZoomSpan = 1400;
  }

  setMapZoom(span = 1400) {
    this.mapZoomSpan = span;
  }

  renderHUDMinimap(player, city, traffic, police, missionSystem, cameraYaw = 0) {
    if (!this.miniCtx || !this.miniCanvas) return;
    const ctx = this.miniCtx;
    const w = this.miniCanvas.width;
    const h = this.miniCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    // Zoomed-in street scale (0.52 px/m) so nearby streets, bridges, Showroom, Mall, Bar, and GF are super clear!
    const scale = 0.52;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#09131c';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    // Rotate radar by cameraYaw so Screen-Forward is ALWAYS Up on the radar!
    ctx.rotate(-cameraYaw);

    const toScreen = (wx, wz) => ({
      x: (wx - player.x) * scale,
      y: (wz - player.z) * scale
    });

    // 1. Water bodies
    ctx.fillStyle = '#0369a1';
    for (const wz of city.waterZones) {
      const p1 = toScreen(wz.minX, wz.minZ);
      const ww = (wz.maxX - wz.minX) * scale;
      const wh = (wz.maxZ - wz.minZ) * scale;
      ctx.fillRect(p1.x, p1.y, ww, wh);
    }

    // 2. Roads & Bridges (Culled to radar viewport radius for zero overdraw)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6.5;
    const maxDraw = cx + 24;
    ctx.beginPath();
    for (let i = 0; i < city.nsRoads.length; i++) {
      const sx = (city.nsRoads[i] - player.x) * scale;
      if (Math.abs(sx) <= maxDraw) {
        ctx.moveTo(sx, -maxDraw);
        ctx.lineTo(sx, maxDraw);
      }
    }
    for (let i = 0; i < city.ewRoads.length; i++) {
      const sy = (city.ewRoads[i] - player.z) * scale;
      if (Math.abs(sy) <= maxDraw) {
        ctx.moveTo(-maxDraw, sy);
        ctx.lineTo(maxDraw, sy);
      }
    }
    ctx.stroke();

    // 3. Police Last Known Position (LKP) Search Zone Circle
    if (police.lastKnownPosition && police.lastKnownPosition.active && police.wantedLevel > 0) {
      const lkp = toScreen(police.lastKnownPosition.x, police.lastKnownPosition.z);
      const rPx = police.searchRadius * scale;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(lkp.x, lkp.y, rPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 4. Active Mission Waypoint OR Custom GPS Waypoint Line
    const activeWp = missionSystem.getCurrentWaypoint() || this.customWaypoint;
    if (activeWp) {
      const wpPos = toScreen(activeWp.x, activeWp.z);
      ctx.strokeStyle = '#ff2a85';
      ctx.lineWidth = 3.0;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(wpPos.x, wpPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const dist = Math.hypot(wpPos.x, wpPos.y);
      const maxR = cx - 14;
      const cxClamp = dist > maxR ? (wpPos.x / dist) * maxR : wpPos.x;
      const cyClamp = dist > maxR ? (wpPos.y / dist) * maxR : wpPos.y;
      ctx.fillStyle = '#ff2a85';
      ctx.beginPath();
      ctx.arc(cxClamp, cyClamp, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 5. Exact Landmark Venue Blips (🏍️ Bike Showroom, 🛍️ Shopping Mall, 🍸 Bar, 💖 GF, 🍽️ Restaurant, 🔧 Customs)
    const venues = city.landmarkVenues || CITY_LANDMARK_VENUES;
    for (const v of venues) {
      const vp = toScreen(v.doorX, v.doorZ);
      const dist = Math.hypot(vp.x, vp.y);
      const maxR = cx - 16;
      const bx = dist > maxR ? (vp.x / dist) * maxR : vp.x;
      const by = dist > maxR ? (vp.y / dist) * maxR : vp.y;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(cameraYaw); // Keep icon upright on radar!
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.icon, 0, 0.5);
      ctx.restore();
    }

    // 6. Active Police Units
    const flashRed = Math.floor(performance.now() / 220) % 2 === 0;
    for (const u of police.units) {
      if (!u.active) continue;
      const p = toScreen(u.x, u.z);
      if (Math.hypot(p.x, p.y) < cx - 8) {
        ctx.fillStyle = flashRed ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 7. Player Arrow at Center
    ctx.save();
    ctx.rotate(-player.heading + Math.PI);
    ctx.fillStyle = '#34d399';
    ctx.strokeStyle = '#042f2e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -8.5);
    ctx.lineTo(6, 7);
    ctx.lineTo(0, 3.8);
    ctx.lineTo(-6, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    // 8. Rotating North ('N') Compass Badge on Radar Rim
    const northAngle = -cameraYaw - Math.PI / 2;
    const rimR = cx - 11;
    const nx = cx + Math.cos(northAngle) * rimR;
    const ny = cy + Math.sin(northAngle) * rimR;
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(nx, ny, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 10px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', nx, ny + 0.5);
  }

  renderFullCityMap(player, city, police, missionSystem) {
    if (!this.fullCtx || !this.fullCanvas) return;
    const ctx = this.fullCtx;
    const w = this.fullCanvas.width;
    const h = this.fullCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0b1520';
    ctx.fillRect(0, 0, w, h);

    const span = this.mapZoomSpan || 1400;
    const half = span / 2;
    // Center zoomed views around Central Dhaka (0, 65) or player when in outer districts
    const centerX = span <= 2500 && Math.hypot(player.x, player.z - 65) < 900 ? 0 : player.x;
    const centerZ = span <= 2500 && Math.hypot(player.x, player.z - 65) < 900 ? 65 : player.z;
    this.lastMapCenter = { x: centerX, z: centerZ, span };

    const worldToMap = (wx, wz) => ({
      x: ((wx - centerX + half) / span) * w,
      y: ((wz - centerZ + half) / span) * h
    });

    // 1. Water bodies
    ctx.fillStyle = '#0369a1';
    for (const wz of city.waterZones) {
      const p1 = worldToMap(wz.minX, wz.minZ);
      const p2 = worldToMap(wz.maxX, wz.maxZ);
      ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    }

    // 2. Roads
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = span <= 2000 ? 9 : 4.5;
    city.nsRoads.forEach((rx) => {
      const p1 = worldToMap(rx, -7200);
      const p2 = worldToMap(rx, 7200);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });
    city.ewRoads.forEach((rz) => {
      const p1 = worldToMap(-7200, rz);
      const p2 = worldToMap(7200, rz);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // 3. District Labels
    DHAKA_DISTRICTS.forEach((d) => {
      const pos = worldToMap(d.x, d.z);
      if (pos.x < -40 || pos.x > w + 40 || pos.y < -40 || pos.y > h + 40) return;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.name, pos.x, pos.y - 8);
    });

    // 4. Active GPS Route Line on Full Map
    const wp = missionSystem.getCurrentWaypoint() || this.customWaypoint;
    if (wp) {
      const pPlayer = worldToMap(player.x, player.z);
      const pWp = worldToMap(wp.x, wp.z);
      ctx.strokeStyle = '#ff2a85';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(pPlayer.x, pPlayer.y);
      ctx.lineTo(pWp.x, pWp.y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ff2a85';
      ctx.beginPath();
      ctx.arc(pWp.x, pWp.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Highlight All 6 Major Landmark Venues (🏍️ Bike Showroom, 🛍️ Shopping Mall, 🍸 Bar & Club, 💖 GF Nadia, 🍽️ Restaurant, 🔧 Customs)
    const venues = city.landmarkVenues || CITY_LANDMARK_VENUES;
    venues.forEach((v) => {
      const pos = worldToMap(v.doorX, v.doorZ);
      if (pos.x < -30 || pos.x > w + 30 || pos.y < -30 || pos.y > h + 30) return;

      // Glowing outer circle
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.icon, pos.x, pos.y + 1);

      // High-contrast label pill above icon
      ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
      const labelW = ctx.measureText(v.shortLabel).width + 14;
      ctx.fillRect(pos.x - labelW / 2, pos.y - 28, labelW, 14);
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x - labelW / 2, pos.y - 28, labelW, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 9px "Inter", sans-serif';
      ctx.fillText(v.shortLabel, pos.x, pos.y - 20.5);
    });

    // 6. Player Marker
    const pp = worldToMap(player.x, player.z);
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.font = '900 10px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('YOU', pp.x, pp.y + 16);
  }
}

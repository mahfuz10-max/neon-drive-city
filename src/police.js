// src/police.js — Version 4.0 Non-Omniscient 8-State Arcade Police AI & Last-Known-Position (LKP) Search System
// States:
// 1. IDLE
// 2. DETECTING_PLAYER
// 3. ACTIVE_CHASE
// 4. LOST_PLAYER
// 5. SEARCHING_LAST_KNOWN_LOCATION
// 6. SEARCH_ENDED
// 7. WANTED_LEVEL_COOLDOWN
// 8. WANTED_LEVEL_CLEARED

export const POLICE_STATES = {
  IDLE: 'IDLE',
  DETECTING_PLAYER: 'DETECTING_PLAYER',
  ACTIVE_CHASE: 'ACTIVE_CHASE',
  LOST_PLAYER: 'LOST_PLAYER',
  SEARCHING_LAST_KNOWN_LOCATION: 'SEARCHING_LAST_KNOWN_LOCATION',
  SEARCH_ENDED: 'SEARCH_ENDED',
  WANTED_LEVEL_COOLDOWN: 'WANTED_LEVEL_COOLDOWN',
  WANTED_LEVEL_CLEARED: 'WANTED_LEVEL_CLEARED'
};

export class PoliceSystem {
  constructor(scene, city, sound) {
    this.scene = scene;
    this.city = city;
    this.sound = sound;

    this.state = POLICE_STATES.IDLE;
    this.wantedLevel = 0; // 0 to 5 stars
    this.crimePoints = 0;

    // Detection & Search timers
    this.detectionTimer = 0;
    this.searchTimer = 0;
    this.searchDuration = 14; // Seconds police search around Last Known Position before giving up search
    this.cooldownTimer = 0;
    this.cooldownPerStar = 7; // Seconds per star to decay during WANTED_LEVEL_COOLDOWN
    this.clearedBannerTimer = 0;

    this.detectionRadius = 90; // Max distance a police unit can visually detect the player
    this.searchRadius = 85; // Radius around Last Known Position where police patrol during SEARCHING

    this.inSightOfPolice = false;
    this.arrestProgress = 0;

    // Last Known Position (LKP) — updated ONLY when player is actively detected!
    this.lastKnownPosition = {
      x: 0,
      z: 0,
      active: false,
      radius: 85
    };

    this.units = []; // Active Police Patrol SUVs & Interceptors
    this.maxUnitsPool = 6;
    this.buildPoliceUnits();
  }

  buildPoliceUnits() {
    if (!this.scene) return;
    for (let i = 0; i < this.maxUnitsPool; i++) {
      const group = new THREE.Group();

      // DMP-inspired Dark Blue & White Police Patrol SUV / Interceptor
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.0, 4.5),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.32, metalness: 0.48 })
      );
      body.position.y = 0.8;
      body.castShadow = false;
      group.add(body);

      const whiteDoors = new THREE.Mesh(
        new THREE.BoxGeometry(2.24, 0.65, 2.3),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc })
      );
      whiteDoors.position.y = 0.78;
      group.add(whiteDoors);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.92, 0.82, 2.5),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
      );
      cabin.position.set(0, 1.65, -0.15);
      group.add(cabin);

      // Red & Blue Roof Lightbar
      const redLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const blueLightMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

      const redBar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 0.32), redLightMat);
      redBar.position.set(-0.42, 2.18, 0.1);
      group.add(redBar);

      const blueBar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 0.32), blueLightMat);
      blueBar.position.set(0.42, 2.18, 0.1);
      group.add(blueBar);

      group.visible = false;
      this.scene.add(group);

      this.units.push({
        id: i,
        mesh: group,
        active: false,
        x: 0,
        z: 0,
        heading: 0,
        speed: 0,
        patrolAngle: (i * Math.PI) / 3,
        redLightMat,
        blueLightMat,
        flashPhase: i * 1.1
      });
    }
  }

  // Triggered when an in-game crime / witness report occurs at the player's current location
  reportCrime(points, reason, notifyCallback, crimeX = null, crimeZ = null) {
    this.crimePoints += points;
    const prevLevel = this.wantedLevel;

    if (this.crimePoints >= 180) this.wantedLevel = 5;
    else if (this.crimePoints >= 120) this.wantedLevel = 4;
    else if (this.crimePoints >= 75) this.wantedLevel = 3;
    else if (this.crimePoints >= 35) this.wantedLevel = 2;
    else if (this.crimePoints >= 10) this.wantedLevel = 1;

    // Record Last Known Position at the crime scene
    if (crimeX !== null && crimeZ !== null) {
      this.lastKnownPosition.x = crimeX;
      this.lastKnownPosition.z = crimeZ;
      this.lastKnownPosition.active = true;
    }

    // Enter DETECTING_PLAYER or ACTIVE_CHASE
    if (this.state === POLICE_STATES.IDLE || this.state === POLICE_STATES.WANTED_LEVEL_CLEARED) {
      this.state = POLICE_STATES.DETECTING_PLAYER;
      this.detectionTimer = 0.9;
    } else if (
      this.state === POLICE_STATES.LOST_PLAYER ||
      this.state === POLICE_STATES.SEARCHING_LAST_KNOWN_LOCATION ||
      this.state === POLICE_STATES.SEARCH_ENDED ||
      this.state === POLICE_STATES.WANTED_LEVEL_COOLDOWN
    ) {
      this.state = POLICE_STATES.ACTIVE_CHASE;
    }

    this.searchTimer = this.searchDuration + this.wantedLevel * 2;
    this.cooldownTimer = this.cooldownPerStar;

    // Spawn initial response units around the crime scene (NEVER teleporting on top of the player later)
    const desiredUnits = Math.min(this.maxUnitsPool, this.wantedLevel);
    const activeCount = this.units.filter((u) => u.active).length;
    if (activeCount < desiredUnits) {
      const refX = this.lastKnownPosition.active ? this.lastKnownPosition.x : 0;
      const refZ = this.lastKnownPosition.active ? this.lastKnownPosition.z : 0;
      const toSpawn = desiredUnits - activeCount;
      for (let s = 0; s < toSpawn; s++) {
        this.spawnUnitAroundLocation(refX, refZ);
      }
    }

    if (this.wantedLevel > prevLevel && notifyCallback) {
      notifyCallback(this.wantedLevel, reason);
    }
  }

  clearWanted() {
    this.wantedLevel = 0;
    this.crimePoints = 0;
    this.searchTimer = 0;
    this.cooldownTimer = 0;
    this.arrestProgress = 0;
    this.inSightOfPolice = false;
    this.lastKnownPosition.active = false;
    this.state = POLICE_STATES.IDLE;
    for (const u of this.units) {
      u.active = false;
      if (u.mesh) u.mesh.visible = false;
    }
  }

  // Spawns a police unit at a road offset around the reported crime location (never teleports during chase!)
  spawnUnitAroundLocation(cx, cz) {
    for (const u of this.units) {
      if (!u.active) {
        const angle = (u.id * Math.PI * 0.65) + (Math.random() * 0.5);
        const dist = 58 + Math.random() * 25;
        const limit = this.city && this.city.worldHalfSize ? this.city.worldHalfSize - 60 : 920;
        u.x = Math.max(-limit, Math.min(limit, cx + Math.sin(angle) * dist));
        u.z = Math.max(-limit, Math.min(limit, cz + Math.cos(angle) * dist));
        u.heading = Math.atan2(cx - u.x, cz - u.z);
        u.speed = 30;
        u.active = true;
        if (u.mesh) {
          u.mesh.visible = true;
          u.mesh.position.set(u.x, 0.28, u.z);
        }
        return u;
      }
    }
    return null;
  }

  getStateDescription() {
    switch (this.state) {
      case POLICE_STATES.IDLE:
        return 'CLEAR • NO POLICE ALERT';
      case POLICE_STATES.DETECTING_PLAYER:
        return `⚠️ POLICE DETECTING SUSPECT! (★${this.wantedLevel})`;
      case POLICE_STATES.ACTIVE_CHASE:
        return `🚨 ACTIVE CHASE IN PROGRESS! (★${this.wantedLevel})`;
      case POLICE_STATES.LOST_PLAYER:
        return `👀 VISUAL LOST — LOCKING LAST KNOWN POSITION...`;
      case POLICE_STATES.SEARCHING_LAST_KNOWN_LOCATION:
        return `🔍 SEARCHING LAST KNOWN AREA (${Math.ceil(this.searchTimer)}s)`;
      case POLICE_STATES.SEARCH_ENDED:
        return `📻 SEARCH ENDED — PATROLS STANDING DOWN`;
      case POLICE_STATES.WANTED_LEVEL_COOLDOWN:
        return `⏳ WANTED COOLDOWN: ★${this.wantedLevel} (${Math.ceil(this.cooldownTimer)}s)`;
      case POLICE_STATES.WANTED_LEVEL_CLEARED:
        return `✅ WANTED LEVEL CLEARED`;
      default:
        return 'CLEAR';
    }
  }

  update(dt, player, onArrestCallback) {
    // Handle transient WANTED_LEVEL_CLEARED banner state -> IDLE
    if (this.state === POLICE_STATES.WANTED_LEVEL_CLEARED) {
      this.clearedBannerTimer -= dt;
      if (this.clearedBannerTimer <= 0) {
        this.state = POLICE_STATES.IDLE;
      }
      return { nearestDist: Infinity, state: this.state };
    }

    if (this.wantedLevel === 0 || this.state === POLICE_STATES.IDLE) {
      this.state = POLICE_STATES.IDLE;
      this.inSightOfPolice = false;
      this.arrestProgress = 0;
      this.lastKnownPosition.active = false;
      return { nearestDist: Infinity, state: this.state };
    }

    // 1. Check whether any active police unit currently detects the player within detectionRadius (90m)
    let nearestDist = Infinity;
    let detectedByAnyUnit = false;

    for (const u of this.units) {
      if (!u.active) continue;
      const d = Math.hypot(player.x - u.x, player.z - u.z);
      if (d < nearestDist) nearestDist = d;
      if (d < this.detectionRadius) {
        detectedByAnyUnit = true;
      }
    }

    this.inSightOfPolice = detectedByAnyUnit;

    // 2. Update Last Known Position ONLY when player is actively detected!
    if (detectedByAnyUnit) {
      this.lastKnownPosition.x = player.x;
      this.lastKnownPosition.z = player.z;
      this.lastKnownPosition.active = true;
    }

    // 3. Finite State Machine Transitions (8 Explicit States)
    switch (this.state) {
      case POLICE_STATES.DETECTING_PLAYER: {
        this.detectionTimer -= dt;
        if (detectedByAnyUnit) {
          this.lastKnownPosition.x = player.x;
          this.lastKnownPosition.z = player.z;
          this.lastKnownPosition.active = true;
        }
        if (this.detectionTimer <= 0) {
          this.state = detectedByAnyUnit
            ? POLICE_STATES.ACTIVE_CHASE
            : POLICE_STATES.LOST_PLAYER;
        }
        break;
      }

      case POLICE_STATES.ACTIVE_CHASE: {
        if (detectedByAnyUnit) {
          // Reset search timer while actively in sight
          this.searchTimer = this.searchDuration + this.wantedLevel * 2;
        } else {
          // Player escaped detection radius! Freeze Last Known Position & enter LOST_PLAYER
          this.state = POLICE_STATES.LOST_PLAYER;
          this.detectionTimer = 1.0; // Brief transition state before SEARCHING_LAST_KNOWN_LOCATION
        }
        break;
      }

      case POLICE_STATES.LOST_PLAYER: {
        if (detectedByAnyUnit) {
          // Re-detected! Resume chase immediately
          this.state = POLICE_STATES.ACTIVE_CHASE;
          break;
        }
        this.detectionTimer -= dt;
        if (this.detectionTimer <= 0) {
          this.state = POLICE_STATES.SEARCHING_LAST_KNOWN_LOCATION;
          this.searchTimer = this.searchDuration + this.wantedLevel * 2;
        }
        break;
      }

      case POLICE_STATES.SEARCHING_LAST_KNOWN_LOCATION: {
        if (detectedByAnyUnit) {
          // Player returned near searching police — resume active chase!
          this.state = POLICE_STATES.ACTIVE_CHASE;
          break;
        }
        this.searchTimer -= dt;
        if (this.searchTimer <= 0) {
          this.state = POLICE_STATES.SEARCH_ENDED;
          this.detectionTimer = 1.2;
        }
        break;
      }

      case POLICE_STATES.SEARCH_ENDED: {
        if (detectedByAnyUnit) {
          this.state = POLICE_STATES.ACTIVE_CHASE;
          break;
        }
        this.detectionTimer -= dt;
        if (this.detectionTimer <= 0) {
          this.state = POLICE_STATES.WANTED_LEVEL_COOLDOWN;
          this.cooldownTimer = this.cooldownPerStar;
        }
        break;
      }

      case POLICE_STATES.WANTED_LEVEL_COOLDOWN: {
        if (detectedByAnyUnit) {
          // Spotted during cooldown — chase resumes!
          this.state = POLICE_STATES.ACTIVE_CHASE;
          break;
        }
        this.cooldownTimer -= dt;
        if (this.cooldownTimer <= 0) {
          this.wantedLevel = Math.max(0, this.wantedLevel - 1);
          this.crimePoints = this.wantedLevel * 25;
          if (this.wantedLevel === 0) {
            // All stars decayed — transition to WANTED_LEVEL_CLEARED
            this.lastKnownPosition.active = false;
            for (const u of this.units) {
              u.active = false;
              if (u.mesh) u.mesh.visible = false;
            }
            this.state = POLICE_STATES.WANTED_LEVEL_CLEARED;
            this.clearedBannerTimer = 2.5;
            return { nearestDist: Infinity, state: this.state };
          } else {
            this.cooldownTimer = this.cooldownPerStar;
          }
        }
        break;
      }
    }

    // 4. Update Police Unit Navigation & Movement
    // CRITICAL RULE:
    // - In DETECTING_PLAYER or ACTIVE_CHASE (when detectedByAnyUnit is true), units steer toward live player coordinates.
    // - In LOST_PLAYER, SEARCHING_LAST_KNOWN_LOCATION, SEARCH_ENDED, or WANTED_LEVEL_COOLDOWN,
    //   units NEVER read player.x/player.z! They ONLY patrol within `searchRadius` around `this.lastKnownPosition`!
    // - Police NEVER teleport or respawn closer to the player if the player drives far away!
    for (const u of this.units) {
      if (!u.active) continue;

      // Flashing Red/Blue Lightbar
      u.flashPhase += dt * 10;
      const isRedPeak = Math.sin(u.flashPhase) > 0;
      if (u.redLightMat && u.blueLightMat) {
        u.redLightMat.color.setHex(isRedPeak ? 0xff1111 : 0x450a0a);
        u.blueLightMat.color.setHex(!isRedPeak ? 0x3b82f6 : 0x172554);
      }

      let targetX = this.lastKnownPosition.x;
      let targetZ = this.lastKnownPosition.z;
      let maxUnitSpeed = 28;

      if (
        (this.state === POLICE_STATES.ACTIVE_CHASE || this.state === POLICE_STATES.DETECTING_PLAYER) &&
        detectedByAnyUnit
      ) {
        // Live visual pursuit
        targetX = player.x;
        targetZ = player.z;
        maxUnitSpeed = 34 + this.wantedLevel * 5.5;
      } else {
        // Patrol in a bounded search pattern around Last Known Position (NO live player tracking!)
        u.patrolAngle += dt * 0.65;
        const patrolR = Math.min(this.searchRadius * 0.65, 48);
        targetX = this.lastKnownPosition.x + Math.cos(u.patrolAngle + u.id) * patrolR;
        targetZ = this.lastKnownPosition.z + Math.sin(u.patrolAngle + u.id) * patrolR;
        maxUnitSpeed = this.state === POLICE_STATES.WANTED_LEVEL_COOLDOWN ? 18 : 26;
      }

      const dx = targetX - u.x;
      const dz = targetZ - u.z;
      const targetHeading = Math.atan2(dx, dz);
      let diff = targetHeading - u.heading;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      u.heading += diff * Math.min(1, dt * 3.2);

      u.speed = Math.min(maxUnitSpeed, u.speed + 22 * dt);

      const stepX = Math.sin(u.heading) * u.speed * dt;
      const stepZ = Math.cos(u.heading) * u.speed * dt;

      if (!this.city || !this.city.checkCollision(u.x + stepX, u.z + stepZ, 1.8).hit) {
        u.x += stepX;
        u.z += stepZ;
      } else {
        u.heading += 1.5 * dt;
        u.x += Math.sin(u.heading) * u.speed * 0.55 * dt;
        u.z += Math.cos(u.heading) * u.speed * 0.55 * dt;
      }

      // Physical interception if right next to player during active chase
      const distToPlayer = Math.hypot(player.x - u.x, player.z - u.z);
      if (distToPlayer < 4.5 && player.inVehicle) {
        player.inVehicle.speed *= 0.75;
        player.inVehicle.health = Math.max(10, player.inVehicle.health - 10 * dt);
      }

      if (u.mesh) {
        u.mesh.position.set(u.x, 0.28, u.z);
        u.mesh.rotation.y = u.heading;
      }
    }

    // 5. Arrest / Apprehension Check (only when police are within 9.5m and player is slow/stopped)
    const currentSpeed = player.inVehicle
      ? Math.abs(player.inVehicle.speed)
      : player.isMoving
      ? 8
      : 0;
    if (nearestDist < 9.5 && currentSpeed < 9.5) {
      this.arrestProgress += dt * (this.wantedLevel >= 3 ? 0.65 : 0.48);
      if (this.arrestProgress >= 1.0) {
        this.arrestProgress = 0;
        if (onArrestCallback) onArrestCallback();
      }
    } else {
      this.arrestProgress = Math.max(0, this.arrestProgress - dt * 0.5);
    }

    return { nearestDist, state: this.state };
  }
}

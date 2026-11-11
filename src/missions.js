// src/missions.js — Version 5.0 10 Playable Open-World Dhaka Missions (Including Motorcycle Street Race & Dirt Trail) + 12 Collectibles
export const DHAKA_MISSIONS = [
  {
    id: 'kacchi_delivery',
    title: 'Kacchi Bhai Express Delivery',
    bnTitle: 'কাচ্চি ভাই এক্সপ্রেস ডেলিভারি',
    type: 'Food Delivery',
    startX: -480,
    startZ: 105,
    startDistrict: 'Dhanmondi Lake & Rd 27',
    reward: 25000,
    timeLimit: 145,
    description: 'Pick up hot Kacchi Biryani from Dhanmondi and deliver it through Farmgate & Banani to Gulshan-2 Circle!',
    waypoints: [
      { x: -380, z: -190, label: 'Pass Farmgate Overbridge Checkpoint' },
      { x: 0, z: -420, label: 'Pass Banani Road 11 Junction' },
      { x: 660, z: -410, label: 'Deliver Kacchi Biryani at Gulshan-2 Circle' }
    ]
  },
  {
    id: 'cng_passenger',
    title: 'Shahbagh to Sadarghat Launch Rush',
    bnTitle: 'শাহবাগ-সদরঘাট যাত্রী সেবা',
    type: 'Taxi / CNG Passenger',
    startX: 16,
    startZ: 68,
    startDistrict: 'Shahbagh Square',
    reward: 22000,
    timeLimit: 130,
    description: 'A family at Shahbagh needs an urgent ride across the city to catch the Barishal Launch at Sadarghat Terminal!',
    waypoints: [
      { x: 0, z: 360, label: 'Cross Southern Avenue Junction' },
      { x: -180, z: 560, label: 'Navigate Old Dhaka Chawkbazar Street' },
      { x: -180, z: 775, label: 'Drop Passenger at Sadarghat Launch Terminal' }
    ]
  },
  {
    id: 'hatirjheel_trial',
    title: 'Hatirjheel Neon Bridge Time Trial',
    bnTitle: 'হাতিরঝিল টাইম ট্রায়াল রেস',
    type: 'Motorcycle / Speed Time Trial',
    startX: 380,
    startZ: -165,
    startDistrict: 'Hatirjheel Lakefront',
    reward: 35000,
    timeLimit: 120,
    description: 'Sprint on a motorcycle across the illuminated Hatirjheel arch bridges, loop through Motijheel, and finish at Shahbagh!',
    waypoints: [
      { x: 380, z: -95, label: 'Cross North Hatirjheel Bridge' },
      { x: 380, z: 0, label: 'Cross Central Rainbow Bridge' },
      { x: 380, z: 95, label: 'Cross South Hatirjheel Bridge' },
      { x: 660, z: 345, label: 'Round Motijheel Commercial Hub' },
      { x: 0, z: 75, label: 'Finish Sprint at Shahbagh Square' }
    ]
  },
  {
    id: 'bus_route_challenge',
    title: 'Dhaka Metro Bus Route 27',
    bnTitle: 'ঢাকা সিটি বাস রুট চ্যালেঞ্জ',
    type: 'Bus Route Challenge',
    startX: 16,
    startZ: -940,
    startDistrict: 'Uttara Sector 7',
    reward: 42000,
    timeLimit: 195,
    description: 'Drive commuters along the grand North-South highway from Uttara through Banani, Farmgate, and Shahbagh to Motijheel!',
    waypoints: [
      { x: 0, z: -420, label: 'Stop 1: Banani Road 11 Bus Shed' },
      { x: -380, z: -190, label: 'Stop 2: Farmgate Overbridge Bus Stand' },
      { x: 0, z: 75, label: 'Stop 3: Shahbagh Central Bus Stop' },
      { x: 660, z: 360, label: 'Final Terminal: Motijheel Shapla Square' }
    ]
  },
  {
    id: 'heritage_photo_tour',
    title: 'Dhaka Heritage Photography Tour',
    bnTitle: 'ঐতিহ্যবাহী ঢাকা ফটোগ্রাফি মিশন',
    type: 'Photography & Exploration',
    startX: -650,
    startZ: 535,
    startDistrict: 'Lalbagh Fort',
    reward: 30000,
    timeLimit: 210,
    requiresPhoto: true,
    description: 'Visit Dhaka’s historic gems and press [P] inside each marker to photograph Lalbagh Fort, Sadarghat, Ahsan Manzil, and Hatirjheel!',
    waypoints: [
      { x: -680, z: 540, label: 'Snap Photo [P] at Lalbagh Mughal Fort' },
      { x: -180, z: 775, label: 'Snap Photo [P] of Sadarghat Launches' },
      { x: 180, z: 755, label: 'Snap Photo [P] of Ahsan Manzil Pink Palace' },
      { x: 380, z: 0, label: 'Snap Photo [P] at Hatirjheel Arch Bridge' }
    ]
  },
  {
    id: 'puran_dhaka_parcel',
    title: 'Old Dhaka Spice & Parcel Run',
    bnTitle: 'পুরান ঢাকা পার্সেল ডেলিভারি',
    type: 'Special Story / Package Delivery',
    startX: -165,
    startZ: 540,
    startDistrict: 'Old Dhaka (Puran Dhaka)',
    reward: 28000,
    timeLimit: 165,
    description: 'Collect wholesale spice parcels in Old Dhaka and deliver them to Ahsan Manzil, Dhanmondi, and Farmgate!',
    waypoints: [
      { x: 170, z: 755, label: 'Drop Parcel 1 near Ahsan Manzil Market' },
      { x: -500, z: 110, label: 'Drop Parcel 2 at Dhanmondi Road 27' },
      { x: -375, z: -185, label: 'Drop Final Parcel at Farmgate Market' }
    ]
  },
  {
    id: 'water_taxi_regatta',
    title: 'Hatirjheel Water Taxi Regatta',
    bnTitle: 'হাতিরঝিল ওয়াটার ট্যাক্সি নৌকা রেস',
    type: 'Boat / Watercraft Challenge',
    startX: 252,
    startZ: -15,
    startDistrict: 'Hatirjheel Lakefront',
    reward: 32000,
    timeLimit: 120,
    description: 'Board the Hatirjheel Water Taxi Speed Boat at the dock and race across the north, central, and south lake buoys!',
    waypoints: [
      { x: 340, z: -135, label: 'Pass North Hatirjheel Lake Buoy' },
      { x: 430, z: 0, label: 'Pass Central Rainbow Bridge Buoy' },
      { x: 380, z: 125, label: 'Pass South Waterfront Buoy' },
      { x: 265, z: 10, label: 'Return to Hatirjheel West Dock' }
    ]
  },
  {
    id: 'stadium_cargo_convoy',
    title: 'Tejgaon to Mirpur Stadium Freight Run',
    bnTitle: 'তেজগাঁও-মিরপুর স্টেডিয়াম কার্গো মিশন',
    type: 'Heavy Truck / Logistics',
    startX: -660,
    startZ: -185,
    startDistrict: 'Tejgaon Industrial & Rail Hub',
    reward: 36000,
    timeLimit: 165,
    description: 'Haul floodlight equipment from Tejgaon Industrial Zone through Mirpur to the Stadium complex!',
    waypoints: [
      { x: -380, z: -190, label: 'Clear Farmgate Commercial Intersection' },
      { x: -380, z: -420, label: 'Pass West Banani Highway' },
      { x: -680, z: -680, label: 'Deliver Freight at Mirpur Stadium Zone' }
    ]
  },
  {
    id: 'savar_superbike_gp',
    title: 'Savar-Ashulia Highway Superbike GP',
    bnTitle: 'সাভার-আশুলিয়া সুপারবাইক রেস',
    type: 'Motorcycle Street Race',
    startX: -38,
    startZ: 88,
    startDistrict: 'Shahbagh & Moto Showroom Hub',
    reward: 50000,
    timeLimit: 170,
    description: 'Blast north from the Dhaka Motorcycle Showroom through Farmgate, Mirpur, and Uttara to the Savar-Ashulia Highway Outskirts!',
    waypoints: [
      { x: -380, z: -190, label: 'Checkpoint 1: Farmgate Overpass' },
      { x: -680, z: -680, label: 'Checkpoint 2: Mirpur 10 Roundabout' },
      { x: -960, z: -960, label: 'Finish Line: Savar-Ashulia Highway Town' }
    ]
  },
  {
    id: 'keraniganj_dirt_rally',
    title: 'Keraniganj Riverside Dirt Bike Rally',
    bnTitle: 'কেরানীগঞ্জ রিভারসাইড ডার্ট বাইক চ্যালেঞ্জ',
    type: 'Off-Road Bike Challenge',
    startX: 195,
    startZ: 760,
    startDistrict: 'Ahsan Manzil Waterfront',
    reward: 38000,
    timeLimit: 135,
    description: 'Ride along the southern riverside corridor from Ahsan Manzil to Keraniganj Town and Motijheel!',
    waypoints: [
      { x: 380, z: 780, label: 'Pass Buriganga East Embankment' },
      { x: 680, z: 780, label: 'Reach Keraniganj Riverside Town' },
      { x: 680, z: 360, label: 'Finish at Motijheel Shapla Square' }
    ]
  }
];

export class MissionSystem {
  constructor(scene, sound) {
    this.scene = scene;
    this.sound = sound;

    this.missions = DHAKA_MISSIONS;
    this.completedIds = new Set();
    this.activeMission = null;
    this.currentWaypointIndex = 0;
    this.timer = 0;

    this.startMarkers = [];
    this.collectibles = [];
    this.collectedIds = new Set();
    this.activeBeacon = null;

    this.buildMissionMarkers();
    this.buildCollectibles();
    this.buildActiveDestinationBeacon();
  }

  buildMissionMarkers() {
    if (!this.scene) return;
    this.missions.forEach((m) => {
      const group = new THREE.Group();

      const ringGeo = new THREE.RingGeometry(2.2, 3.1, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.34;
      group.add(ring);

      const pillarGeo = new THREE.CylinderGeometry(2.2, 2.2, 7.5, 16, 1, true);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.y = 3.75;
      group.add(pillar);

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.95, 0),
        new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.8
        })
      );
      crystal.position.y = 3.2;
      group.add(crystal);

      group.position.set(m.startX, 0, m.startZ);
      this.scene.add(group);

      this.startMarkers.push({
        mission: m,
        group,
        crystal,
        ringMat
      });
    });
  }

  buildCollectibles() {
    if (!this.scene) return;
    const coords = [
      { id: 'col_1', x: 0, z: -980, name: 'Uttara Golden Token' },
      { id: 'col_2', x: 18, z: -435, name: 'Banani Golden Token' },
      { id: 'col_3', x: 695, z: -435, name: 'Gulshan-2 Golden Token' },
      { id: 'col_4', x: -395, z: -205, name: 'Farmgate Golden Token' },
      { id: 'col_5', x: 380, z: 0, name: 'Hatirjheel Bridge Token' },
      { id: 'col_6', x: -500, z: 110, name: 'Dhanmondi Lake Token' },
      { id: 'col_7', x: -25, z: 85, name: 'Shahbagh Plaza Token' },
      { id: 'col_8', x: 680, z: 330, name: 'Motijheel Shapla Token' },
      { id: 'col_9', x: -680, z: -660, name: 'Mirpur Stadium Token' },
      { id: 'col_10', x: -695, z: 535, name: 'Lalbagh Fort Token' },
      { id: 'col_11', x: 180, z: 755, name: 'Ahsan Manzil Token' },
      { id: 'col_12', x: -180, z: 790, name: 'Sadarghat River Token' }
    ];

    const mat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.2
    });

    coords.forEach((c) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.24, 10, 20), mat);
      mesh.position.set(c.x, 1.8, c.z);
      this.scene.add(mesh);
      this.collectibles.push({ ...c, mesh });
    });
  }

  buildActiveDestinationBeacon() {
    if (!this.scene) return;
    const group = new THREE.Group();

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.8, 5.2, 28),
      new THREE.MeshBasicMaterial({ color: 0xff2a85, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.36;
    group.add(ring);

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.6, 45, 18, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xff2a85,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide
      })
    );
    beam.position.y = 22.5;
    group.add(beam);

    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 3.4, 8),
      new THREE.MeshBasicMaterial({ color: 0xff2a85 })
    );
    arrow.rotation.x = Math.PI;
    arrow.position.y = 5.5;
    group.add(arrow);

    group.visible = false;
    this.scene.add(group);
    this.activeBeacon = { group, arrow };
  }

  getNearestStartMarker(x, z) {
    if (this.activeMission) return null;
    let nearest = null;
    let minDist = 8.5;
    for (const sm of this.startMarkers) {
      const d = Math.hypot(x - sm.mission.startX, z - sm.mission.startZ);
      if (d < minDist) {
        minDist = d;
        nearest = sm.mission;
      }
    }
    return nearest;
  }

  startMission(missionId, onToast) {
    const m = this.missions.find((item) => item.id === missionId);
    if (!m) return false;

    this.activeMission = m;
    this.currentWaypointIndex = 0;
    this.timer = m.timeLimit;

    for (const sm of this.startMarkers) {
      sm.group.visible = false;
    }

    this.syncBeaconToCurrentWaypoint();
    if (this.sound) this.sound.playChime('checkpoint');
    if (onToast) {
      onToast(`MISSION STARTED: ${m.title}`, m.waypoints[0].label, 'gold');
    }
    return true;
  }

  syncBeaconToCurrentWaypoint() {
    if (!this.activeBeacon) return;
    if (!this.activeMission) {
      this.activeBeacon.group.visible = false;
      return;
    }
    const wp = this.activeMission.waypoints[this.currentWaypointIndex];
    if (wp) {
      this.activeBeacon.group.position.set(wp.x, 0, wp.z);
      this.activeBeacon.group.visible = true;
    }
  }

  cancelMission(reason = 'Mission Aborted', onToast) {
    if (!this.activeMission) return;
    this.activeMission = null;
    if (this.activeBeacon) this.activeBeacon.group.visible = false;
    for (const sm of this.startMarkers) {
      sm.group.visible = true;
    }
    if (onToast) {
      onToast(reason, 'Return to any golden mission beacon to try again.', 'crimson');
    }
  }

  getCurrentWaypoint() {
    if (!this.activeMission) return null;
    return this.activeMission.waypoints[this.currentWaypointIndex] || null;
  }

  canSnapPhoto(player) {
    if (!this.activeMission || !this.activeMission.requiresPhoto) return false;
    const wp = this.getCurrentWaypoint();
    if (!wp) return false;
    return Math.hypot(player.x - wp.x, player.z - wp.z) < 18;
  }

  triggerPhotoSnap(player, onToast, onReward) {
    if (!this.canSnapPhoto(player)) return false;
    if (this.sound) this.sound.playChime('camera_shutter');
    this.advanceWaypoint(player, onToast, onReward);
    return true;
  }

  advanceWaypoint(player, onToast, onReward) {
    this.currentWaypointIndex++;
    if (this.currentWaypointIndex >= this.activeMission.waypoints.length) {
      const finished = this.activeMission;
      this.completedIds.add(finished.id);
      const reward = finished.reward;
      player.money += reward;

      this.activeMission = null;
      if (this.activeBeacon) this.activeBeacon.group.visible = false;
      for (const sm of this.startMarkers) {
        sm.group.visible = true;
        if (this.completedIds.has(sm.mission.id)) {
          sm.ringMat.color.setHex(0x10b981);
        }
      }

      if (this.sound) this.sound.playChime('mission_complete');
      if (onReward) onReward(finished, reward);
      if (onToast) {
        onToast(
          `MISSION PASSED! +৳${reward.toLocaleString()}`,
          `${finished.title} (${finished.bnTitle}) completed!`,
          'emerald'
        );
      }
    } else {
      this.syncBeaconToCurrentWaypoint();
      if (this.sound) this.sound.playChime('checkpoint');
      const nextWp = this.activeMission.waypoints[this.currentWaypointIndex];
      if (onToast) {
        onToast(
          `CHECKPOINT (${this.currentWaypointIndex}/${this.activeMission.waypoints.length})`,
          `Next: ${nextWp.label}`,
          'cyan'
        );
      }
    }
  }

  update(dt, player, onToast, onReward) {
    const time = performance.now() * 0.003;

    if (!this.activeMission) {
      for (const sm of this.startMarkers) {
        const dx = player.x - sm.mission.startX;
        const dz = player.z - sm.mission.startZ;
        const vis = dx * dx + dz * dz < 260 * 260;
        sm.group.visible = vis;
        if (vis) {
          sm.crystal.rotation.y = time;
          sm.crystal.position.y = 3.1 + Math.sin(time * 1.5) * 0.4;
        }
      }
    }

    for (const col of this.collectibles) {
      if (this.collectedIds.has(col.id)) {
        col.mesh.visible = false;
        continue;
      }
      const dx = player.x - col.x;
      const dz = player.z - col.z;
      const dSq = dx * dx + dz * dz;
      const vis = dSq < 220 * 220;
      col.mesh.visible = vis;
      if (!vis) continue;
      col.mesh.rotation.y = time * 1.8;
      if (Math.hypot(player.x - col.x, player.z - col.z) < 4.2) {
        this.collectedIds.add(col.id);
        col.mesh.visible = false;
        player.money += 5000;
        if (this.sound) this.sound.playChime('mission_complete');
        if (onToast) {
          onToast(
            `🏆 COLLECTIBLE FOUND! (+৳5,000)`,
            `${col.name} (${this.collectedIds.size}/${this.collectibles.length} Golden Tokens)`,
            'gold'
          );
        }
        if (onReward) onReward(col, 5000);
      }
    }

    if (!this.activeMission) return;

    if (this.activeBeacon) {
      this.activeBeacon.arrow.position.y = 5.5 + Math.sin(time * 2.5) * 0.85;
      this.activeBeacon.arrow.rotation.y = time * 1.5;
    }

    this.timer -= dt;
    if (this.timer <= 0) {
      this.cancelMission('MISSION FAILED — TIME EXPIRED!', onToast);
      return;
    }

    const wp = this.getCurrentWaypoint();
    if (wp && !this.activeMission.requiresPhoto) {
      const dist = Math.hypot(player.x - wp.x, player.z - wp.z);
      if (dist < 10.5) {
        this.advanceWaypoint(player, onToast, onReward);
      }
    }
  }
}

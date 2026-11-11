// src/player.js — Version 6.0 Reference-Aligned Third-Person Player Controller & 14-Joint Anatomical Human Rig
// Fixes reversed LEFT/RIGHT (A/D & ArrowLeft/ArrowRight) controls across all camera angles,
// adds smooth velocity acceleration/deceleration damping, upper-body cornering lean, and natural walk/run/sprint speeds.

export const GF_OUTFITS = {
  hot_pink_glam: {
    id: 'hot_pink_glam',
    name: 'Hot-Pink Vice Club Bodycon Dress',
    bnName: 'হট-পিঙ্ক গ্ল্যামারাস পার্টি ড্রেস',
    topHex: 0xff2a85,
    skirtHex: 0xe11d48,
    heelHex: 0xfef08a,
    price: 0
  },
  ruby_evening_gown: {
    id: 'ruby_evening_gown',
    name: 'Ruby Red Silk Date Dress',
    bnName: 'রুবি রেড সিল্ক ডেটিং ড্রেস',
    topHex: 0xdc2626,
    skirtHex: 0x991b1b,
    heelHex: 0xfde047,
    price: 6500
  },
  midnight_sequin: {
    id: 'midnight_sequin',
    name: 'Midnight Black & Gold VIP Club Dress',
    bnName: 'মিডনাইট ব্ল্যাক ভিআইপি ক্লাব ড্রেস',
    topHex: 0x111827,
    skirtHex: 0x1e293b,
    heelHex: 0xf59e0b,
    price: 9500
  },
  emerald_queen: {
    id: 'emerald_queen',
    name: 'Emerald Luxury Designer Gown',
    bnName: 'এমেরাল্ড লাক্সারি ডিজাইনার ড্রেস',
    topHex: 0x10b981,
    skirtHex: 0x047857,
    heelHex: 0xf8fafc,
    price: 12000
  }
};

export const PLAYER_OUTFITS = {
  street_jacket: {
    id: 'street_jacket',
    name: 'Tommy Vercetti Cyan Tropical Shirt & Jeans',
    bnName: 'ভাইস সিটি সায়ান ট্রপিক্যাল শার্ট ও জিন্স',
    topHex: 0x06b6d4,
    innerHex: 0xf8fafc,
    pantsHex: 0x1d4ed8,
    shoeHex: 0xf8fafc,
    style: 'shirt',
    price: 0
  },
  miami_white_suit: {
    id: 'miami_white_suit',
    name: 'Miami Vice White Linen Suit & Pastel Tee',
    bnName: 'মিয়ামি ভাইস হোয়াইট স্যুট',
    topHex: 0xf8fafc,
    innerHex: 0xff2a85,
    pantsHex: 0xf1f5f9,
    shoeHex: 0x0f172a,
    style: 'jacket',
    price: 8500
  },
  panjabi_festive: {
    id: 'panjabi_festive',
    name: 'Royal Maroon Embroidered Panjabi',
    bnName: 'রাজকীয় মেরুন পাঞ্জাবি ও পায়জামা',
    topHex: 0x991b1b,
    innerHex: 0xfef08a,
    pantsHex: 0xf8fafc,
    shoeHex: 0x451a03,
    style: 'panjabi',
    price: 4500
  },
  gulshan_exec: {
    id: 'gulshan_exec',
    name: 'Gulshan Executive Black Mafia Suit',
    bnName: 'গুলশান এক্সিকিউটিভ ব্ল্যাক স্যুট',
    topHex: 0x0f172a,
    innerHex: 0x38bdf8,
    pantsHex: 0x090d16,
    shoeHex: 0x0f172a,
    style: 'jacket',
    price: 12000
  },
  biker_leather: {
    id: 'biker_leather',
    name: 'Padma Superbike Crimson Racing Leather',
    bnName: 'সুপারবাইক রেসিং লেদার জ্যাকেট',
    topHex: 0xdc2626,
    innerHex: 0x111827,
    pantsHex: 0x0f172a,
    shoeHex: 0xef4444,
    style: 'jacket',
    price: 14000
  },
  casual_polo: {
    id: 'casual_polo',
    name: 'Tiger Gold Designer Polo & Chinos',
    bnName: 'টাইগার গোল্ড ডিজাইনার পোলো শার্ট',
    topHex: 0xeab308,
    innerHex: 0x0f172a,
    pantsHex: 0x1e293b,
    shoeHex: 0xf8fafc,
    style: 'shirt',
    price: 5500
  }
};

// Pure mathematical helper so automated tests can verify camera-relative WASD directions without DOM/WebGL
export function computeCameraRelativeMovement(moveForward, moveRight, cameraYaw) {
  if (moveForward === 0 && moveRight === 0) {
    return { targetHeading: cameraYaw + Math.PI, dirX: 0, dirZ: 0 };
  }
  // In Three.js:
  // Camera is at (player.x + sin(cameraYaw)*d, player.z + cos(cameraYaw)*d) looking at player.
  // Camera Forward vector on XZ plane: fwd = (-sin(cameraYaw), -cos(cameraYaw)) -> heading = cameraYaw + PI
  // Camera Right vector on XZ plane (fwd x Up): right = (+cos(cameraYaw), -sin(cameraYaw)) -> heading = cameraYaw + PI/2
  // Since velocity (dx, dz) = (sin(heading), cos(heading)), subtracting inputAngle = atan2(moveRight, moveForward)
  // yields:
  //   moveForward=+1, moveRight=0 (W) -> targetHeading = cameraYaw + PI -> (-sin(yaw), -cos(yaw)) = Forward
  //   moveForward=0, moveRight=+1 (D / Right) -> targetHeading = cameraYaw + PI/2 -> (+cos(yaw), -sin(yaw)) = Screen Right
  //   moveForward=0, moveRight=-1 (A / Left) -> targetHeading = cameraYaw - PI/2 -> (-cos(yaw), +sin(yaw)) = Screen Left
  //   moveForward=-1, moveRight=0 (S / Back) -> targetHeading = cameraYaw -> (+sin(yaw), +cos(yaw)) = Backward
  const inputAngle = Math.atan2(moveRight, moveForward);
  const targetHeading = cameraYaw - inputAngle + Math.PI;
  return {
    targetHeading,
    dirX: Math.sin(targetHeading),
    dirZ: Math.cos(targetHeading)
  };
}

// Shared Geometry & Material Pool for Character Rigs (Prevents 9,500+ duplicate WebGL buffer uploads)
const _rigGeos = {};
function _getRigGeo(key, createFn) {
  if (!_rigGeos[key]) _rigGeos[key] = createFn();
  return _rigGeos[key];
}

const _rigMats = {};
function _getSharedRigMat(key, createFn) {
  if (!_rigMats[key]) _rigMats[key] = createFn();
  return _rigMats[key];
}

// Reusable 14-Joint Anatomical 3D Human Character Builder (Used by Player & Diverse Bangladeshi NPCs)
export function buildAnatomicalHumanRig(options = {}) {
  if (typeof THREE === 'undefined') {
    return { root: null, joints: {}, materials: {} };
  }

  const {
    skinHex = 0xc68642,
    hairHex = 0x111827,
    topHex = 0x059669,
    innerHex = 0xf8fafc,
    pantsHex = 0x1e3a8a,
    shoeHex = 0x111827,
    scaleY = 1.0,
    scaleXZ = 1.0,
    isFemale = false,
    hasBeard = true,
    hasSunglasses = false,
    hasHelmet = false,
    helmetHex = 0xdc2626,
    isHero = false,
    castShadow = false
  } = options;

  const root = new THREE.Group();
  root.scale.set(scaleXZ, scaleY, scaleXZ);

  const makeMat = (key, fn) => (isHero ? fn() : _getSharedRigMat(key, fn));

  const skinMat = makeMat(`skin_${skinHex}`, () => new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.62, metalness: 0.04 }));
  const hairMat = makeMat(`hair_${hairHex}`, () => new THREE.MeshStandardMaterial({ color: hairHex, roughness: 0.82 }));
  const topMat = makeMat(`top_${topHex}`, () => new THREE.MeshStandardMaterial({ color: topHex, roughness: 0.58 }));
  const innerMat = makeMat(`inner_${innerHex}`, () => new THREE.MeshStandardMaterial({ color: innerHex, roughness: 0.65 }));
  const pantsMat = makeMat(`pants_${pantsHex}`, () => new THREE.MeshStandardMaterial({ color: pantsHex, roughness: 0.72 }));
  const shoeMat = makeMat(`shoe_${shoeHex}`, () => new THREE.MeshStandardMaterial({ color: shoeHex, roughness: 0.45, metalness: 0.15 }));
  const eyeWhiteMat = _getSharedRigMat('eyeWhite', () => new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
  const pupilMat = _getSharedRigMat('pupil', () => new THREE.MeshBasicMaterial({ color: 0x0f172a }));
  const lipMat = _getSharedRigMat('lip', () => new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.6 }));
  const beltMat = _getSharedRigMat('belt', () => new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4, metalness: 0.3 }));
  const goldMat = _getSharedRigMat('gold', () => new THREE.MeshStandardMaterial({ color: 0xfde047, metalness: 0.9, roughness: 0.15 }));
  const shadesMat = _getSharedRigMat('shades', () => new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.15, metalness: 0.85 }));
  const soleMat = _getSharedRigMat('sole', () => new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 }));

  // 1. Pelvis / Hips Root Joint (y = 0.96m)
  const pelvisJoint = new THREE.Group();
  pelvisJoint.position.y = 0.96;
  root.add(pelvisJoint);

  const pelvisMesh = new THREE.Mesh(
    _getRigGeo('pelvis', () => new THREE.CylinderGeometry(0.185, 0.175, 0.2, 10)),
    pantsMat
  );
  pelvisMesh.scale.set(1.12, 1.0, 0.78);
  pelvisMesh.castShadow = castShadow;
  pelvisJoint.add(pelvisMesh);

  if (isHero) {
    const beltMesh = new THREE.Mesh(
      _getRigGeo('belt', () => new THREE.CylinderGeometry(0.19, 0.19, 0.045, 10)),
      beltMat
    );
    beltMesh.scale.set(1.13, 1.0, 0.79);
    beltMesh.position.y = 0.07;
    pelvisJoint.add(beltMesh);
  }

  // 2. Spine / Torso Joint
  const spineJoint = new THREE.Group();
  spineJoint.position.y = 0.09;
  pelvisJoint.add(spineJoint);

  // Lower Abdomen
  const abdomenMesh = new THREE.Mesh(
    _getRigGeo('abdomen', () => new THREE.CylinderGeometry(0.195, 0.178, 0.26, 10)),
    topMat
  );
  abdomenMesh.scale.set(1.15, 1.0, 0.76);
  abdomenMesh.position.y = 0.13;
  abdomenMesh.castShadow = castShadow;
  spineJoint.add(abdomenMesh);

  // Upper Sculpted Chest / Ribcage
  const chestMesh = new THREE.Mesh(
    isFemale
      ? _getRigGeo('chest_f', () => new THREE.CylinderGeometry(0.205, 0.145, 0.34, 12))
      : _getRigGeo('chest_m', () => new THREE.CylinderGeometry(0.235, 0.195, 0.34, 12)),
    topMat
  );
  chestMesh.scale.set(isFemale ? 1.12 : 1.18, 1.0, isFemale ? 0.82 : 0.8);
  chestMesh.position.y = 0.41;
  chestMesh.castShadow = castShadow;
  spineJoint.add(chestMesh);

  if (isFemale) {
    abdomenMesh.scale.set(0.86, 1.0, 0.68);
    if (isHero) {
      [-0.078, 0.078].forEach((bx) => {
        const bust = new THREE.Mesh(_getRigGeo('bust', () => new THREE.SphereGeometry(0.088, 10, 10)), topMat);
        bust.scale.set(1.0, 0.95, 1.12);
        bust.position.set(bx, 0.43, 0.11);
        spineJoint.add(bust);
      });
      const necklace = new THREE.Mesh(
        _getRigGeo('necklace', () => new THREE.TorusGeometry(0.095, 0.012, 6, 14)),
        goldMat
      );
      necklace.rotation.x = Math.PI / 2 + 0.18;
      necklace.position.set(0, 0.57, 0.03);
      spineJoint.add(necklace);
    }
    const skirtMesh = new THREE.Mesh(
      _getRigGeo('skirt', () => new THREE.CylinderGeometry(0.155, 0.255, 0.34, 12)),
      pantsMat
    );
    skirtMesh.scale.set(1.12, 1.0, 0.88);
    skirtMesh.position.y = -0.08;
    pelvisJoint.add(skirtMesh);
  }

  if (isHero) {
    const innerShirtPanel = new THREE.Mesh(
      _getRigGeo('innerShirt', () => new THREE.BoxGeometry(0.14, 0.32, 0.31)),
      innerMat
    );
    innerShirtPanel.position.set(0, 0.42, 0.01);
    spineJoint.add(innerShirtPanel);

    const collarMesh = new THREE.Mesh(
      _getRigGeo('collar', () => new THREE.CylinderGeometry(0.125, 0.14, 0.08, 10)),
      topMat
    );
    collarMesh.position.y = 0.59;
    spineJoint.add(collarMesh);
  }

  // 3. Neck & Sculpted Anatomical Head Group
  const neckJoint = new THREE.Group();
  neckJoint.position.y = 0.6;
  spineJoint.add(neckJoint);

  const neckCyl = new THREE.Mesh(
    _getRigGeo('neck', () => new THREE.CylinderGeometry(0.072, 0.084, 0.13, 8)),
    skinMat
  );
  neckCyl.position.y = 0.05;
  neckJoint.add(neckCyl);

  const headGroup = new THREE.Group();
  headGroup.position.y = 0.21;
  neckJoint.add(headGroup);

  // Sculpted Cranium
  const cranium = new THREE.Mesh(_getRigGeo('cranium', () => new THREE.SphereGeometry(0.148, 12, 10)), skinMat);
  cranium.scale.set(0.92, 1.08, 0.98);
  cranium.castShadow = castShadow;
  headGroup.add(cranium);

  if (isHero) {
    const jaw = new THREE.Mesh(_getRigGeo('jaw', () => new THREE.CylinderGeometry(0.115, 0.082, 0.12, 10)), skinMat);
    jaw.scale.set(0.95, 1.0, 0.92);
    jaw.position.set(0, -0.065, 0.018);
    headGroup.add(jaw);

    const nose = new THREE.Mesh(_getRigGeo('nose', () => new THREE.ConeGeometry(0.024, 0.065, 6)), skinMat);
    nose.rotation.x = Math.PI / 2 - 0.25;
    nose.position.set(0, -0.005, 0.15);
    headGroup.add(nose);

    [-0.138, 0.138].forEach((ex) => {
      const ear = new THREE.Mesh(_getRigGeo('ear', () => new THREE.SphereGeometry(0.032, 6, 6)), skinMat);
      ear.scale.set(0.45, 1.15, 0.75);
      ear.position.set(ex, 0.0, -0.005);
      headGroup.add(ear);
    });

    [-0.052, 0.052].forEach((ex) => {
      const brow = new THREE.Mesh(_getRigGeo('brow', () => new THREE.BoxGeometry(0.044, 0.011, 0.016)), hairMat);
      brow.position.set(ex, 0.048, 0.136);
      headGroup.add(brow);

      const sclera = new THREE.Mesh(_getRigGeo('sclera', () => new THREE.SphereGeometry(0.021, 6, 6)), eyeWhiteMat);
      sclera.scale.set(1.15, 0.82, 0.6);
      sclera.position.set(ex, 0.022, 0.135);
      headGroup.add(sclera);

      const pupil = new THREE.Mesh(_getRigGeo('pupil', () => new THREE.SphereGeometry(0.011, 6, 6)), pupilMat);
      pupil.position.set(ex, 0.022, 0.145);
      headGroup.add(pupil);
    });

    const lips = new THREE.Mesh(_getRigGeo('lips', () => new THREE.BoxGeometry(0.052, 0.014, 0.018)), lipMat);
    lips.position.set(0, -0.068, 0.132);
    headGroup.add(lips);
  }

  if (hasBeard && !isFemale) {
    const beard = new THREE.Mesh(
      _getRigGeo('beard', () => new THREE.CylinderGeometry(0.118, 0.086, 0.095, 10, 1, false, -Math.PI * 0.45, Math.PI * 0.9)),
      hairMat
    );
    beard.position.set(0, -0.072, 0.024);
    headGroup.add(beard);
  }

  if (hasSunglasses) {
    const shades = new THREE.Mesh(
      _getRigGeo('shades', () => new THREE.BoxGeometry(0.19, 0.042, 0.03)),
      shadesMat
    );
    shades.position.set(0, 0.025, 0.144);
    headGroup.add(shades);
  }

  if (hasHelmet) {
    const helmetMat = _getSharedRigMat(`helmet_${helmetHex}`, () => new THREE.MeshStandardMaterial({ color: helmetHex, roughness: 0.2, metalness: 0.6 }));
    const visorMat = _getSharedRigMat('helmet_visor', () => new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 }));
    const helmetShell = new THREE.Mesh(
      _getRigGeo('helmet', () => new THREE.SphereGeometry(0.172, 12, 10)),
      helmetMat
    );
    helmetShell.position.y = 0.02;
    headGroup.add(helmetShell);

    const visor = new THREE.Mesh(
      _getRigGeo('visor', () => new THREE.CylinderGeometry(0.165, 0.165, 0.09, 10, 1, false, -Math.PI * 0.38, Math.PI * 0.76)),
      visorMat
    );
    visor.position.set(0, 0.02, 0.02);
    headGroup.add(visor);
  } else {
    const hairCrown = new THREE.Mesh(
      _getRigGeo('hairCrown', () => new THREE.SphereGeometry(0.154, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.58)),
      hairMat
    );
    hairCrown.scale.set(0.94, 1.08, 1.02);
    hairCrown.position.set(0, 0.022, -0.008);
    hairCrown.castShadow = castShadow;
    headGroup.add(hairCrown);

    if (isFemale) {
      const longBackHair = new THREE.Mesh(
        _getRigGeo('longBackHair', () => new THREE.BoxGeometry(0.28, 0.52, 0.11)),
        hairMat
      );
      longBackHair.position.set(0, -0.18, -0.11);
      longBackHair.rotation.x = 0.08;
      headGroup.add(longBackHair);

      if (isHero) {
        [-0.125, 0.125].forEach((hx) => {
          const sideLock = new THREE.Mesh(_getRigGeo('sideLock', () => new THREE.CylinderGeometry(0.045, 0.028, 0.42, 8)), hairMat);
          sideLock.position.set(hx, -0.15, 0.03);
          headGroup.add(sideLock);

          const earring = new THREE.Mesh(
            _getRigGeo('earring', () => new THREE.TorusGeometry(0.026, 0.005, 6, 10)),
            goldMat
          );
          earring.rotation.y = Math.PI / 2;
          earring.position.set(hx * 1.14, -0.035, 0.0);
          headGroup.add(earring);
        });
      }
    }
  }

  // 4. Multi-Joint Articulated Arms
  const buildArm = (sideSign) => {
    const shoulderJoint = new THREE.Group();
    shoulderJoint.position.set(sideSign * 0.285, 0.52, 0);
    spineJoint.add(shoulderJoint);

    const upperArm = new THREE.Mesh(_getRigGeo('upperArm', () => new THREE.CylinderGeometry(0.068, 0.056, 0.29, 8)), topMat);
    upperArm.position.y = -0.145;
    upperArm.castShadow = castShadow;
    shoulderJoint.add(upperArm);

    const elbowJoint = new THREE.Group();
    elbowJoint.position.y = -0.29;
    shoulderJoint.add(elbowJoint);

    const forearm = new THREE.Mesh(_getRigGeo('forearm', () => new THREE.CylinderGeometry(0.054, 0.044, 0.26, 8)), skinMat);
    forearm.position.y = -0.13;
    forearm.castShadow = castShadow;
    elbowJoint.add(forearm);

    const handGroup = new THREE.Group();
    handGroup.position.y = -0.27;
    elbowJoint.add(handGroup);

    const palm = new THREE.Mesh(_getRigGeo('palm', () => new THREE.BoxGeometry(0.042, 0.095, 0.068)), skinMat);
    palm.position.y = -0.015;
    handGroup.add(palm);

    return { shoulderJoint, elbowJoint, handGroup };
  };

  const leftArmRig = buildArm(-1);
  const rightArmRig = buildArm(1);

  // 5. Multi-Joint Articulated Legs
  const buildLeg = (sideSign) => {
    const hipJoint = new THREE.Group();
    hipJoint.position.set(sideSign * 0.125, -0.06, 0);
    pelvisJoint.add(hipJoint);

    const legMat = isFemale ? skinMat : pantsMat;
    const thigh = new THREE.Mesh(
      isFemale
        ? _getRigGeo('thigh_f', () => new THREE.CylinderGeometry(0.092, 0.072, 0.44, 8))
        : _getRigGeo('thigh_m', () => new THREE.CylinderGeometry(0.098, 0.072, 0.44, 8)),
      pantsMat
    );
    thigh.position.y = -0.22;
    thigh.castShadow = castShadow;
    hipJoint.add(thigh);

    const kneeJoint = new THREE.Group();
    kneeJoint.position.y = -0.44;
    hipJoint.add(kneeJoint);

    const calf = new THREE.Mesh(_getRigGeo('calf', () => new THREE.CylinderGeometry(0.07, 0.048, 0.42, 8)), legMat);
    calf.position.y = -0.21;
    calf.castShadow = castShadow;
    kneeJoint.add(calf);

    const footGroup = new THREE.Group();
    footGroup.position.set(0, -0.42, 0.05);
    kneeJoint.add(footGroup);

    const shoeUpper = new THREE.Mesh(_getRigGeo('shoeUpper', () => new THREE.CylinderGeometry(0.058, 0.068, 0.24, 8)), shoeMat);
    shoeUpper.rotation.x = Math.PI / 2;
    shoeUpper.scale.set(1.0, 1.0, 0.65);
    footGroup.add(shoeUpper);

    if (isHero) {
      const sole = new THREE.Mesh(_getRigGeo('sole', () => new THREE.BoxGeometry(0.12, 0.03, 0.25)), soleMat);
      sole.position.y = -0.035;
      footGroup.add(sole);
    }

    return { hipJoint, kneeJoint, footGroup };
  };

  const leftLegRig = buildLeg(-1);
  const rightLegRig = buildLeg(1);

  return {
    root,
    joints: {
      pelvisJoint,
      spineJoint,
      neckJoint,
      headGroup,
      leftShoulder: leftArmRig.shoulderJoint,
      leftElbow: leftArmRig.elbowJoint,
      rightShoulder: rightArmRig.shoulderJoint,
      rightElbow: rightArmRig.elbowJoint,
      leftHip: leftLegRig.hipJoint,
      leftKnee: leftLegRig.kneeJoint,
      rightHip: rightLegRig.hipJoint,
      rightKnee: rightLegRig.kneeJoint
    },
    materials: {
      skinMat,
      hairMat,
      topMat,
      innerMat,
      pantsMat,
      shoeMat
    }
  };
}

export class PlayerCharacter {
  constructor(scene, city, sound) {
    this.scene = scene;
    this.city = city;
    this.sound = sound;

    // Position & Physics (Starts facing -Z = Math.PI so player faces away from cameraYaw=0!)
    this.x = -38;
    this.y = 0;
    this.z = 72; // Starts near Shahbagh Square & Dhaka Motorcycle Showroom
    this.vy = 0;
    this.heading = Math.PI;
    this.walkSpeed = 6.2;      // Slow walk (when holding Alt)
    this.runSpeed = 10.6;      // Standard GTA Vice City-style brisk street jog (default WASD)
    this.sprintSpeed = 15.6;   // Fast sprint (holding Shift)
    this.currentSpeed = 0;     // Smoothly damped movement speed
    this.jumpForce = 11.2;
    this.isGrounded = true;
    this.isSprinting = false;
    this.isWalkingSlow = false;
    this.isMoving = false;
    this.animTime = 0;
    this.idleTime = 0;
    this.actionAnimTimer = 0;

    // Gameplay State & Economy (Starts with ৳95,000 BDT so player can immediately test Bike Showroom!)
    this.health = 100;
    this.maxHealth = 100;
    this.armor = 100;
    this.maxArmor = 100;
    this.money = 95000;
    this.inVehicle = null;
    this.currentOutfit = 'street_jacket';
    this.ownedOutfits = new Set(['street_jacket']);
    this.ownedVehicles = new Set(['motorcycle', 'cng', 'sedan']);
    this.inventory = [];
    this.danceTimer = 0;

    this.isSeatedAtTable = false;
    this.seatedVenue = null;
    this.drinkToastTimer = 0;

    // Girlfriend (GF) Companion & Date System (Glamorous Nadia at x: -34, z: 112)
    const gfRig = buildAnatomicalHumanRig({
      skinHex: 0xe5b887,
      hairHex: 0x1c1917,
      topHex: 0xff2a85,
      innerHex: 0xfdf2f8,
      pantsHex: 0xe11d48,
      shoeHex: 0xfef08a,
      isFemale: true,
      hasBeard: false,
      hasSunglasses: false,
      isHero: true,
      castShadow: true
    });
    this.gf = {
      name: 'Nadia',
      bnName: 'নাদিয়া (গ্ল্যামারাস গার্লফ্রেন্ড)',
      following: false,
      relationship: 50, // 0 to 100% ♥
      datesCompleted: 0,
      currentOutfit: 'hot_pink_glam',
      ownedOutfits: new Set(['hot_pink_glam']),
      x: -34,
      z: 112,
      heading: Math.PI / 2,
      animTime: 0,
      mesh: gfRig.root,
      joints: gfRig.joints,
      materials: gfRig.materials
    };
    if (this.gf.mesh) {
      this.gf.mesh.position.set(this.gf.x, 0, this.gf.z);
      this.gf.mesh.rotation.y = this.gf.heading;
      if (this.scene) this.scene.add(this.gf.mesh);
    }

    const rig = buildAnatomicalHumanRig({
      skinHex: 0xc68642,
      hairHex: 0x111827,
      topHex: 0x06b6d4,
      innerHex: 0xf8fafc,
      pantsHex: 0x1d4ed8,
      hasBeard: true,
      isHero: true,
      castShadow: true
    });
    this.mesh = rig.root;
    this.joints = rig.joints;
    this.materials = rig.materials;

    if (this.mesh) {
      this.mesh.position.set(this.x, this.y, this.z);
      this.mesh.rotation.y = this.heading;
      if (this.scene) this.scene.add(this.mesh);
    }
  }

  equipOutfit(outfitId) {
    const spec = PLAYER_OUTFITS[outfitId];
    if (!spec) return false;
    this.currentOutfit = outfitId;
    this.ownedOutfits.add(outfitId);
    if (this.materials && this.materials.topMat) {
      this.materials.topMat.color.setHex(spec.topHex);
      this.materials.innerMat.color.setHex(spec.innerHex);
      this.materials.pantsMat.color.setHex(spec.pantsHex);
      if (spec.shoeHex && this.materials.shoeMat) {
        this.materials.shoeMat.color.setHex(spec.shoeHex);
      }
    }
    return true;
  }

  equipGirlfriendOutfit(gfOutfitId) {
    const spec = GF_OUTFITS[gfOutfitId];
    if (!spec || !this.gf) return false;
    this.gf.currentOutfit = gfOutfitId;
    this.gf.ownedOutfits.add(gfOutfitId);
    if (this.gf.materials && this.gf.materials.topMat) {
      this.gf.materials.topMat.color.setHex(spec.topHex);
      this.gf.materials.pantsMat.color.setHex(spec.skirtHex);
      if (spec.heelHex && this.gf.materials.shoeMat) {
        this.gf.materials.shoeMat.color.setHex(spec.heelHex);
      }
    }
    return true;
  }

  sitAtVIPDateTable(tableX, tableZ, venueName = 'Blue Moon Vice Bar') {
    if (this.inVehicle) this.exitVehicle();
    this.isSeatedAtTable = true;
    this.seatedVenue = { x: tableX, z: tableZ, name: venueName };
    this.gf.following = true;

    // Position player on left VIP sofa and GF Nadia across/beside on right VIP sofa!
    this.x = tableX - 1.1;
    this.z = tableZ;
    this.heading = Math.PI / 2;
    if (this.mesh) {
      this.mesh.position.set(this.x, 0, this.z);
      this.mesh.rotation.y = this.heading;
      this.mesh.visible = true;
    }

    this.gf.x = tableX + 1.1;
    this.gf.z = tableZ;
    this.gf.heading = -Math.PI / 2;
    if (this.gf.mesh) {
      this.gf.mesh.position.set(this.gf.x, 0, this.gf.z);
      this.gf.mesh.rotation.y = this.gf.heading;
      this.gf.mesh.visible = true;
    }

    this.applySeatedPose(this.joints, true);
    this.applySeatedPose(this.gf.joints, true);
    return true;
  }

  standUpFromDateTable() {
    if (!this.isSeatedAtTable) return false;
    this.isSeatedAtTable = false;
    this.seatedVenue = null;
    this.applySeatedPose(this.joints, false);
    if (this.gf) this.applySeatedPose(this.gf.joints, false);
    this.x -= 1.2;
    if (this.mesh) this.mesh.position.set(this.x, 0, this.z);
    return true;
  }

  applySeatedPose(j, seated = true) {
    if (!j || !j.leftHip) return;
    if (seated) {
      j.pelvisJoint.position.y = 0.58;
      j.spineJoint.rotation.x = -0.06;
      j.leftHip.rotation.x = -Math.PI / 2 + 0.08;
      j.rightHip.rotation.x = -Math.PI / 2 + 0.08;
      j.leftKnee.rotation.x = Math.PI / 2 - 0.08;
      j.rightKnee.rotation.x = Math.PI / 2 - 0.08;
      j.leftShoulder.rotation.x = -0.65;
      j.leftElbow.rotation.x = -0.85;
      j.rightShoulder.rotation.x = -0.95;
      j.rightElbow.rotation.x = -1.1;
    } else {
      j.pelvisJoint.position.y = 0.96;
      j.spineJoint.rotation.x = 0;
      j.leftHip.rotation.x = 0;
      j.rightHip.rotation.x = 0;
      j.leftKnee.rotation.x = 0;
      j.rightKnee.rotation.x = 0;
      j.leftShoulder.rotation.x = 0;
      j.rightShoulder.rotation.x = 0;
    }
  }

  triggerInteractionGesture() {
    this.actionAnimTimer = 0.65;
  }

  toggleGirlfriendCompanion(forceState) {
    const nextState = forceState !== undefined ? forceState : !this.gf.following;
    this.gf.following = nextState;
    if (this.inVehicle && this.inVehicle.pillionMeshGroup) {
      if (nextState && typeof this.inVehicle.ensurePillionRig === 'function') {
        this.inVehicle.ensurePillionRig();
      }
      this.inVehicle.pillionMeshGroup.visible = nextState;
    }
    if (this.gf.mesh) {
      this.gf.mesh.visible = !this.inVehicle;
    }
    return this.gf.following;
  }

  addGirlfriendRelationship(points = 20) {
    this.gf.relationship = Math.max(0, Math.min(100, this.gf.relationship + points));
    this.gf.datesCompleted++;
    return this.gf.relationship;
  }

  enterVehicle(vehicle) {
    this.inVehicle = vehicle;
    this.currentSpeed = 0;
    vehicle.driver = 'player';
    if (vehicle.riderMeshGroup) vehicle.riderMeshGroup.visible = true;
    if (vehicle.pillionMeshGroup) {
      if (this.gf.following && typeof vehicle.ensurePillionRig === 'function') {
        vehicle.ensurePillionRig();
      }
      vehicle.pillionMeshGroup.visible = !!this.gf.following;
    }
    if (this.mesh) this.mesh.visible = false;
    if (this.gf && this.gf.mesh && this.gf.following) this.gf.mesh.visible = false;
    if (this.sound) this.sound.playChime('ui');
  }

  exitVehicle() {
    if (!this.inVehicle) return null;
    const v = this.inVehicle;
    v.driver = null;
    if (v.riderMeshGroup) v.riderMeshGroup.visible = false;
    if (v.pillionMeshGroup) v.pillionMeshGroup.visible = false;
    v.speed *= 0.25;

    // Driver's left side in Three.js when facing v.heading is (+cos(v.heading), -sin(v.heading))
    const leftX = v.x + Math.cos(v.heading) * 2.6;
    const leftZ = v.z - Math.sin(v.heading) * 2.6;
    const col = this.city.checkCollision(leftX, leftZ, 0.7);
    if (!col.hit) {
      this.x = leftX;
      this.z = leftZ;
    } else {
      this.x = v.x - Math.cos(v.heading) * 2.6;
      this.z = v.z + Math.sin(v.heading) * 2.6;
    }

    this.y = 0;
    this.vy = 0;
    this.currentSpeed = 0;
    this.heading = v.heading;
    this.inVehicle = null;
    if (this.mesh) {
      this.mesh.position.set(this.x, this.y, this.z);
      this.mesh.rotation.y = this.heading;
      this.mesh.visible = true;
    }
    if (this.gf && this.gf.following) {
      this.gf.x = this.x + 1.4;
      this.gf.z = this.z + 0.8;
      if (this.gf.mesh) {
        this.gf.mesh.position.set(this.gf.x, 0, this.gf.z);
        this.gf.mesh.visible = true;
      }
    }
    if (this.sound) this.sound.playChime('ui');
    return v;
  }

  updateGirlfriendCompanion(dt) {
    if (!this.gf) return;
    if (this.inVehicle) {
      if (this.gf.following) {
        this.gf.x = this.x;
        this.gf.z = this.z;
        if (this.inVehicle.pillionMeshGroup) {
          if (typeof this.inVehicle.ensurePillionRig === 'function') {
            this.inVehicle.ensurePillionRig();
          }
          this.inVehicle.pillionMeshGroup.visible = true;
        }
        if (this.gf.mesh) this.gf.mesh.visible = false;
      }
      return;
    }
    if (this.gf.mesh) this.gf.mesh.visible = true;
    const gj = this.gf.joints;

    if (this.isSeatedAtTable) {
      this.gf.animTime += dt * 3.5;
      if (gj && gj.rightShoulder) {
        this.applySeatedPose(gj, true);
        // Raise glass in drinking toast motion!
        gj.rightShoulder.rotation.x = -1.15 + Math.sin(this.gf.animTime) * 0.25;
        gj.headGroup.rotation.y = Math.sin(this.gf.animTime * 0.7) * 0.15;
      }
      return;
    }
    if (!this.gf.following) {
      // Friendly wave at Nadia's Villa entrance (-34, 112)
      this.gf.animTime += dt * 4.5;
      if (gj && gj.rightShoulder) {
        gj.rightShoulder.rotation.x = -2.35;
        gj.rightShoulder.rotation.z = -0.35 + Math.sin(this.gf.animTime) * 0.25;
        gj.rightElbow.rotation.x = -0.4;
      }
      return;
    }

    // Follow player smoothly on foot or dance together when danceTimer > 0!
    const targetX = this.x + Math.cos(this.heading) * 1.45 - Math.sin(this.heading) * 0.9;
    const targetZ = this.z - Math.sin(this.heading) * 1.45 - Math.cos(this.heading) * 0.9;
    const dx = targetX - this.gf.x;
    const dz = targetZ - this.gf.z;
    const dist = Math.hypot(dx, dz);

    if (this.danceTimer > 0 && gj && gj.leftHip) {
      this.gf.animTime += dt * 10;
      const s = Math.sin(this.gf.animTime);
      gj.pelvisJoint.position.y = 0.96 + Math.abs(s) * 0.06;
      gj.spineJoint.rotation.y = s * 0.35;
      gj.spineJoint.rotation.z = Math.cos(this.gf.animTime) * 0.14;
      gj.leftShoulder.rotation.x = -1.8 + s * 0.45;
      gj.rightShoulder.rotation.x = -1.8 - s * 0.45;
      gj.leftHip.rotation.x = s * 0.35;
      gj.rightHip.rotation.x = -s * 0.35;
    } else if (dist > 0.45) {
      const moveSpd = Math.min(this.sprintSpeed, Math.max(this.runSpeed, dist * 4.5));
      this.gf.x += (dx / dist) * moveSpd * dt;
      this.gf.z += (dz / dist) * moveSpd * dt;
      this.gf.heading = Math.atan2(dx, dz);
      this.gf.animTime += dt * 10.5;
      const s = Math.sin(this.gf.animTime);
      const c = Math.cos(this.gf.animTime);
      if (gj && gj.leftHip) {
        gj.pelvisJoint.position.y = 0.96 + Math.abs(s) * 0.04;
        gj.leftHip.rotation.x = s * 0.55;
        gj.rightHip.rotation.x = -s * 0.55;
        gj.leftKnee.rotation.x = Math.max(0, -c * 0.65);
        gj.rightKnee.rotation.x = Math.max(0, c * 0.65);
        gj.leftShoulder.rotation.x = -s * 0.45;
        gj.rightShoulder.rotation.x = s * 0.45;
        gj.rightShoulder.rotation.z = 0;
      }
    } else if (gj && gj.leftHip) {
      gj.leftHip.rotation.x *= 0.85;
      gj.rightHip.rotation.x *= 0.85;
      gj.leftShoulder.rotation.x *= 0.85;
      gj.rightShoulder.rotation.x *= 0.85;
      gj.rightShoulder.rotation.z = 0;
    }

    if (this.gf.mesh) {
      this.gf.mesh.position.set(this.gf.x, 0, this.gf.z);
      this.gf.mesh.rotation.y = this.gf.heading;
    }
  }

  update(dt, keys, cameraYaw) {
    if (this.danceTimer > 0) this.danceTimer -= dt;
    this.updateGirlfriendCompanion(dt);
    if (this.isSeatedAtTable) {
      this.animTime += dt * 3.5;
      if (this.joints && this.joints.rightShoulder) {
        this.applySeatedPose(this.joints, true);
        this.joints.rightShoulder.rotation.x = -1.15 - Math.sin(this.animTime) * 0.25;
      }
      // If player presses W/A/S/D or Space while seated, stand up automatically!
      if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] || keys['Space']) {
        this.standUpFromDateTable();
      } else {
        return;
      }
    }
    if (this.inVehicle) {
      this.x = this.inVehicle.x;
      this.y = 0;
      this.z = this.inVehicle.z;
      this.heading = this.inVehicle.heading;
      return;
    }

    let moveForward = 0;
    let moveRight = 0;
    if (keys['KeyW'] || keys['ArrowUp']) moveForward += 1;
    if (keys['KeyS'] || keys['ArrowDown']) moveForward -= 1;
    if (keys['KeyA'] || keys['ArrowLeft']) moveRight -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) moveRight += 1;

    this.isSprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);
    this.isWalkingSlow = !!(keys['AltLeft'] || keys['AltRight']);
    const targetMaxSpeed = this.isSprinting
      ? this.sprintSpeed
      : this.isWalkingSlow
      ? this.walkSpeed
      : this.runSpeed;

    const j = this.joints;

    if (moveForward !== 0 || moveRight !== 0) {
      this.isMoving = true;
      this.currentSpeed += (targetMaxSpeed - this.currentSpeed) * Math.min(1, dt * 11);

      const { targetHeading } = computeCameraRelativeMovement(moveForward, moveRight, cameraYaw);

      let diff = targetHeading - this.heading;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.heading += diff * Math.min(1, dt * 14);

      const dx = Math.sin(this.heading) * this.currentSpeed * dt;
      const dz = Math.cos(this.heading) * this.currentSpeed * dt;

      if (!this.city.checkCollision(this.x + dx, this.z, 0.65).hit) {
        this.x += dx;
      }
      if (!this.city.checkCollision(this.x, this.z + dz, 0.65).hit) {
        this.z += dz;
      }

      // Multi-Joint Skeletal Walk / Run / Sprint Animation (Hip, Knee, Shoulder, Elbow, Spine & Pelvis Bob)
      const cycleRate = this.isSprinting ? 13.5 : this.isWalkingSlow ? 6.5 : 9.6;
      this.animTime += dt * cycleRate;
      const stride = this.isSprinting ? 0.78 : this.isWalkingSlow ? 0.36 : 0.54;
      const s = Math.sin(this.animTime);
      const c = Math.cos(this.animTime);

      if (j && j.leftHip) {
        j.pelvisJoint.position.y = 0.96 + Math.abs(s) * (this.isSprinting ? 0.06 : 0.032);
        j.spineJoint.rotation.y = -s * 0.14;
        j.spineJoint.rotation.x = this.isSprinting ? 0.17 : 0.06;
        j.spineJoint.rotation.z = Math.max(-0.18, Math.min(0.18, -diff * 0.15));

        // Hip swing + realistic knee bend on backward recovery phase
        j.leftHip.rotation.x = s * stride;
        j.rightHip.rotation.x = -s * stride;
        j.leftKnee.rotation.x = Math.max(0, -c * stride * 1.15);
        j.rightKnee.rotation.x = Math.max(0, c * stride * 1.15);

        // Opposite arm swing + natural elbow flexion
        j.leftShoulder.rotation.x = -s * stride * 0.85;
        j.leftElbow.rotation.x = -0.35 - Math.max(0, -s) * 0.45;

        if (this.actionAnimTimer <= 0) {
          j.rightShoulder.rotation.x = s * stride * 0.85;
          j.rightElbow.rotation.x = -0.35 - Math.max(0, s) * 0.45;
        }
      }
    } else {
      this.isMoving = false;
      this.currentSpeed *= Math.pow(0.01, dt);
      if (this.currentSpeed < 0.05) this.currentSpeed = 0;
      this.idleTime += dt * 2.2;

      if (j && j.leftHip) {
        const damp = Math.min(1, dt * 10);
        // Subtle natural breathing & head look idle animation
        j.pelvisJoint.position.y += (0.96 + Math.sin(this.idleTime) * 0.01 - j.pelvisJoint.position.y) * damp;
        j.spineJoint.rotation.x += (Math.sin(this.idleTime) * 0.02 - j.spineJoint.rotation.x) * damp;
        j.spineJoint.rotation.y += (Math.sin(this.idleTime * 0.5) * 0.04 - j.spineJoint.rotation.y) * damp;
        j.spineJoint.rotation.z *= 1 - damp;
        j.headGroup.rotation.y = Math.sin(this.idleTime * 0.45) * 0.14;

        j.leftHip.rotation.x *= 1 - damp;
        j.rightHip.rotation.x *= 1 - damp;
        j.leftKnee.rotation.x *= 1 - damp;
        j.rightKnee.rotation.x *= 1 - damp;
        j.leftShoulder.rotation.x *= 1 - damp;
        j.leftElbow.rotation.x += (-0.15 - j.leftElbow.rotation.x) * damp;

        if (this.actionAnimTimer <= 0) {
          j.rightShoulder.rotation.x *= 1 - damp;
          j.rightElbow.rotation.x += (-0.15 - j.rightElbow.rotation.x) * damp;
        }
      }
    }

    if (this.actionAnimTimer > 0 && j && j.rightShoulder) {
      this.actionAnimTimer -= dt;
      j.rightShoulder.rotation.x = -1.15;
      j.rightElbow.rotation.x = -0.65;
    }

    if (keys['Space'] && this.isGrounded) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.y += this.vy * dt;
      this.vy -= 28 * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isGrounded = true;
      }
    }

    const bound = this.city.worldHalfSize - 25;
    this.x = Math.max(-bound, Math.min(bound, this.x));
    this.z = Math.max(-bound, Math.min(bound, this.z));

    if (this.mesh) {
      this.mesh.position.set(this.x, this.y, this.z);
      this.mesh.rotation.y = this.heading;
    }
  }
}

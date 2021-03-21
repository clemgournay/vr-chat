
import * as THREE from 'three';
import { Avatar } from 'src/app/models/avatar.model';

export const avatars: Array<Avatar> = [
  {ID: 'archer', name: 'Archer', model: null, loaded: false, boudingBox: new THREE.Box3()},
  {ID: 'space-warrior', name: 'Space Warrior', model: null, loaded: false, boudingBox: new THREE.Box3()},
  {ID: 'ninja', name: 'Ninja', model: null, loaded: false, boudingBox: new THREE.Box3()},
];
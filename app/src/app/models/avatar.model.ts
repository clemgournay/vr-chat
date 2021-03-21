import * as THREE from 'three';

export class Avatar {
  ID: string;
  name: string;
  model: THREE.Group;
  boudingBox: THREE.Box3;
  loaded: boolean;
}
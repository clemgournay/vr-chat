import * as THREE from 'three';

import { Avatar } from './avatar.model';
import { Direction } from './direction.model';

export class User {
  ID?: string;
  name?: string;
  avatar?: Avatar;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  moving?: Direction;
  jump: boolean;
}
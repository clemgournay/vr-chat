
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { UserService } from 'src/app/services/user.service';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  
  self: User;
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  cameraHeight: number = null;
  scene: THREE.Scene = new THREE.Scene();
  controls = new PointerLockControls(this.camera, document.body);
  renderer: THREE.WebGLRenderer;
  characters: any = {};
  mixers: any = {};
  animations: any = {};

  showInstructions: boolean = true;

  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

  colliders: Array<THREE.Mesh> = [];

  prevTime: number = performance.now();  
  

  @ViewChild('view') view: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.self = this.userService.self;
    if (!this.self.avatar) this.router.navigateByUrl('/');
    this.cameraHeight = this.self.avatar.boudingBox.getSize().y - 10;
  }

  ngOnInit() {
    this.userService.others.subscribe((users: any) => {
      for (let userID in users) {
        this.userService.addOther(users[userID]);
        this.addAvatar(users[userID]);
      }
    });
    this.userService.newOther.subscribe((user: any) => {
      this.userService.addOther(user);
      this.addAvatar(user);
    });
    this.userService.othersPosition.subscribe((resp: any) => {
      this.characters[resp.ID].position.copy(resp.position);
      this.userService.updateOtherPosition(resp.ID, resp.position);
    });
    this.userService.othersRotation.subscribe((resp: any) => {
      console.log(resp);
      this.characters[resp.ID].rotation.y = resp.rotationY;
      this.userService.updateOtherRotationY(resp.ID, resp.rotationY);
    });
    this.userService.disconnectingOther.subscribe((userID: string) => {
      this.removeAvatar(userID);
      this.userService.removeOther(userID);
    });
  }

  addAvatar(user: any) {
    if (user.ID !== this.userService.getID() &&  !this.characters[user.ID]) {

      console.log('Add user', user.ID);

      const loader = new FBXLoader();
      loader.load(`./assets/models/avatars/${user.avatarID}.fbx`, (object: any) => {
          console.log(object);

          this.mixers[user.ID] = new THREE.AnimationMixer(object);
          if (object.animations[0]) {
            this.animations[user.ID] = {};
            this.animations[user.ID].iddle = this.mixers[user.ID].clipAction(object.animations[0]);
            this.animations[user.ID].iddle.play();
          }

          object.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
          });

          const pos = this.userService.others[user.ID].position;
          object.position.set(pos.x, pos.y, pos.z);
          object.name = user.ID;
          object.rotation.y = Math.PI;
          this.scene.add(object);
          this.characters[user.ID] = object;
      });
    }
  }

  removeAvatar(userID: string) {
    const char = this.scene.getObjectByName(userID);
    char.geometry.dispose();
    char.material.dispose();
    this.scene.remove(char);
    delete this.characters[userID];
  }

  ngAfterViewInit() {
    this.camera.position.y = this.userService.self.position.y + this.cameraHeight;
    this.scene.background = new THREE.Color(0xffffff);
		this.scene.fog = new THREE.Fog(0xffffff, 0, 1000);

		const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
		light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    const vertex = new THREE.Vector3();
		const color = new THREE.Color();
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
		floorGeometry.rotateX(-Math.PI / 2);
		let position = floorGeometry.attributes.position;
		for ( let i = 0, l = position.count; i < l; i ++ ) {
      vertex.fromBufferAttribute(position, i);
      vertex.x += Math.random() * 200 - 100;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 200 - 100;
			position.setXYZ(i, vertex.x, vertex.y, vertex.z);
		}
    
    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
		position = floorGeometry.attributes.position;
		const colorsFloor = [];
		for ( let i = 0, l = position.count; i < l; i ++ ) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
			colorsFloor.push( color.r, color.g, color.b );
    }

		floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));
    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		this.scene.add(floor);

    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.view.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop((time: number) => {
      this.update();
    });

    this.controls.addEventListener('lock', () => {
      this.showInstructions = false;
    });

    this.controls.addEventListener('unlock', () => {
      this.showInstructions = true;
    });

    this.scene.add(this.controls.getObject());

    window.onresize = () => {
      this.resize();
    }

  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.userService.move('forward', true);
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this.userService.move('left', true);
        break;

      case 'ArrowDown':
      case 'KeyS':
        this.userService.move('backward', true);
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.userService.move('right', true);
        break;
      case 'Space':
          if (this.userService.canJump()) this.velocity.y += 350;
          this.userService.changeState('jump', false);
          break;
    }
  }
  
  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.userService.move('forward', false);
        break;

      case 'ArrowLeft':
      case 'KeyA':
        this.userService.move('left', false);
        break;

      case 'ArrowDown':
      case 'KeyS':
        this.userService.move('backward', false);
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.userService.move('right', false);
        break;
    }
  }

  update() {
    const time = performance.now();

    for(let ID in this.mixers) {
      this.mixers[ID].update();
    }

		if (this.controls.isLocked) {

			this.raycaster.ray.origin.copy(this.controls.getObject().position);
			this.raycaster.ray.origin.y -= 10;
			const intersections = this.raycaster.intersectObjects(this.colliders);
			const delta = ( time - this.prevTime) / 1000;

			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;

      const mass = 100;
		  this.velocity.y -= 9.8 * mass * delta;

			this.direction.z = Number(this.userService.isMoving('forward')) - Number(this.userService.isMoving('backward'));
			this.direction.x = Number(this.userService.isMoving('right')) - Number(this.userService.isMoving('left'));
			this.direction.normalize(); // this ensures consistent movements in all directions

      if ( this.userService.isMoving('forward') || this.userService.isMoving('backward') ) this.velocity.z -= this.direction.z * 2000.0 * delta;
      if ( this.userService.isMoving('left') || this.userService.isMoving('right') ) this.velocity.x -= this.direction.x * 2000.0 * delta;

      if (intersections.length > 0) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.userService.changeState('jump', true);
      }

      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);

			this.controls.getObject().position.y += (this.velocity.y * delta); // new behavior

      if (this.controls.getObject().position.y < this.cameraHeight) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = this.cameraHeight;
        this.userService.changeState('jump', true);
      }

    } 
    
    const position = new THREE.Vector3();
    position.copy(this.controls.getObject().position);
    position.y = position.y - this.cameraHeight;
    if (!this.self.position.equals(position)) {
      this.userService.updatePosition(position);
    }

    const rotationY = this.controls.getObject().rotation.y;
    if (this.self.rotation.y !== rotationY) {
      this.userService.updateRotationY(rotationY);
    }

    this.prevTime = time;
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}

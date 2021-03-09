
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  
  user: any = {};
  users: any = {};
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  scene: THREE.Scene = new THREE.Scene();
  controls = new PointerLockControls(this.camera, document.body);
  renderer: THREE.WebGLRenderer;
  characters: any = {};

  showInstructions: boolean = true;

  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

  colliders: Array<THREE.Mesh> = [];

  prevTime: number = performance.now();  

  @ViewChild('view') view: ElementRef;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getProperties();
    this.userService.users.subscribe((users: any) => {
      this.users = users;
      console.log(users);
      for (let userID in this.users) {
        this.userService.addUser(userID);
        this.addCharacter(this.users[userID]);
      }
    });
    this.userService.usersPosition.subscribe((resp: any) => {
      this.characters[resp.ID].position.copy(resp.position);
      this.userService.updateUserPosition(resp.ID, resp.position);
    });
    this.userService.usersRotation.subscribe((resp: any) => {
      this.characters[resp.ID].rotation.copy(resp.rotation);
      this.userService.updateUserRotation(resp.ID, resp.rotation);
    });
    this.userService.disconnectingUser.subscribe((userID: string) => {
      this.removeCharacter(userID);
      this.userService.removeUser(userID);
    });
  }

  addCharacter(user: any) {
    if (user.ID !== this.userService.getID() &&  !this.characters[user.ID]) {
      const geometry = new THREE.BoxGeometry(20, 20, 20);
      const material = new THREE.MeshLambertMaterial({color: 'white'});
      const cube = new THREE.Mesh(geometry, material);
      cube.name = user.ID;
      const pos = this.users[user.ID].position;
      cube.position.set(pos.x, pos.y, pos.z);
      this.scene.add(cube);
      this.characters[user.ID] = cube;
    }
  }

  removeCharacter(userID: string) {
    const char = this.scene.getObjectByName(userID);
    char.geometry.dispose();
    char.material.dispose();
    this.scene.remove(char);
    delete this.characters[userID];
  }

  ngAfterViewInit() {
    this.camera.position.y = this.userService.position.y;
    this.scene.background = new THREE.Color(0xffffff);
		this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

		const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
		light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    /*const loader = new FBXLoader();
    loader.load('./assets/models/room.new.fbx', (object) => {

        console.log(object)
        /*this.mixer = new THREE.AnimationMixer(object);

        this.animations.iddle = this.mixer.clipAction(object.animations[0]);
        this.animations.walking = this.mixer.clipAction(object.animations[1]);
        this.animations.iddle.play();*/

        /*object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                //child.receiveShadow = true;
            }
        });
        this.scene.add(object);
    });*/

    const vertex = new THREE.Vector3();
		const color = new THREE.Color();
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
		floorGeometry.rotateX(-Math.PI / 2);
		let position = floorGeometry.attributes.position;
		for ( let i = 0, l = position.count; i < l; i ++ ) {
      vertex.fromBufferAttribute(position, i);
      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;
			position.setXYZ(i, vertex.x, vertex.y, vertex.z);
		}
    
    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
		position = floorGeometry.attributes.position;
		const colorsFloor = [];
		for ( let i = 0, l = position.count; i < l; i ++ ) {
      color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
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

		if (this.controls.isLocked) {

			this.raycaster.ray.origin.copy(this.controls.getObject().position);
			this.raycaster.ray.origin.y -= 10;
			const intersections = this.raycaster.intersectObjects(this.colliders);
			const delta = ( time - this.prevTime) / 1000;

			this.velocity.x -= this.velocity.x * 10.0 * delta;
			this.velocity.z -= this.velocity.z * 10.0 * delta;

		  this.velocity.y -= 9.8 * this.user.mass * delta;

			this.direction.z = Number(this.userService.isMoving('forward')) - Number(this.userService.isMoving('backward'));
			this.direction.x = Number(this.userService.isMoving('right')) - Number(this.userService.isMoving('left'));
			this.direction.normalize(); // this ensures consistent movements in all directions

      if ( this.userService.isMoving('forward') || this.userService.isMoving('backward') ) this.velocity.z -= this.direction.z * 400.0 * delta;
      if ( this.userService.isMoving('left') || this.userService.isMoving('right') ) this.velocity.x -= this.direction.x * 400.0 * delta;

      if (intersections.length > 0) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.userService.changeState('jump', true);
      }

      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);

			this.controls.getObject().position.y += (this.velocity.y * delta); // new behavior

      if (this.controls.getObject().position.y < 10) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;
        this.userService.changeState('jump', true);
      }

    } 
    
    const position = this.controls.getObject().position;
    if (!this.userService.position.equals(position)) {
      this.userService.updatePosition(position);
    }

    const rotation = this.controls.getObject().rotation;
    if (!this.userService.rotation.equals(rotation)) {
      this.userService.updateRotation(rotation);
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

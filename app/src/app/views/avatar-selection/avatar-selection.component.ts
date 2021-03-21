
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { UserService } from 'src/app/services/user.service';

import { avatars } from 'src/app/const/avatars';

import { Avatar } from 'src/app/models/avatar.model';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss']
})
export class AvatarSelectionComponent implements OnInit, AfterViewInit {
  
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  scene: THREE.Scene = new THREE.Scene();
  renderer: THREE.WebGLRenderer;
  avatars: Array<Avatar> = avatars;
  index: number = 0;
  current = this.avatars[this.index];
  username: string = '';
  mixer: THREE.AnimationMixer;
  animations: any = {};
  clock = new THREE.Clock();

  @ViewChild('view') view: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.camera.position.set(0, 150, 70);
    const light2 = new THREE.PointLight(0xffffff, 1, 90);
    light2.position.set(0, 180, 70);
    this.scene.add(light2);

	  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.95);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.scene.add(directionalLight);

    this.loadAvatar();

    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.view.nativeElement, alpha: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop((time: number) => {
      this.update();
    });

    window.onresize = () => {
      this.resize();
    }

  }

  loadAvatar() {

    if (this.current.loaded) {
      this.scene.add(this.current.model);
      this.mixer = new THREE.AnimationMixer(this.current.model);
      if (this.current.model.animations[0]) {
        this.animations.iddle = this.mixer.clipAction(this.current.model.animations[0]);
        this.animations.iddle.play();
      }
      this.moveCamera();
    } else {
      const loader = new FBXLoader();
      loader.load(`./assets/models/avatars/${this.current.ID}.fbx`, (object: any) => {
          this.mixer = new THREE.AnimationMixer(object);
          if (object.animations[0]) {
            this.animations.iddle = this.mixer.clipAction(object.animations[0]);
            this.animations.iddle.play();
          }

          object.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          object.position.x = 30;
          object.name = this.current.ID;
          this.current.model = object;
          this.current.loaded = true;
          this.current.boudingBox.setFromObject(this.current.model);
          this.scene.add(object);
          this.moveCamera();
      });
    }
  }

  moveCamera() {
    this.camera.position.y = this.current.boudingBox.getSize().y - 30;
  }

  changeAvatar(sens: number) {
    const obj = this.scene.getObjectByName(this.current.ID);
    this.scene.remove(obj);

    this.index += sens;
    if (this.index === this.avatars.length) this.index = 0;
    else if (this.index === -1) this.index = this.avatars.length - 1;
    this.current = this.avatars[this.index];
    this.loadAvatar();
  }

  enterRoom() {
    this.userService.createUserAndConnect(this.username, this.current);
    this.router.navigateByUrl('rooms/199');
  }

  update() {
    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
	  this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}

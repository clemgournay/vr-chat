
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-character-selection',
  templateUrl: './character-selection.component.html',
  styleUrls: ['./character-selection.component.scss']
})
export class CharacterSelectionComponent implements OnInit, AfterViewInit {
  
  user: any = {};
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  scene: THREE.Scene = new THREE.Scene();
  renderer: THREE.WebGLRenderer;
  characters: Array<any> = [
    {ID: 'ninja', name: 'Ninja', model: null, loaded: false},
    {ID: 'archer', name: 'Archer', model: null, loaded: false},
  ];
  currentIndex = 0;
  currentChar = this.characters[this.currentIndex];

  @ViewChild('view') view: ElementRef;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getProperties();
  }

  ngAfterViewInit() {

    this.camera.position.set(0, 150, 70);
    this.scene.background = new THREE.Color(0x000000);
	  this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light2 = new THREE.PointLight( 0xffffff, 1, 100 );
    light2.position.set( 100, 100, 100 );
    this.scene.add( light2 );

	  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    this.loadCharacter();

    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.view.nativeElement});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop((time: number) => {
      this.update();
    });

    window.onresize = () => {
      this.resize();
    }

  }

  loadCharacter() {

    if (this.currentChar.loaded) {
      this.scene.add(this.currentChar.model);
    } else {
      const loader = new FBXLoader();
      loader.load(`./assets/models/characters/${this.currentChar.ID}.fbx`, (object: any) => {
          console.log(object);
          object.traverse((child: any) => {
              if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          });
          object.position.x = 30;
          object.name = this.currentChar.ID;
          this.currentChar.model = object;
          this.currentChar.loaded = true;
          this.scene.add(object);
      });
    }
  }

  nextCharacter() {
    const char = this.characters[this.currentChar];
    const obj = this.scene.getObjectByName(char.ID);
    this.scene.remove(obj);

    this.currentChar++;
    if (this.currentChar >= this.characters.length) this.currentChar = 0;
    this.currentChar = this.characters[this.currentIndex];
    this.loadCharacter();

  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
	  this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

}

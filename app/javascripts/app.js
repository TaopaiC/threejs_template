/* global document Image */

import THREE from 'three';
import Engine from './engine';
import world from './world';

var engine;

function initWorld() {
  var scene, camera;

  scene = world.getScene();
  camera = world.getCamera();

  // Floor
  var floorTexture = new THREE.ImageUtils.loadTexture('images/textures/patterns/checker.png');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -300;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  // SKYBOX/FOG
  var skyBoxGeometry = new THREE.CubeGeometry(1000, 1000, 1000);
  var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x9999ff, side: THREE.BackSide});
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
  scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
}

function init() {
  var scene, camera;

  scene = world.getScene();
  camera = world.getCamera();
}

engine = new Engine();
engine.init()
    .then(initWorld)
    .then(init);
engine.start();


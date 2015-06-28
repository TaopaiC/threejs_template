/* global document Promise navigator */
/**
 * World Engine
 * @module engine
 */
import THREE from 'three';
import 'vendor/threejs/VRControls';
import 'vendor/threejs/VREffect';
import 'webvr-polyfill';
import WebVRManager from 'webvr-boilerplate/src/main';
import world from './world';
import _ from 'lodash';
import Stats from 'vendor/stats/Stats';

class Engine {
  /**
   * @constructor
   */
  constructor() {
    var self = this;
    this.intersectables = [];
    this.raycaster = new THREE.Raycaster();
    this.manager;

    this.initized = new Promise(function(resolve, reject) {
      /* TODO this.resolve should be private */
      self.resolve = resolve;
      /* TODO this.reject should be private */
      self.reject = reject;
    });
  }

  /**
   * init
   */
  init() {
    document.body.style.cssText = 'font: 600 12pt monospace; margin: 0; overflow: hidden';

    var info = document.body.appendChild( document.createElement( 'div' ) );

    info.style.cssText = 'left: 10px; position: absolute; ';
    info.innerHTML = '<h3>' + document.title + '</h3>' +
      '<div id=msg>readout</div>';

    var container = document.body.appendChild( document.createElement( 'div' ) );

    this.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0xffffff }  );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( this.renderer.domElement );

    this.scene = new THREE.Scene();
    world.setScene(this.scene);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
    world.setCamera(this.camera);

    this.controls = new THREE.VRControls(this.camera);

    this.effect = new THREE.VREffect( this.renderer );
    this.effect.setSize( window.innerWidth, window.innerHeight );

    this.manager = new WebVRManager(this.renderer, this.effect);

    var stats = new Stats();
    this.stats = stats;
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    window.addEventListener('resize', function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.effect.setSize( window.innerWidth, window.innerHeight );
    }.bind(this), false );

    this.resolve();

    return this.initized;
  }

  /**
   * then
   * @param {function} success - success callback
   * @param {function} failed - failed callback
   */
  then(success, failed) {
    return this.initized.then(success, failed);
  }

  addIntersectable(object) {
    this.intersectables.push(object.intersectable);
  }

  removeIntersectable(object) {
    var targetUuid = object.intersectables.uuid;
    _.remove(this.intersectables, function(n) {
      return n.uuid === targetUuid;
    });
  }

  findIntersections() {
    var gaze = new THREE.Vector3(0, 0, 1);
    var TTL = 100;

    gaze.unproject(this.camera);
    this.raycaster.set(
      this.camera.position,
      gaze.sub(this.camera.position).normalize()
    );

    var intersects = this.raycaster.intersectObjects(this.intersectables);

    // if found
    if (intersects.length > 0) {
      var found = intersects[0];
      if (!this.selected) {
        // this.selectSound.play();
        navigator.vibrate(30);
        this.selected = {
          id: found.object.uuid,
          ttl: TTL,
          clicked: false,
          obj: found.object
        };
        if (this.selected.obj.parent.onEnter) { this.selected.obj.parent.onEnter(); }
        if (this.selected.obj.parent.onFocus) { this.selected.obj.parent.onFocus(); }
      } else {
        if (this.selected.id === found.object.uuid) {
          // decrement
          this.selected.ttl -= 1;
          var p = (this.selected.ttl / TTL);
          // cursor.scale.set(p, p, p);
          if (!this.selected.clicked && this.selected.ttl <= 0) {
            this.selected.clicked = true;
            this.selected.ttl = -1;
            p = p * 100;
            // cursor.scale.set(p, p, p);
            // this.open(this.selected.obj.parent);
            // cursor.scale.set(0,0,0);
            if (this.selected.obj.parent.onFocus) { this.selected.obj.parent.onFocus(); }
            if (this.selected.obj.parent.onClick) { this.selected.obj.parent.onClick(); }
          } else {
            if (this.selected.obj.parent.onFocus) { this.selected.obj.parent.onFocus(); }
          }
        } else {
          // this.selectSound.play();
          if (this.selected.obj.parent.onBlur) { this.selected.obj.parent.onBlur(); }
          navigator.vibrate(30);
          this.selected = {
            id: found.object.uuid,
            ttl: TTL,
            obj: found.object
          };
          if (this.selected.obj.parent.onEnter) { this.selected.obj.parent.onEnter(); }
          if (this.selected.obj.parent.onFocus) { this.selected.obj.parent.onFocus(); }
        }
      }
    } else {
      if (this.selected && this.selected.obj.parent.onBlur) { this.selected.obj.parent.onBlur(); }
      this.selected = null;
    }
  }

  /**
   * animate loop
   */
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    if (this.onAnimate) { this.onAnimate(this.scene, this.camera); }

    if (this.controls !== undefined) {
      this.controls.update();
      var msg = document.getElementById('msg');
    }

    if( this.vrControls !== undefined ) {
      this.vrControls.update();
    }

    this.findIntersections();
    this.stats.update();

    this.manager.render(this.scene, this.camera);
  }

  /**
   * start the engine!
   */
  start() {
    this.animate();
  }
}

module.exports = Engine;

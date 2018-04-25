import * as THREE from "three";
import StandardEntity from "./StandardEntity";
import CapsuleGeometry from "../components/geometry/CapsuleGeometry.js";

/*
  Capsule Entity
*/

export default class Capsule extends StandardEntity{

  setup(){
    this.radius = 1;
    this.height = 2;
    this.N = 16;
    this.middleSegments = 5;

    this.geometry = new CapsuleGeometry(this.radius,this.height,this.N, this.middleSegments);
    this.material = new THREE.MeshNormalMaterial({wireframe:false, side: THREE.DoubleSide});

    this.mesh = new THREE.Mesh(this.geometry,this.material);
  }

  update(){}
}

import * as THREE from "three";
import StandardEntity from "./StandardEntity";
import Capsule from "./Capsule";

//------------------------------------------------------------------------------
export default class CylinderGrid extends StandardEntity{
  setup(){
    this.resolution = 14;
    this.scale      = 0.4;
    this.gridspace  = 0.7;
    this.wireframe  = false;
    this.modulation = {
      speed: 0.1,
      depth: 0
    }

    this.group = new THREE.Group();
    this.capsules  = [];

    this.generateGrid();

    this.group.scale.set(this.scale,this.scale,this.scale);

    this.scene.add(this.group);
    this.setupGUI();
  }

  generateGrid(){
    this.capsules = [];

    for(let x = 0; x < this.resolution; x++){
      for(let y = 0; y < this.resolution; y++){
        let capsule = new Capsule(this.manager);
        let circum = this.scale / (this.resolution - 1);

        capsule.mesh.scale.set(circum/2,circum/2,circum/2);

        capsule.mesh.position.x =
          (circum * x - this.scale / 2) * (1 + this.gridspace);
        capsule.mesh.position.y =
          (circum * y - this.scale / 2) * (1 + this.gridspace);

        capsule.mesh.rotation.z = Math.PI/2;

        this.group.add(capsule.mesh);
        this.capsules.push(capsule);
      }
    }
  }

  setupGUI(){
    this.gui.grid = this.gui.addFolder('Capsule Grid');

    this.gui.grid.add(this,'scale',0,10).onChange(()=>{
      this.group.scale.set(this.scale,this.scale,this.scale);
    });

    this.gui.grid.add(this,'resolution',0,20).step(1).onChange(()=>{
      for(let i = 0; i < this.capsules.length; i++){
        this.group.remove(this.capsules[i].mesh);
      }
      this.generateGrid();
    });

    this.gui.grid.add(this,'gridspace',0,5).onChange(()=>{
      for(let x = 0, i = 0; x < this.resolution; x++){
        for(let y = 0; y < this.resolution; y++, i++){
          let circum = this.scale / (this.resolution - 1);

          this.capsules[i].mesh.position.x =
            (circum * x - this.scale / 2) * (1 + this.gridspace);
          this.capsules[i].mesh.position.y =
            (circum * y - this.scale / 2) * (1 + this.gridspace);
        }
      }
    });

    this.gui.grid.add(this.modulation,'speed');
    this.gui.grid.add(this.modulation,'depth');

    this.gui.grid.open();
  }

  update(){
    let rot = (Math.PI/2) * Math.sin(this.clock.getElapsedTime());
    this.group.rotation.z = rot;

    for(let x = 0, i = 0; x < this.resolution; x++){
      for(let y = 0; y < this.resolution; y++, i++){
        this.capsules[i].mesh.position.z = Math.sin(this.clock.getElapsedTime()*this.modulation.speed+(x*y)) * this.modulation.depth;
      }
    }

    let z = Math.sin(this.clock.getElapsedTime()*this.modulation.speed) * this.modulation.depth;
    this.group.position.z = z;
  }
}

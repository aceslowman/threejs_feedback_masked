import * as THREE from "three";

import Cylinder from "./Cylinder";

//------------------------------------------------------------------------------
export default class CylinderGrid{
  constructor(template){
    this.template = template
    this.clock = this.template.clock;
    this.gui = this.template.gui;

    this.resolution = 14;
    this.scale      = 0.4;
    this.gridspace  = 2.8;
    this.wireframe  = false;
    this.modulation = {
      speed: 0.1,
      depth: 2
    }

    this.group = new THREE.Group();
    this.cylinders  = [];

    this.generateGrid();

    this.group.scale.set(this.scale,this.scale,0.1);

    this.template.scene.add(this.group);
    this.setupGUI();
  }

  generateGrid(){
    this.cylinders = [];

    for(let x = 0; x < this.resolution; x++){
      for(let y = 0; y < this.resolution; y++){
        let cylinder = new Cylinder(this.scene, this.eventBus, this.gui);
        let circum = this.scale / (this.resolution - 1);

        cylinder.mesh.scale.set(circum/2,this.scale,circum/2);

        cylinder.mesh.position.x =
          (circum * x - this.scale / 2) * (1 + this.gridspace);
        cylinder.mesh.position.y =
          (circum * y - this.scale / 2) * (1 + this.gridspace);

        cylinder.material.wireframe = this.wireframe;

        this.group.add(cylinder.mesh);
        this.cylinders.push(cylinder);
      }
    }
  }

  setupGUI(){
    this.gui = this.gui.addFolder('Cylinder Grid');

    this.gui.add(this,'scale',0,10).onChange(()=>{
      this.group.scale.set(this.scale,this.scale,this.scale);
    });

    this.gui.add(this,'resolution',0,20).step(1).onChange(()=>{
      for(let i = 0; i < this.cylinders.length; i++){
        this.group.remove(this.cylinders[i].mesh);
      }
      this.generateGrid();
    });

    this.gui.add(this,'gridspace',0,5).onChange(()=>{
      for(let x = 0, i = 0; x < this.resolution; x++){
        for(let y = 0; y < this.resolution; y++, i++){
          let circum = this.scale / (this.resolution - 1);

          this.cylinders[i].mesh.position.x =
            (circum * x - this.scale / 2) * (1 + this.gridspace);
          this.cylinders[i].mesh.position.y =
            (circum * y - this.scale / 2) * (1 + this.gridspace);
        }
      }
    });

    this.gui.add(this.modulation,'speed');
    this.gui.add(this.modulation,'depth');

    this.gui.add(this,'wireframe').onChange((value)=>{
      for(let i = 0; i < this.cylinders.length; i++){
        this.cylinders[i].material.wireframe = value;
      }
    });

    this.gui.open();
  }

  update(){
    let rot = (Math.PI/2) * Math.sin(this.clock.getElapsedTime());
    this.group.rotation.z = rot;

    for(let x = 0, i = 0; x < this.resolution; x++){
      for(let y = 0; y < this.resolution; y++, i++){
        this.cylinders[i].mesh.position.z = Math.sin(this.clock.getElapsedTime()*this.modulation.speed+(x*y)) * this.modulation.depth;
      }
    }

    let z = Math.sin(this.clock.getElapsedTime()*this.modulation.speed) * this.modulation.depth;
    this.group.position.z = z;
  }
}

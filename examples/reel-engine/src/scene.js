import * as THREE from 'three';
const canvas=document.getElementById('engine-scene'),container=document.getElementById('hero-object');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{canvas.hidden=true;document.querySelector('.motion-toggle').hidden=true;}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,10.8);
scene.add(new THREE.AmbientLight(0xe1d4f8,2.2));const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.DirectionalLight(0xbaa0de,3);rim.position.set(5,-1,3);scene.add(rim);
const assembly=new THREE.Group();scene.add(assembly);assembly.rotation.set(-.12,-.37,-.1);
function roundRect(w,h,r){const s=new THREE.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
const plates=[];const colors=[0x302b37,0x574963,0x8f77a9,0xc8b4ef];
for(let i=0;i<4;i++){
 const group=new THREE.Group();const geo=new THREE.ExtrudeGeometry(roundRect(2.15,3.62,.2),{depth:.07,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.02,curveSegments:18});
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:colors[i],metalness:.55,roughness:.32}));group.add(mesh);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),new THREE.LineBasicMaterial({color:0xcbbddd,transparent:true,opacity:.5}));group.add(edge);
 for(let j=0;j<8;j++){const notch=new THREE.Mesh(new THREE.BoxGeometry(.07,.12,.012),new THREE.MeshBasicMaterial({color:0x18131f}));notch.position.set(-.93,-1.45+j*.41,.105);group.add(notch);const n=notch.clone();n.position.x=.93;group.add(n);}
 assembly.add(group);plates.push(group);
}
const phone=new THREE.Group();const body=new THREE.Mesh(new THREE.ExtrudeGeometry(roundRect(2.05,3.72,.22),{depth:.18,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.04,bevelThickness:.03,curveSegments:24}),new THREE.MeshStandardMaterial({color:0x242029,metalness:.85,roughness:.23}));phone.add(body);
const loader=new THREE.TextureLoader();loader.load('assets/reel-poster.png',texture=>{texture.colorSpace=THREE.SRGBColorSpace;const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.89,3.36),new THREE.MeshBasicMaterial({map:texture}));screen.position.set(0,0,.225);phone.add(screen);container.classList.add('scene-ready');render();},undefined,()=>{canvas.hidden=true;document.querySelector('.motion-toggle').hidden=true;});
const button=new THREE.Mesh(new THREE.BoxGeometry(.045,.35,.08),new THREE.MeshStandardMaterial({color:0x9d8ead,metalness:1,roughness:.3}));button.position.set(1.06,.6,.05);phone.add(button);assembly.add(phone);
const orbits=new THREE.Group();scene.add(orbits);for(let i=0;i<2;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.75+i*.48,.009,6,120),new THREE.MeshBasicMaterial({color:i?0x62516e:0x91819c,transparent:true,opacity:.44}));ring.rotation.set(1.05+i*.35,.45,-.3);orbits.add(ring);}
const nodes=[];for(let i=0;i<5;i++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.055,12,12),new THREE.MeshStandardMaterial({color:0xddc9f5,metalness:.3,roughness:.2}));const a=i*Math.PI*2/5;dot.position.set(Math.cos(a)*3,Math.sin(a)*1.4,-.5+Math.sin(a)*.8);scene.add(dot);nodes.push(dot);}
let pointer={x:0,y:0},paused=reduce.matches,visible=true,stage=0,current=0,last=0;
const toggle=document.querySelector('.motion-toggle');toggle.addEventListener('click',()=>{paused=!paused;toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion';render();});
container.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const b=container.getBoundingClientRect();pointer.x=((e.clientX-b.left)/b.width-.5);pointer.y=((e.clientY-b.top)/b.height-.5);}});container.addEventListener('pointerleave',()=>pointer={x:0,y:0});
window.addEventListener('reel-stage',e=>{stage=e.detail/4;render();});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render();}).observe(container);
function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<450?12:10.8;camera.updateProjectionMatrix();render();}new ResizeObserver(resize).observe(container);
function render(t=0){const rect=container.getBoundingClientRect();const scroll=Math.max(0,Math.min(1,-rect.top/(rect.height*.8)));const target=reduce.matches?.65:Math.max(scroll,stage);current=reduce.matches?target:current+(target-current)*.08;const spread=1-current*.65;plates.forEach((p,i)=>{p.position.set(-.52-(3-i)*.30*spread,(3-i)*.18*spread,-.25-(3-i)*.47*spread);p.rotation.z=(i-3)*.07*spread;});phone.position.set(.32,-.10,1.05);assembly.rotation.y=-.37+(!paused?pointer.x*.25:0)+current*.3;assembly.rotation.x=-.12+(!paused?pointer.y*.1:0);assembly.position.y=!paused?Math.sin(t*.0005)*.075:0;orbits.rotation.z=current*.2;renderer.render(scene,camera);canvas.dataset.rendered='true';}
function tick(t){requestAnimationFrame(tick);if(!visible||document.hidden||t-last<32)return;last=t;if(!paused)render(t);}requestAnimationFrame(tick);
reduce.addEventListener('change',()=>{paused=reduce.matches;render();});window.addEventListener('scroll',()=>{if(visible)render();},{passive:true});resize();
}

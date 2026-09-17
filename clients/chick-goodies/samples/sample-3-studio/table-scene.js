import * as T from './vendor/three.module.js';
const canvas=document.getElementById('table-scene'),wrap=canvas.parentElement,control=document.getElementById('motion');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=true,tick=0,frames=0,time=0,elapsed=0,raf=0,last=0;
const metrics={ready:false,frames:0,paused,drawCalls:0,quality:1.5,camera:[],pointer:[0,0]};window.GatheringScene=metrics;
try{
const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0xfff9ea,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,70);scene.add(new T.HemisphereLight(0xfff9ea,0x394ab3,3));const light=new T.DirectionalLight(0xfff5cd,4);light.position.set(-5,9,5);scene.add(light);
const world=new T.Group();scene.add(world);
const blue=new T.MeshStandardMaterial({color:0x263ece,roughness:.3,metalness:.08}),cream=new T.MeshStandardMaterial({color:0xfffbef,roughness:.22}),gold=new T.MeshStandardMaterial({color:0xb39652,metalness:.7,roughness:.3});
const top=new T.Mesh(new T.CylinderGeometry(3.6,3.6,.19,96),new T.MeshStandardMaterial({color:0xe5dc92,roughness:.9}));top.scale.z=.64;world.add(top);
// Woven cloth pattern is procedural geometry shading, not an image of food.
const cloth=new T.Mesh(new T.PlaneGeometry(6.9,1.6),new T.ShaderMaterial({side:T.DoubleSide,uniforms:{uTime:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float uTime;void main(){float thread=sin(vUv.x*950.)*sin(vUv.y*360.);float stripe=step(.82,fract(vUv.x*22.));vec3 col=mix(vec3(.93,.92,.79),vec3(.26,.33,.67),stripe*.28);col+=thread*.035;gl_FragColor=vec4(col,1.);}'}));cloth.rotation.x=-Math.PI/2;cloth.position.y=.105;world.add(cloth);
const dishGeo=new T.CylinderGeometry(.62,.46,.065,56),rimGeo=new T.TorusGeometry(.55,.024,8,56),innerGeo=new T.TorusGeometry(.40,.009,6,48);const accents=[];
for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+.12,g=new T.Group();g.position.set(Math.cos(a)*2.52,.16,Math.sin(a)*1.37);g.rotation.y=-a;
const plate=new T.Mesh(dishGeo,cream);g.add(plate);for(const geo of [rimGeo,innerGeo]){const rim=new T.Mesh(geo,blue);rim.rotation.x=Math.PI/2;rim.position.y=.04;g.add(rim)}
const napkin=new T.Mesh(new T.BoxGeometry(.24,.035,.70),blue);napkin.position.set(.03,.072,0);napkin.rotation.y=.4;g.add(napkin);
const ring=new T.Mesh(new T.TorusGeometry(.16,.018,8,32),gold);ring.position.set(.02,.12,0);ring.rotation.x=Math.PI/2;g.add(ring);
for(const x of [-.79,.79]){const cutlery=new T.Mesh(new T.BoxGeometry(.04,.03,.62),gold);cutlery.position.set(x,.03,0);g.add(cutlery)}
const glass=new T.Mesh(new T.CylinderGeometry(.18,.1,.4,24,1,true),new T.MeshStandardMaterial({color:0xf9df98,transparent:true,opacity:.45,metalness:.12,roughness:.1,side:T.DoubleSide}));glass.position.set(.60,.22,-.53);g.add(glass);world.add(g);accents.push(g)}
const vase=new T.Mesh(new T.SphereGeometry(.3,24,20),blue);vase.scale.set(.8,1.5,.8);vase.position.set(0,.45,0);world.add(vase);
for(let i=0;i<5;i++){const stem=new T.Mesh(new T.CylinderGeometry(.014,.014,.85,6),gold);stem.position.set((i-2)*.07,1.05,0);stem.rotation.z=(i-2)*.18;world.add(stem);const petal=new T.Mesh(new T.SphereGeometry(.16,16,12),cream);petal.scale.set(1,.35,1.5);petal.position.set((i-2)*.18,1.46,.04);petal.rotation.z=i;world.add(petal)}
// Batch repeated place-setting geometry into shared GPU draws.
// This compact scene uses built-in instanced bounds, not a custom culling layer.
world.updateMatrixWorld(true);
const batches=new Map(),inverse=world.matrixWorld.clone().invert();
world.traverse(node=>{if(!node.isMesh||node.material.transparent)return;const key=JSON.stringify(node.geometry.parameters)+'|'+node.geometry.type+'|'+node.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(node)});
for(const nodes of batches.values()){if(nodes.length<2)continue;const batch=new T.InstancedMesh(nodes[0].geometry,nodes[0].material,nodes.length);nodes.forEach((node,i)=>{batch.setMatrixAt(i,inverse.clone().multiply(node.matrixWorld));node.removeFromParent()});batch.computeBoundingSphere();world.add(batch)}
world.rotation.set(0,-.25,-.04);
const target=new T.Vector2(),pointer=new T.Vector2();let progress=0;
function resize(){const r=wrap.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render(0)}
function render(dt){if(!paused){time+=dt;pointer.lerp(target,.055);world.rotation.y=-.25+pointer.x*.12+progress*.38;world.rotation.z=-.04+Math.sin(time*.25)*.012;accents.forEach((g,i)=>{g.position.y=.16+Math.sin(time*.55+i)*.014})}camera.position.set(pointer.x*.6,7.7-progress*1.3,9.5+progress*1.1);camera.lookAt(0,0,0);renderer.render(scene,camera);metrics.frames++;metrics.camera=camera.position.toArray();metrics.pointer=pointer.toArray();metrics.drawCalls=renderer.info.render.calls;}
function loop(now){raf=0;if(paused||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;render(dt);frames++;elapsed+=dt;if(frames===120){if(elapsed>4&&metrics.quality>1){metrics.quality=1;renderer.setPixelRatio(1)}frames=0;elapsed=0}raf=requestAnimationFrame(loop)}
function start(){if(!raf&&!paused&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(loop)}}
function state(){metrics.paused=paused;control.setAttribute('aria-pressed',String(paused));control.textContent=paused?'Play motion':'Pause motion';if(paused){cancelAnimationFrame(raf);raf=0;render(0)}else start()}
control.addEventListener('click',()=>{paused=!paused;state()});reduced.addEventListener('change',()=>{paused=reduced.matches;state()});window.addEventListener('pointermove',e=>{target.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2)},{passive:true});window.addEventListener('scroll',()=>{progress=Math.min(1,Math.max(0,scrollY/innerHeight));if(paused)return;start()},{passive:true});new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}else start()}).observe(canvas);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else start()});new ResizeObserver(resize).observe(wrap);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;wrap.classList.remove('scene-ready');metrics.ready=false;control.textContent='Motion unavailable';control.disabled=true});resize();wrap.classList.add('scene-ready');metrics.ready=true;state();
}catch(error){metrics.error=String(error);control.textContent='Static view';control.disabled=true;}

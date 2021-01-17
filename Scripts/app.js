let container, scene, camera, renderer, monolith, ufo, rock, mixer;
let promise1, promise2, promise3;
let clock = new THREE.Clock();
let delta = clock.getDelta();
let material,rockmaterial;

function init() {
    let path = "../textures/";
    let format = '.jpg';
    let urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];

    const textureCube = new THREE.CubeTextureLoader().load( urls );
    
    // Set up scene
    scene = new THREE.Scene();

    // Add texture to the monolith and the rock
    material = new THREE.MeshBasicMaterial( { color: 0xc2c2c2, envMap: textureCube } );
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( '../rocktexture.jpg' );
    console.log(texture);

    //Setup Camera
    const fov = 55;
    const aspect = window.innerWidth/window.innerHeight;
    const near = 45;
    const far = 30000;
    camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(2500,100,100);
    
    //Setup renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Setup orbitControls
    let controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.maxDistance = 2500; // zoom out
    controls.minDistance = 30; // zoom in
    // controls.target.set(-900,-100,-900);

    // Setup light
    const ambient = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(900,-100,-700);
    scene.add(light);

    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('../textures/negz.jpg');
    let texture_bk = new THREE.TextureLoader().load('../textures/posz.jpg');
    let texture_up = new THREE.TextureLoader().load('../textures/posy.jpg');
    let texture_dn = new THREE.TextureLoader().load('../textures/negy.jpg');
    let texture_rt = new THREE.TextureLoader().load('../textures/posx.jpg');
    let texture_lf = new THREE.TextureLoader().load('../textures/negx.jpg'); 

    materialArray.push(new THREE.MeshBasicMaterial({map:texture_ft}));
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_bk}));
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_up}));
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_dn}));
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_rt}));
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_lf}));

    for (let i = 0; i < materialArray.length; i++) {
        materialArray[i].side = THREE.BackSide;
    }

    let skyboxGeo = new THREE.BoxGeometry(14000,14000,14000);
    let skybox = new THREE.Mesh(skyboxGeo,materialArray);
    scene.add(skybox);

    //Load Multiple models
    promise1 = loadModel('mono.glb').then(result => {  monolith = result; });
    // promise2 = loadModel('ufo.gltf').then(result => {  ufo = result; });
    promise3 = loadModel('rock.glb').then(result => {  rock = result; });


    Promise.all([promise1,promise3]).then(() => {
        console.log("Resolved");
        document.getElementById("loader").style.display = "none";
        console.log(rock);
        monolith.scene.position.set(-3500,900,-700);
        monolith.scene.scale.set(30,30,30);
        monolith.scene.traverse((o) => {
            if (o.isMesh) o.material = material;
          });
        // ufo.scene.position.set(-4000,6000,100);
        // ufo.scene.scale.set(1000,1000,1000);
        rock.scene.position.set(-7500,-4700,3500);
        rock.scene.scale.set(30,30,30);
        rock.scene.traverse((o) => {
            if (o.isMesh) o.material.map = texture ;
          });
        // mixer = new THREE.AnimationMixer(ufo.scene);
        // var action = mixer.clipAction(ufo.animations[0]);
        // action.play();

        //add model to the scene
        scene.add(monolith.scene);
        // scene.add(ufo.scene);
        scene.add(rock.scene);

        //render loop
        animate();   
    });
}

function loadModel (url) {
    return new Promise(resolve => {
        new THREE.GLTFLoader().load(url, resolve);
    });
}

function animate() {
    renderer.render(scene, camera);
    // if(ufo) mixer.update( clock.getDelta() );
    if (monolith) monolith.scene.rotation.x = Math.PI/2;
    if (rock) rock.scene.rotation.x = -Math.PI/2;
    requestAnimationFrame(animate);
}

init();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  window.addEventListener("resize", onWindowResize);
// circular particle: change pMaterial, add createCircleTexture


let scene, camera, renderer, particles, lines;
let particleData = [];
let group;
let container = document.getElementById('canvas-container');

const MAX_PARTICLES = 200;
const MIN_DISTANCE = 150;

let boundsX, boundsY;

// Function to create a circular texture for the particles
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Draw a smooth radial gradient circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   // Solid center
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)'); // Slight fade
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   // Transparent edge

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function init() {
    scene = new THREE.Scene();

    // Setup Orthographic Camera
    // We use container dimensions instead of window
    boundsX = container.clientWidth;
    boundsY = container.clientHeight;
    
    camera = new THREE.OrthographicCamera(
        -boundsX / 2, boundsX / 2,
        boundsY / 2, -boundsY / 2,
        1, 1000
    );
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(boundsX, boundsY);
    container.appendChild(renderer.domElement);

    group = new THREE.Group();
    scene.add(group);

    // Particle System
    const positions = new Float32Array(MAX_PARTICLES * 3);
    // const pMaterial = new THREE.PointsMaterial({
    //     // color: 0x4488ff, // Giving it a slight blue tint
    //     color: 0xf8f8f8,
    //     size: 3,
    //     blending: THREE.AdditiveBlending,
    //     transparent: true,
    //     opacity: 0.8
    // });
    const pMaterial = new THREE.PointsMaterial({
        // color: 0x66ccff,        // Bright cyan-blue
        color: 0xf8f8f8,
        size: 6,               // Larger size to show circle
        map: createCircleTexture(),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,     // Prevents black boxes around transparent textures
        opacity: 0.9
    });

    const particlesGeom = new THREE.BufferGeometry();

    for (let i = 0; i < MAX_PARTICLES; i++) {
        const x = Math.random() * boundsX - boundsX / 2;
        const y = Math.random() * boundsY - boundsY / 2;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;

        particleData.push({
            velocity: new THREE.Vector3(
                (-0.5 + Math.random()) * 0.8,
                (-0.5 + Math.random()) * 0.8,
                0
            )
        });
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    particles = new THREE.Points(particlesGeom, pMaterial);
    group.add(particles);

    // Lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_PARTICLES * MAX_PARTICLES * 3);
    const lineColors = new Float32Array(MAX_PARTICLES * MAX_PARTICLES * 3);

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        // opacity: 0.2
        opacity: 1
    });

    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    boundsX = container.clientWidth;
    boundsY = container.clientHeight;

    camera.left = -boundsX / 2;
    camera.right = boundsX / 2;
    camera.top = boundsY / 2;
    camera.bottom = -boundsY / 2;
    camera.updateProjectionMatrix();
    
    renderer.setSize(boundsX, boundsY);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const positions = particles.geometry.attributes.position.array;
    const linePos = lines.geometry.attributes.position.array;
    const lineCol = lines.geometry.attributes.color.array;

    let vertexIndex = 0;
    let colorIndex = 0;
    let lineCount = 0;

    for (let i = 0; i < MAX_PARTICLES; i++) {
        positions[i * 3] += particleData[i].velocity.x;
        positions[i * 3 + 1] += particleData[i].velocity.y;

        if (positions[i * 3] < -boundsX / 2 || positions[i * 3] > boundsX / 2) particleData[i].velocity.x *= -1;
        if (positions[i * 3 + 1] < -boundsY / 2 || positions[i * 3 + 1] > boundsY / 2) particleData[i].velocity.y *= -1;

        for (let j = i + 1; j < MAX_PARTICLES; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MIN_DISTANCE) {
                const alpha = 1.0 - dist / MIN_DISTANCE;

                linePos[vertexIndex++] = positions[i * 3];
                linePos[vertexIndex++] = positions[i * 3 + 1];
                linePos[vertexIndex++] = 0;

                linePos[vertexIndex++] = positions[j * 3];
                linePos[vertexIndex++] = positions[j * 3 + 1];
                linePos[vertexIndex++] = 0;

                // Soft blue/white gradient
                lineCol[colorIndex++] = alpha * 0.3;
                lineCol[colorIndex++] = alpha * 0.5;
                lineCol[colorIndex++] = alpha;

                // lineCol[colorIndex++] = alpha * 0.3;
                // lineCol[colorIndex++] = alpha * 0.5;
                // lineCol[colorIndex++] = alpha;

                // // Warm Gold/Orange gradient for lines
                // lineCol[colorIndex++] = alpha * 1.0; // Red
                // lineCol[colorIndex++] = alpha * 0.7; // Green
                // lineCol[colorIndex++] = alpha * 0.2; // Blue

                lineCol[colorIndex++] = alpha * 1.0;
                lineCol[colorIndex++] = alpha * 0.7;
                lineCol[colorIndex++] = alpha * 0.2;

                // // White for lines
                // lineCol[colorIndex++] = alpha * 1.0; // Red
                // lineCol[colorIndex++] = alpha * 1.0; // Green
                // lineCol[colorIndex++] = alpha * 1.0; // Blue

                // lineCol[colorIndex++] = alpha * 1.0; // Red
                // lineCol[colorIndex++] = alpha * 1.0; // Green
                // lineCol[colorIndex++] = alpha * 1.0; // Blue

                lineCount++;
            }
        }
    }

    lines.geometry.setDrawRange(0, lineCount * 2);
    lines.geometry.attributes.position.needsUpdate = true;
    lines.geometry.attributes.color.needsUpdate = true;
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

window.onload = function() {
    init();
    animate();
};
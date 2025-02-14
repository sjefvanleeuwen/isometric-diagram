const canvas = document.getElementById('isoCanvas');
const ctx = canvas.getContext('2d');

// Isometric constants
const TILE_WIDTH = 50;
const TILE_HEIGHT = TILE_WIDTH / 2;
const ANGLE = Math.PI / 6;

// Convert isometric coordinates to canvas coordinates
function isoToCanvas(x, y, z) {
    return {
        x: canvas.width/2 + (x - y) * Math.cos(ANGLE) * TILE_WIDTH,
        y: canvas.height/2 + (x + y) * Math.sin(ANGLE) * TILE_WIDTH - z * TILE_HEIGHT
    };
}

// Remove drawBlock function entirely

// Replace drawNode function with simpler version
function drawNode(x, y, z) {
    const pos = isoToCanvas(x, y, z);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#4285f4';
    ctx.fill();
}

// Draw a connection between two nodes
function drawConnection(x1, y1, z1, x2, y2, z2) {
    const start = isoToCanvas(x1, y1, z1);
    const end = isoToCanvas(x2, y2, z2);
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = '#34a853';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Add after the drawConnection function
function drawCube(x, y, z, size) {
    const pos = isoToCanvas(x, y, z);
    const cubeSize = size * TILE_WIDTH;
    
    // 1. Top face - Fixed vertices to properly close the top
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - cubeSize/2);  // Center point
    ctx.lineTo(pos.x - cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE) - cubeSize/2);  // Left point
    ctx.lineTo(pos.x, pos.y - cubeSize * Math.sin(ANGLE) * 2 - cubeSize/2);  // Back point
    ctx.lineTo(pos.x + cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE) - cubeSize/2);  // Right point
    ctx.closePath();
    ctx.fillStyle = '#CCCCCC';
    ctx.fill();
    ctx.strokeStyle = '#CCCCCC';
    ctx.stroke();

    // 2. Back left face
    ctx.beginPath();
    ctx.moveTo(pos.x - cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE));
    ctx.lineTo(pos.x - cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE) - cubeSize/2);
    ctx.lineTo(pos.x, pos.y - cubeSize * Math.sin(ANGLE) * 2 - cubeSize/2);
    ctx.lineTo(pos.x, pos.y - cubeSize * Math.sin(ANGLE) * 2);
    ctx.closePath();
    ctx.fillStyle = '#999999';
    ctx.fill();
    ctx.strokeStyle = '#999999';
    ctx.stroke();

    // 3. Back right face
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - cubeSize * Math.sin(ANGLE) * 2);
    ctx.lineTo(pos.x, pos.y - cubeSize * Math.sin(ANGLE) * 2 - cubeSize/2);
    ctx.lineTo(pos.x + cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE) - cubeSize/2);
    ctx.lineTo(pos.x + cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE));
    ctx.closePath();
    ctx.fillStyle = '#AAAAAA';
    ctx.fill();
    ctx.strokeStyle = '#AAAAAA';
    ctx.stroke();

    // 4. Front left face
    ctx.beginPath();
    ctx.moveTo(pos.x - cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE));
    ctx.lineTo(pos.x, pos.y);
    ctx.lineTo(pos.x, pos.y - cubeSize/2);
    ctx.lineTo(pos.x - cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE) - cubeSize/2);
    ctx.closePath();
    ctx.fillStyle = '#BBBBBB';
    ctx.fill();
    ctx.strokeStyle = '#BBBBBB';
    ctx.stroke();

    // 5. Front right face
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE));
    ctx.lineTo(pos.x + cubeSize * Math.cos(ANGLE), pos.y - cubeSize * Math.sin(ANGLE) - cubeSize/2);
    ctx.lineTo(pos.x, pos.y - cubeSize/2);
    ctx.closePath();
    ctx.fillStyle = '#DDDDDD';
    ctx.fill();
    ctx.strokeStyle = '#DDDDDD';
    ctx.stroke();
}

let cubePos = { x: 0, y: 0, z: 0 };
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Convert canvas coordinates to isometric coordinates
function canvasToIso(canvasX, canvasY) {
    const x = canvasX - canvas.width/2;
    const y = canvasY - canvas.height/2;
    
    // Improved isometric conversion
    const isoX = (x / (TILE_WIDTH * Math.cos(ANGLE)) + y / (TILE_WIDTH * Math.sin(ANGLE))) / 2;
    const isoY = (y / (TILE_WIDTH * Math.sin(ANGLE)) - x / (TILE_WIDTH * Math.cos(ANGLE))) / 2;
    
    return { x: isoX, y: isoY };
}

// Snap to nearest grid point
function snapToGrid(x, y) {
    return {
        x: Math.round(x),
        y: Math.round(y)
    };
}

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const isoPos = canvasToIso(mouseX, mouseY);
    
    // Improved hit detection
    const dx = Math.abs(isoPos.x - cubePos.x);
    const dy = Math.abs(isoPos.y - cubePos.y);
    
    if (dx < 1.5 && dy < 1.5) {
        isDragging = true;
        dragOffset.x = isoPos.x - cubePos.x;
        dragOffset.y = isoPos.y - cubePos.y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const isoPos = canvasToIso(mouseX, mouseY);
    const snapped = snapToGrid(isoPos.x - dragOffset.x, isoPos.y - dragOffset.y);
    
    // Add bounds checking
    cubePos.x = Math.max(-4, Math.min(4, snapped.x));
    cubePos.y = Math.max(-4, Math.min(4, snapped.y));
    
    // Redraw
    drawNetwork();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Replace drawNetwork function
function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid connections
    for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
            if (x < 4) drawConnection(x, y, 0, x + 1, y, 0);
            if (y < 4) drawConnection(x, y, 0, x, y + 1, 0);
        }
    }
    
    // Draw nodes
    for (let x = -4; x <= 4; x++) {
        for (let y = -4; y <= 4; y++) {
            drawNode(x, y, 0);
        }
    }
    
    // Draw cube at current position
    drawCube(cubePos.x, cubePos.y, cubePos.z, 1);
}

// Initial draw
drawNetwork();

export class IsoCube {
    static nextId = 0;

    constructor(coords) {
        this.coords = coords;
        this.position = { x: 0, y: 0, z: 0 };
        this.id = IsoCube.nextId++;
    }

    draw(ctx, x, y, z, size, canvasWidth, canvasHeight) {
        const pos = this.coords.toCanvas(x, y, z, canvasWidth, canvasHeight);
        const cubeSize = size * this.coords.TILE_WIDTH;
        const angle = this.coords.ANGLE;

        // Make height half of width
        const height = cubeSize / 2;

        // Draw faces in correct order (back to front)
        
        // 1. Back face
        this.#drawFace(ctx, [
            [pos.x - cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle)],
            [pos.x + cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle)],
            [pos.x + cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle) - height],
            [pos.x - cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle) - height]
        ], '#999999');

        // 2. Left face
        this.#drawFace(ctx, [
            [pos.x - cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle)],
            [pos.x, pos.y],
            [pos.x, pos.y - height],
            [pos.x - cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle) - height]
        ], '#AAAAAA');

        // 3. Right face
        this.#drawFace(ctx, [
            [pos.x, pos.y],
            [pos.x + cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle)],
            [pos.x + cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle) - height],
            [pos.x, pos.y - height]
        ], '#BBBBBB');

        // 4. Top face
        this.#drawFace(ctx, [
            [pos.x - cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle) - height],
            [pos.x, pos.y - height],
            [pos.x + cubeSize * Math.cos(angle), pos.y - cubeSize * Math.sin(angle) - height],
            [pos.x, pos.y - cubeSize * Math.sin(angle) * 2 - height]
        ], '#CCCCCC');
    }

    #drawFace(ctx, points, color) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

export class IsoGrid {
    constructor(coords) {
        this.coords = coords;
        this.gridSize = 4; // -4 to +4
    }

    drawNode(ctx, x, y, z, canvasWidth, canvasHeight) {
        const pos = this.coords.toCanvas(x, y, z, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#4285f4';
        ctx.fill();
    }

    drawConnection(ctx, x1, y1, z1, x2, y2, z2, canvasWidth, canvasHeight) {
        const start = this.coords.toCanvas(x1, y1, z1, canvasWidth, canvasHeight);
        const end = this.coords.toCanvas(x2, y2, z2, canvasWidth, canvasHeight);
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = '#34a853';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    draw(ctx, canvasWidth, canvasHeight) {
        // Draw grid connections
        for (let x = -this.gridSize; x <= this.gridSize; x++) {
            for (let y = -this.gridSize; y <= this.gridSize; y++) {
                if (x < this.gridSize) this.drawConnection(ctx, x, y, 0, x + 1, y, 0, canvasWidth, canvasHeight);
                if (y < this.gridSize) this.drawConnection(ctx, x, y, 0, x, y + 1, 0, canvasWidth, canvasHeight);
            }
        }

        // Draw nodes
        for (let x = -this.gridSize; x <= this.gridSize; x++) {
            for (let y = -this.gridSize; y <= this.gridSize; y++) {
                this.drawNode(ctx, x, y, 0, canvasWidth, canvasHeight);
            }
        }
    }
}

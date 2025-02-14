export class IsoCoordinates {
    constructor(tileWidth = 50) {
        this.TILE_WIDTH = tileWidth;
        this.TILE_HEIGHT = tileWidth / 2;
        this.ANGLE = Math.PI / 6;
    }

    toCanvas(x, y, z, canvasWidth, canvasHeight) {
        return {
            x: canvasWidth/2 + (x - y) * Math.cos(this.ANGLE) * this.TILE_WIDTH,
            y: canvasHeight/2 + (x + y) * Math.sin(this.ANGLE) * this.TILE_WIDTH - z * this.TILE_HEIGHT
        };
    }

    fromCanvas(canvasX, canvasY, canvasWidth, canvasHeight) {
        const x = canvasX - canvasWidth/2;
        const y = canvasY - canvasHeight/2;
        
        const isoX = (x / (this.TILE_WIDTH * Math.cos(this.ANGLE)) + y / (this.TILE_WIDTH * Math.sin(this.ANGLE))) / 2;
        const isoY = (y / (this.TILE_WIDTH * Math.sin(this.ANGLE)) - x / (this.TILE_WIDTH * Math.cos(this.ANGLE))) / 2;
        
        return { x: isoX, y: isoY };
    }

    snapToGrid(x, y) {
        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    }
}

import { IsoCoordinates } from './modules/IsoCoordinates.js';
import { IsoCube } from './modules/IsoCube.js';
import { IsoGrid } from './modules/IsoGrid.js';
import { DragHandler } from './modules/DragHandler.js';

class IsoApp {
    constructor() {
        this.canvas = document.getElementById('isoCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.coords = new IsoCoordinates();
        this.grid = new IsoGrid(this.coords);
        this.cubes = new Map(); // Store multiple cubes
        
        // Create initial cube
        const initialCube = new IsoCube(this.coords);
        this.cubes.set(initialCube.id, initialCube);
        
        this.dragHandler = new DragHandler(this.canvas, this.coords, initialCube, () => this.render());
        
        // Add double click handler
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        
        this.render();
    }

    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const isoPos = this.coords.fromCanvas(mouseX, mouseY, this.canvas.width, this.canvas.height);
        const snapped = this.coords.snapToGrid(isoPos.x, isoPos.y);
        
        // Check if position is already occupied
        const isOccupied = Array.from(this.cubes.values()).some(cube => 
            cube.position.x === snapped.x && cube.position.y === snapped.y
        );
        
        // If position is empty and within grid bounds
        if (!isOccupied && Math.abs(snapped.x) <= 4 && Math.abs(snapped.y) <= 4) {
            const newCube = new IsoCube(this.coords);
            newCube.position = { x: snapped.x, y: snapped.y, z: 0 };
            this.cubes.set(newCube.id, newCube);
            
            // Update drag handler to work with the new cube
            this.dragHandler = new DragHandler(
                this.canvas, 
                this.coords, 
                newCube, 
                () => this.render()
            );
            
            this.render();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid.draw(this.ctx, this.canvas.width, this.canvas.height);
        
        // Draw all cubes
        for (const cube of this.cubes.values()) {
            cube.draw(
                this.ctx,
                cube.position.x,
                cube.position.y,
                cube.position.z,
                1,
                this.canvas.width,
                this.canvas.height
            );
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new IsoApp());

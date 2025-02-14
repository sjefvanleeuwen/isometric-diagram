export class DragHandler {
    constructor(canvas, coords, cube, onDrag) {
        this.canvas = canvas;
        this.coords = coords;
        this.activeCube = cube;  // Reference to the currently active cube
        this.onDrag = onDrag;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', () => this.isDragging = false);
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const isoPos = this.coords.fromCanvas(
            e.clientX - rect.left,
            e.clientY - rect.top,
            this.canvas.width,
            this.canvas.height
        );
        
        const dx = Math.abs(isoPos.x - this.activeCube.position.x);
        const dy = Math.abs(isoPos.y - this.activeCube.position.y);
        
        if (dx < 1.5 && dy < 1.5) {
            this.isDragging = true;
            this.dragOffset = {
                x: isoPos.x - this.activeCube.position.x,
                y: isoPos.y - this.activeCube.position.y
            };
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const isoPos = this.coords.fromCanvas(
            e.clientX - rect.left,
            e.clientY - rect.top,
            this.canvas.width,
            this.canvas.height
        );
        const snapped = this.coords.snapToGrid(
            isoPos.x - this.dragOffset.x,
            isoPos.y - this.dragOffset.y
        );
        
        this.activeCube.position.x = Math.max(-4, Math.min(4, snapped.x));
        this.activeCube.position.y = Math.max(-4, Math.min(4, snapped.y));
        
        this.onDrag();
    }
}

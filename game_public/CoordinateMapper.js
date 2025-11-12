class CoordinateMapper {
    constructor(canvas, virtualWidth, virtualHeight) {
        this.canvas = canvas;
        this.virtualWidth = virtualWidth;
        this.virtualHeight = virtualHeight;
        this.enabled = true;
    }

    // 启用/禁用坐标转换
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    realToVirtual(x, y) {
        if (!this.enabled || !this.canvas) return { vx: x, vy: y };
        return {
            vx: x * this.virtualWidth / this.canvas.width,
            vy: y * this.virtualHeight / this.canvas.height
        };
    }

    virtualToReal(vx, vy) {
        if (!this.enabled || !this.canvas) return { x: vx, y: vy };
        return {
            x: vx * this.canvas.width / this.virtualWidth,
            y: vy * this.canvas.height / this.virtualHeight
        };
    }
}

class Canvas {
    constructor(canvas) {
        this.canvas = canvas
    }
    get size() {
        return { height: this.canvas.getBoundingClientRect().height, width: this.canvas.getBoundingClientRect().width }
    }
}
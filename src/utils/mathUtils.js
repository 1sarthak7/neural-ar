export class EMA {
    constructor(alpha = 0.1) {
        this.alpha = alpha;
        this.value = null;
    }

    update(newValue) {
        if (this.value === null) {
            this.value = newValue;
        } else {
            this.value = this.value + this.alpha * (newValue - this.value);
        }
        return this.value;
    }
}

export class Vec2EMA {
    constructor(alpha = 0.1) {
        this.alpha = alpha;
        this.x = new EMA(alpha);
        this.y = new EMA(alpha);
    }

    update(x, y) {
        return {
            x: this.x.update(x),
            y: this.y.update(y)
        };
    }
}

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
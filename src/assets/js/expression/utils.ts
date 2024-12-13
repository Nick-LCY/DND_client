function findTarget(target: string, obj: any): any {
    let that: any = obj
    for (let a of target.split(".")) {
        that = that[a]
    }
    return that
}

function findBeforeTarget(target: string, obj: any): any {
    return findTarget(target.split(".").slice(0, -1).join("."), obj)
}

function deepReset<T>(obj: T, copy: any = Array.isArray(obj) ? [] : {}): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            (copy as any[])[i] = deepReset(obj[i]);
        }
        return copy as T;
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepReset(obj[key]);
        }
    }
    return copy as T;
}

function formatNumber(number: number): string {
    return number > 0 ? `+${number}` : `${number}`
}

export { findBeforeTarget, findTarget, deepReset, formatNumber }
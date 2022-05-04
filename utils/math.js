

export const dist2_sq = (x0, y0, x1, y1) => (x1 - x0) ** 2 + (y1 - y0) ** 2
export const dist2 = (x0, y0, x1, y1) => dist2_sq(x0, y0, x1, y1) ** .5

export const dist3_sq = (x0, y0, z0, x1, y1, z1) => (x1 - x0) ** 2 + (y1 - y0) ** 2 + (z1 - z0) ** 2
export const dist3 = (x0, y0, z0, x1, y1, z1) => dist3_sq(x0, y0, z0, x1, y1, z1) ** .5

export const check_collision_sphere = (x0, y0, z0, x1, y1, z1, rangeA, rangeB) => {
    const range = (rangeA + rangeB)
    const rangesq = range ** 2
    return dist3_sq(x0, y0, z0, x1, y1, z1) < rangesq
}




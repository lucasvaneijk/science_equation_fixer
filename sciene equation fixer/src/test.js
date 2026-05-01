let elements = {
    val1: {
        Fe: 1,
    },
    val2: {
        Fe: 2,
    },
}

const right = elements.val1.Fe || 0;
const left = elements.val1.fe || 0;
const dif = left - right

console.log(elements, dif)
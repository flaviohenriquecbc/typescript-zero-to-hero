type Combinable = number | string
type ConversionDescriptor = 'as-number' | 'as-text'

function combine(
    input1: Combinable,
    input2: Combinable,
    resultConversion: ConversionDescriptor
) {
    let result
    if (typeof input1 === 'number' && typeof input2 === 'number' || resultConversion === 'as-number') {
        result = +input1 + +input2
    } else {
        result = input1.toString() + input2.toString()
    }

    return result
}

const combineAges = combine(20, 30, 'as-number')
console.log(combineAges)

const combineNames = combine('Max', 'ana', 'as-text')
console.log(combineNames)

const combineValues = combine('1', 3, 'as-number')
console.log(combineValues)

function add(n1: number, n2: number) {
    return n1 + n2
}

function printResult(num: number): void {
    console.log('Result: ', num)
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
    const result = add(n1, n2)
    cb(result)
}

printResult(add(1, 2))


// let combineValue: Function
let combineValue: (a: number, b: number) => number

combineValue = add
// combineValue = printResult
// combineValues = 5

console.log(combineValue(3, 7))

addAndHandle(10, 20, printResult)
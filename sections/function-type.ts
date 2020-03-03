let userInput: unknown
let userName = 'John'
let userInput2: any

userInput = 5
userInput = 'Max'
userInput2 = 3
userName = userInput2

if (typeof userInput === 'string') {
    userName = userInput
}

function generateError(message: string, code: number): never {
    throw {message, erroCode: code}
}

generateError('An error occurred', 500)

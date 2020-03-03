const names: Array<string> = ['flavio']
names[0].split(' ')

async function getValue() {
  const promise: Promise<string> = new Promise((resolve) => setTimeout(() => resolve('Im done!'), 2000))
  const value = await promise
  return value.split(' ')
}

// generic with constraints
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB)
}

// const mergedObj = merge<{name: string}, {age: number}>({name: 'Flavio'}, {age: 34})
// const mergedObj = merge({name: 'Flavio'}, 34) // fails silently, so we use constraints to avoid it
const mergedObj = merge({name: 'Flavio'}, {age: 34})
console.log(mergedObj.name)



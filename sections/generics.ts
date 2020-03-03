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

// MORE CONSTRAINTS
interface Lengthy {
  length: number
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value.'
  if (element.length === 1) {
    descriptionText = 'Got 1 element'
  } else if (element.length > 1 ) {
    descriptionText = `Got ${element.length} elements`
  }

  return [element, descriptionText]
}

console.log(countAndDescribe('Hi there!'))
console.log(countAndDescribe(['Hello', 'World']))

// KEYOF CONSTRAINTS
function extractValue<T extends object, U extends keyof T>(obj: T, key: U) {
  return `Value ${obj[key]}`
}

console.log(extractValue({name: 'John'}, 'name'))

// GENERIC CLASSES
class DataStorage<T> {
  private data: T[] = []

  addItem(item: T) {
    this.data.push(item)
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) >= 0) {
      this.data.splice(this.data.indexOf(item), 1)
    }
  }

  getItems() {
    return [...this.data]
  }
}

const textStorage = new DataStorage<string>()
textStorage.addItem('John')
textStorage.addItem('Maria')
textStorage.removeItem('John')
console.log(textStorage.getItems())

// PARTIAL CONSTRAINTS
interface CourseGoal {
    title: string,
    description: string,
    completeUntil: Date
}

function createCourse(title: string, description: string, date: Date): CourseGoal {
    const createGoal: Partial<CourseGoal> = {}
    createGoal.title = title;
    createGoal.description = description;
    createGoal.completeUntil = date
    return createGoal as CourseGoal
}

// READONLY CONSTRAINTS
const people: Readonly<string[]> = ['Max', 'Alice']
// people.push('Betty')
// people.pop()
  
  

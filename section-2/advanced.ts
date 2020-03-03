type Admin2 = {
  name: string;
  privileges: string[];
}

type Employee = {
  name: string;
  startDate: Date
}

type ElevatedEmployee = Admin2 & Employee

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date()
}

type Combined = string | number
type Numeric = number | boolean

type Universal = Combined & Numeric

// FUNCTION OVERLOAD
function addd(a: number, b: number): number;
function addd(a: string, b: string): string;
function addd(a: Combined, b: Combined) {
  // this is type guard
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString()
  }
  return a + b
}

const nameConcat = addd('Flavio', ' Freitas')
nameConcat.split(' ')

type UnknownEmployee = Employee | Admin2

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ', emp.name)
  // type guard
  if('privileges' in emp) {
    console.log('Privileges', emp.privileges)
  }
  // type guard
  if('startDate' in emp) {
    console.log('Start date: ', emp.startDate)
  }  
}

printEmployeeInformation({name: 'Manu', startDate: new Date()})

class Car {
  drive() {
    console.log('Im driving a car...')
  }
}

class Truck {
  drive() {
    console.log('I am a truck driver')
  }
  loadCargo(amount: number) {
    console.log('I am loading on the truck ' + amount)
  }
}

type Vehicle = Car | Truck

const v1 = new Car()
const v2 = new Truck()

function useVehicle(vehicle: Vehicle) {
  vehicle.drive()
  // type guard
  if(vehicle instanceof Truck) {
    vehicle.loadCargo(200)
  }
}

useVehicle(v1)
useVehicle(v2)


// DISCRIMINATED UNIONS

interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse

function moveAnimal(animal: Animal) {
  let speed;
  switch(animal.type) {
    case 'bird':
      speed = animal.flyingSpeed
      break
    case 'horse':
      speed = animal.runningSpeed
  }
  console.log('Moving at speed: ', speed)
}

moveAnimal({type: 'bird', flyingSpeed: 9})
moveAnimal({type: 'horse', runningSpeed: 5})

// TYPE CASTING

// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!
const userInputElement = document.getElementById('user-input')

if (userInputElement) {
  (<HTMLInputElement>userInputElement).value = 'Hi there!'
  // (userInputElement as HTMLInputElement).value = 'Hi there!'
}

const userSelectElement = <HTMLSelectElement>document.getElementById('user-select')!
userSelectElement.value = '1'

// enum TYPES {
//   email = 'email',
//   username = 'username'
// }


// INDEX PROPERTIES
interface ErrorContainer {
  // [key in TYPES]: string
  [key: string]: string
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  username: 'Must start with a capital character!'
}
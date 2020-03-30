// DECORATORS
function Logger(logEntity: string) {
    console.log('LOGGER FACTORY')
  
    // using factory to make it generic
    return function(constructor: Function) {
      console.log(logEntity)
      console.log(constructor)
    }
  }
  
  function WithTemplate(template: string, hookId: string) {
    console.log('TEMPLATE FACTORY')
  
    return function<T extends {new (...args: any[]): { name: string }}>(oldConstructor: T) {
      return class extends oldConstructor {
        constructor(..._: any[]) {
          super()
          console.log('Componente is rendering...')
          const element = document.getElementById('app')
          if(element) {
            element.innerHTML = template
            const h1 = document.querySelector('h1')!
            h1.innerText = h1.innerText + this.name
          }
        }
      }
    }
  }
  
  @Logger('Logging Candidate')
  @WithTemplate('<h1>My person object - </h1>', 'app')
  class Candidate {
    name = 'John'
    constructor() {
      console.log('Creating an user...')
    }
  }
  
  const candidateA = new Candidate()
  
  // PROPERTY, ACCESSOR, METHOD AND PARAMETER DECORATORS
  
  function Log(target: any, propertyName: string) {
    console.log('Property decorator')
    console.log(target, propertyName)
  }
  
  function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Accessor decorator')
    console.log(target, name, descriptor)
  }
  
  function Log3(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Method decorator')
    console.log(target, name, descriptor)
  }
  
  function Log4(target: any, name: string, position: number) {
    console.log('Parameter decorator')
    console.log(target, name, position)
  }
  
  class Product {
    @Log
    title: string
    private _price: number
  
    constructor(t: string, p: number) {
      this.title = t
      this._price = p
    }
  
    @Log2
    set price(p: number) {
      if (p > 0) {
        this._price = p
      } else {
        throw new Error('Price must be positive!')
      }
    }
  
    @Log3
    getPriceWithTax(@Log4 tax: number) {
      return this._price * (1 + tax)
    }
  }
  
  export function Autobind(target: any, name: string, descriptor: PropertyDescriptor) {
    return {
      configurable: true,
      enumerable: false,
      get() {
        // bind to the method, the instance of the class
        return descriptor.value.bind(this)
      }
    }
  }
  
  class Printer {
    message = 'This works!'
  
    @Autobind
    showMessage() {
      console.log(this.message)
    }
  }
  
  const p = new Printer()
  
  const button = document.querySelector('button')!
  // button.addEventListener('click', p.showMessage.bind(p))
  button.addEventListener('click', p.showMessage)
  
  interface ValidationConfig {
    [property: string]: {
      [validatableProp: string]: string[] // ['required', 'positive']
    }
  }
  
  const registeredValidators: ValidationConfig = {}
  
  function Required(target: any, propertyName: string) {
    registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propertyName]: [
        ...(registeredValidators[target.constructor.name] && registeredValidators[target.constructor.name][propertyName] || []),
        'required'
      ]
    }
  }
  
  function PositiveNumber(target: any, propertyName: string) {
    registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propertyName]: [
        ...(registeredValidators[target.constructor.name] && registeredValidators[target.constructor.name][propertyName]  || []),
        'positive'
      ]
    }
  }
  
  function validation(obj: any): boolean {
    const objValidatorsConf = registeredValidators[obj.constructor.name]
  
    let isValid = true
    for(const prop in objValidatorsConf) {
      for(const validationRule of objValidatorsConf[prop]) {
        switch(validationRule) {
          case 'required':
            isValid = isValid && !!obj[prop]
            break
          case 'positive':
            isValid = isValid && obj[prop] > 0
            break
        }
      }
    }
  
    return isValid
  }
  
  class Course {
    @Required
    title: string
  
    @Required
    @PositiveNumber
    price: number
  
    constructor(t: string, p: number) {
      this.title = t
      this.price = p
    }
  }
  
  const form = document.querySelector('form')!
  form.addEventListener('submit', evt => {
    evt.preventDefault()
    const titleEl = document.getElementById('title')! as HTMLInputElement
    const priceEl = document.getElementById('price')! as HTMLInputElement
  
    const title = titleEl.value
    const price = +priceEl.value
  
    const course = new Course(title, price)
  
    if(!validation(course)) {
      alert('Wrong values. Try again!')
      return;
    }
  
    console.log(course)
  })
  
  
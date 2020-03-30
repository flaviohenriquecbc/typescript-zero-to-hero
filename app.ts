function autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
    return {
      configurable: true,
      enumerable: false,
      get() {
        // bind to the method, the instance of the class
        return descriptor.value.bind(this)
      }
    }
}

interface UserParams {
    titleInputElement: string,
    descriptionInputElement: string,
    peopleInputElement: number,
}

type ValidationProps = {
    [key in keyof UserParams]: {
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        min?: number,
        max?: number,
    }
}

function validate(validatorObj: any, userParam: any): boolean {
    let isValid = true
    for(const key in validatorObj) {
        for(const rule in validatorObj[key]) {
            if (rule === 'required') {
                isValid = isValid && userParam[key]
            }
            if (rule === 'minLength') {
                isValid = isValid && userParam[key].trim().length >= validatorObj[key][rule]
            }
            if (rule === 'maxLength') {
                isValid = isValid && userParam[key].trim().length <= validatorObj[key][rule]
            }
            if (rule === 'min') {
                isValid = isValid && +userParam[key] >= validatorObj[key][rule]
            }
            if (rule === 'max') {
                isValid = isValid && +userParam[key] <= validatorObj[key][rule]
            }
        }
    }
    return isValid
}

class ProjectList {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLElement
    
    constructor(public type: 'active' | 'finished') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')
        this.hostElement = <HTMLDivElement>document.getElementById('app')

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${type}-projects`

        this.attach()
        this.renderContent()
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`
        // this.element.querySelector('ul')!.id = listId
        console.log(this.element)
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
}

  

class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement

    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement
    
    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')
        this.hostElement = <HTMLDivElement>document.getElementById('app')

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        this.titleInputElement = <HTMLInputElement>importedNode.querySelector('#title')
        this.descriptionInputElement = <HTMLInputElement>importedNode.querySelector('#description')
        this.peopleInputElement = <HTMLInputElement>importedNode.querySelector('#people')
        
        this.attach()
        this.configure()
    }

    @autobind
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        const userInput: UserParams = {
            titleInputElement: this.titleInputElement.value,
            descriptionInputElement: this.descriptionInputElement.value,
            peopleInputElement: +this.peopleInputElement.value,
        }

        const validator: ValidationProps = {
            'titleInputElement': {
                required: true,
                minLength: 1,
                maxLength: 10,
            },
            'descriptionInputElement': {
                required: true,
                minLength: 5,
                maxLength: 100,
            },
            'peopleInputElement': {
                required: true,
                min: 1,
                max: 5
            }
        }

        if (!validate(validator, userInput)) {
            alert('Invalid input, please try again!')
            return;
        }

        return [
            enteredTitle,
            enteredDescription,
            +enteredPeople
        ];
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }

    private clearInputs() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()

        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput
            this.clearInputs()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
}

const prjInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
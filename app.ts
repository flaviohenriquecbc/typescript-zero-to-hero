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

enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(public id: string, public title: string, public decription: string, public people: number, public status: ProjectStatus) {}
}

type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = []

    addListener(listernFn: Listener<T>) {
        this.listeners.push(listernFn)
    }
}

class ProjectState extends State<Project> {
    private projects: Project[] = []
    private static instance: ProjectState

    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        }

        this.instance = new ProjectState()

        return this.instance
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active)
        this.projects.push(newProject)

        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
        
    }
}

const projectState = ProjectState.getInstance()

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

// Component base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)
        this.hostElement = <T>document.getElementById(hostElementId)

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as U
        if (newElementId) {
            this.element.id = newElementId
        }

        this.attach(insertAtStart)
    }

    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element)
    }

    abstract configure(): void
    abstract renderContent(): void
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {

    private project: Project

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project

        this.configure()
        this.renderContent()
    }

    configure(): void {}

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.project.people.toString()
        this.element.querySelector('p')!.textContent = this.project.decription
    }
}


class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[]
    
    constructor(public type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = []

        this.configure()
        this.renderContent()
    }

    configure() {
        projectState?.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active
                } else {
                    return prj.status === ProjectStatus.Finished
                }
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

    private renderProjects() {
        const listEl = document.querySelector(`#${this.type}-projects ul`) as HTMLUListElement
        listEl.innerHTML = ''
        for(const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li')
            listItem.textContent = prjItem.title
            listEl?.appendChild(listItem)
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }
}

  

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement
    
    constructor() {
        super('project-input', 'app', true, 'user-input')

        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title')
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description')
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people')

        this.configure()
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    renderContent() {}

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
            projectState?.addProject(title, description, people)
            this.clearInputs()
        }
    }
}

const prjInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
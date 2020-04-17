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

interface Draggable {
    dragStartHandler(event: DragEvent): void
    dragEndHandler(event: DragEvent): void
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
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
        this.updateListeners()
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId)
        if (project && project.status !== newStatus) {
            project.status = newStatus
            this.updateListeners()
        }
    }

    private updateListeners() {
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

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project

        this.configure()
        this.renderContent()
    }

    get persons() {
        if(this.project.people === 1) {
            return '1 person'
        }

        return ` ${this.project.people} persons`
    }

    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
        this.element.querySelector('p')!.textContent = this.project.decription
    }

    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed = 'move'
    }

    @autobind
    dragEndHandler(event: DragEvent): void {
        console.log('drag end')
    }
}


class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
    }

    private renderProjects() {
        const listEl = document.querySelector(`#${this.type}-projects ul`) as HTMLUListElement
        listEl.innerHTML = ''
        for(const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }

    @autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault(); // we need this to fire the drop event (dropHandler)
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }
    }

    @autobind
    dropHandler(event: DragEvent): void {
        const projId = event.dataTransfer!.getData('text/plain')
        projectState.moveProject(projId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)

    }

    @autobind
    dragLeaveHandler(event: DragEvent): void {
        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')
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
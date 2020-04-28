/// <reference path="./basic-component.ts" />
/// <reference path="../decorators/autobind.ts" />

namespace App {
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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

}
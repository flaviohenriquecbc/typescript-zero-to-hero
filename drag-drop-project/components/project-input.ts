/// <reference path="./basic-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../utils/validation.ts" />

namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}
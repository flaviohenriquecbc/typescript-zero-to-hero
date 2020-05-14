import { ProjectInput } from './drag-drop-project/components/project-input'
import { ProjectList } from './drag-drop-project/components/project-list'

declare const GLOBAL: string

console.log(GLOBAL)

new ProjectInput()
new ProjectList('active')
new ProjectList('finished')

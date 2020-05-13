export interface UserParams {
    titleInputElement: string,
    descriptionInputElement: string,
    peopleInputElement: number,
}

export type ValidationProps = {
    [key in keyof UserParams]: {
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        min?: number,
        max?: number,
    }
}

export function validate(validatorObj: any, userParam: any): boolean {
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
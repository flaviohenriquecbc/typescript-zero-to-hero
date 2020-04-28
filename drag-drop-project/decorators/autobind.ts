namespace App {
    export function autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
        return {
            configurable: true,
            enumerable: false,
            get() {
                // bind to the method, the instance of the class
                return descriptor.value.bind(this)
            }
        }
    }
}
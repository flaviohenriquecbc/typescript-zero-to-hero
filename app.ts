import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import { Product } from './class-utils/Product.model'

const products = [
    { title: 'A Carpet', price: 29.99 },
    { title: 'A Book', price: 10.99 }
]

const loadedProducts = plainToClass(Product, products)

for (const prod of loadedProducts) {
    console.log(prod.getInformation())
}

const newProd = new Product('', -5.99)
validate(newProd).then(errors => {
    if(errors.length > 0) {
        console.log('VALIDATION ERROS!')
        console.log(errors)
    } else {
        console.log(newProd.getInformation())
    }
})

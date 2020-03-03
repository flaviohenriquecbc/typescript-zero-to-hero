enum Role {
    ADMIN = 5,
    READ_ONLY,
    AUTHOR
}

const person: {
    name: string;
    age: number;
    hobbies: string[];
    category: [number, string];
    role: Role
} = {
    name: 'Flavio',
    age: 34,
    hobbies: ['Bike', 'Guitar'],
    category: [2, 'engineer'],
    role: 112
}

console.log(person.name)

for( const hobby of person.hobbies) {
    console.log(hobby.toUpperCase())
}
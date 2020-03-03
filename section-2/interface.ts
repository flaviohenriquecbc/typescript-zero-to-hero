type AddFn = (a: number, b: number) => number;
// interface AddFn {
//   (a: number, b: number): number;
// }

interface Named {
  readonly name: string;
  outputName?: string;
  myMethod?(): void;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable, Named {
  name: string;
  age: number = 30;

  constructor(n: string) {
    this.name = n;
  }

  greet(phrase: string) {
    console.log("hello");
  }
}

const user1 = new Person("Max");

user1.greet("hey");
user1.name = "bla";

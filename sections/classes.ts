class Department {
  constructor(private id: string, private name: string) {}
}

class ITDepartment extends Department {
  constructor(id: string) {
    super(id, "IT");
  }
}

const it = new ITDepartment("1");

console.log(it);

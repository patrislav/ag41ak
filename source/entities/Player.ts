
class Player {
  firstname: string;
  lastname: string;

  constructor(firstname: string, lastname: string) {
    this.firstname = firstname;
    this.lastname = lastname;
  }

  outputName(): void {
    console.log("My name is " + this.firstname + " " + this.lastname + ".");
  }

  getFullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}

export = Player;

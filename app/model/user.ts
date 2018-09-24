export class User {
  id: string;
  loginId: string;
  name: string;

  constructor(args: {id?: string, loginId: string, name: string}) {
    if (!args) return;

    if (args.id) this.id = args.id;
    this.loginId = args.loginId;
    this.name = args.name;
  }
}
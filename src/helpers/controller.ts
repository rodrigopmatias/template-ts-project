export default class BaseController {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  get controllerName(): string {
    return this.name;
  }
}

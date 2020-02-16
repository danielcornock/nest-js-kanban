export class StubCreator {
  static create<T>(stubbedClass: any): T {
    return (new stubbedClass() as Partial<T>) as T;
  }
}

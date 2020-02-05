export class LinkBuilder {
  public static self(area: string, id?: string) {
    return `${area}${id ? '/' + id : ''}`;
  }
}

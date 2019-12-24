import { IsString, IsArray, IsOptional } from 'class-validator';

export class BoardDTO {
  @IsString()
  public readonly title: string;

  @IsArray()
  @IsOptional()
  public readonly columns: Array<string>;
}

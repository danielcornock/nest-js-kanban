import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class BoardDTO {
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @IsArray()
  @IsOptional()
  public readonly columns: Array<string>;
}

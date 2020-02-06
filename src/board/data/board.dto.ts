import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { IColumn } from '../model/board';

export class BoardDTO {
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @IsArray()
  @IsOptional()
  public readonly columns: Array<IColumn>;
}

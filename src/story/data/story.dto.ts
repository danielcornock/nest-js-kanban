import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class StoryDTO {
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @IsString()
  @IsOptional()
  public readonly description: string;
}

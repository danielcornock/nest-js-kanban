import { IsString, IsOptional } from 'class-validator';

export class StoryDTO {
  @IsString()
  public readonly title: string;

  @IsString()
  @IsOptional()
  public readonly description: string;
}

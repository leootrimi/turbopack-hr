import {
  jobLocationTypeEnum,
  jobStatusEnum,
  jobTypeEnum,
} from 'src/database/schema';

export class CreateJobDto {
  title: string;
  department: string;
  location: string;
  locationType: (typeof jobLocationTypeEnum.enumValues)[number];
  type: (typeof jobTypeEnum.enumValues)[number];
  salary?: string;
  status: (typeof jobStatusEnum.enumValues)[number];
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
}

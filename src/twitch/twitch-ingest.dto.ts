export class TwitchIngest {
  _id: number;
  availability: number;
  default: boolean;
  name: string;
  url_template: string;
  priority: number;
}

export type TwitchIngests = {
  ingests: TwitchIngest[];
};

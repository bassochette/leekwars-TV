export class Farmer {
  leeks: Record<string, { id: string }>;
}
export class LoginTokenDto {
  farmer: Farmer;
  token: string;
}

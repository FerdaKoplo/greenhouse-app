import { AuthResponseDTO, LoginDto } from "@greenhouse/schemas";

export interface IAuthService {
  login(name: string, password: string): Promise<AuthResponseDTO>;
}

import { Tokens } from "./tokens.interface";
import { User } from "./user.interface";

export interface AuthResponse extends Tokens {
	user: User;
}

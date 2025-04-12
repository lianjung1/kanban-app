import { UserForm } from "./UserForm";
import { User } from "./User";

export type AuthStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
  signup: (user: UserForm) => Promise<void>;
  login: (user: UserForm) => Promise<void>;
  logout: () => Promise<void>;
};

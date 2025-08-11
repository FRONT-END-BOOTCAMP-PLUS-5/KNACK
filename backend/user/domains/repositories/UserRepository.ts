import { UpdateUser } from '../entities/User';

export interface UserRepository {
  updateUser(id: string): Promise<UpdateUser>;
}

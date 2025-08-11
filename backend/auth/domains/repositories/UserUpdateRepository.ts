import { UpdateUser } from '../entities/UpdateUser';

export interface UserUpdateRepository {
  updateUser(id: string): Promise<UpdateUser>;
}

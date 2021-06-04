import { getRepository, Repository } from 'typeorm';

import User from '../entities/User';

interface ICreateUserDTO {
  account_id: string;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  avatar: string;
  recognition_points: number;
  position_id?: string;
  department_id?: string;
}

class UsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  // public async listAllFromAccount(account_id: number): Promise<string[]> {
  //   return this.ormRepository.find;
  // }
}

export default UsersRepository;

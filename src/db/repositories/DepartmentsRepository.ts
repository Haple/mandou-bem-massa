import { getRepository, Repository } from 'typeorm';

import Department from '../entities/Department';

interface ICreateDepartmentDTO {
  account_id: string;
  department_name: string;
}

class DepartmentsRepository {
  private ormRepository: Repository<Department>;

  constructor() {
    this.ormRepository = getRepository(Department);
  }

  public async create(
    department_data: ICreateDepartmentDTO,
  ): Promise<Department> {
    const department = this.ormRepository.create(department_data);

    await this.ormRepository.save(department);

    return department;
  }

  public async save(department: Department): Promise<Department> {
    return this.ormRepository.save(department);
  }
}

export default DepartmentsRepository;

import { getRepository, Repository } from 'typeorm';

import ProviderAccount from '../entities/ProviderAccount';

interface ICreateProviderAccountDTO {
  company_name: string;
  cnpj: string;
  name: string;
  email: string;
  password: string;
}

class ProviderAccountsRepository {
  private ormRepository: Repository<ProviderAccount>;

  constructor() {
    this.ormRepository = getRepository(ProviderAccount);
  }

  public async create(
    providerData: ICreateProviderAccountDTO,
  ): Promise<ProviderAccount> {
    const provider = this.ormRepository.create(providerData);

    await this.ormRepository.save(provider);

    return provider;
  }
}

export default ProviderAccountsRepository;

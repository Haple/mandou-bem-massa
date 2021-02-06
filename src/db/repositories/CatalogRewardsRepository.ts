import { getRepository, Repository } from 'typeorm';

import CatalogReward from '../entities/CatalogReward';

interface ICreateCatalogRewardDTO {
  account_id: string;
  title: string;
  image_url: string;
  points: number;
}

class CatalogRewardsRepository {
  private ormRepository: Repository<CatalogReward>;

  constructor() {
    this.ormRepository = getRepository(CatalogReward);
  }

  public async create(
    catalog_reward_data: ICreateCatalogRewardDTO,
  ): Promise<CatalogReward> {
    const catalog_reward = this.ormRepository.create(catalog_reward_data);

    await this.ormRepository.save(catalog_reward);

    return catalog_reward;
  }

  public async save(catalog_reward: CatalogReward): Promise<CatalogReward> {
    return this.ormRepository.save(catalog_reward);
  }
}

export default CatalogRewardsRepository;

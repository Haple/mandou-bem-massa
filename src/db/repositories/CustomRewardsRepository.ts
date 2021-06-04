import { getRepository, Repository } from 'typeorm';

import CustomReward from '../entities/CustomReward';

interface ICreateCustomRewardDTO {
  account_id: string;
  title: string;
  image_url: string;
  points: number;
  units_available: number;
  expiration_days: number;
  description: string;
}

class CustomRewardsRepository {
  private ormRepository: Repository<CustomReward>;

  constructor() {
    this.ormRepository = getRepository(CustomReward);
  }

  public async create(
    custom_reward_data: ICreateCustomRewardDTO,
  ): Promise<CustomReward> {
    const custom_reward = this.ormRepository.create(custom_reward_data);

    await this.ormRepository.save(custom_reward);

    return custom_reward;
  }

  public async save(custom_reward: CustomReward): Promise<CustomReward> {
    return this.ormRepository.save(custom_reward);
  }
}

export default CustomRewardsRepository;

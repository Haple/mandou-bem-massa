import { getRepository, Repository } from 'typeorm';

import GiftCard from '../entities/GiftCard';

interface ICreateGiftCardDTO {
  provider_id: string;
  title: string;
  image_url: string;
  points: number;
  units_available: number;
  expiration_days: number;
  description: string;
}

class GiftCardsRepository {
  private ormRepository: Repository<GiftCard>;

  constructor() {
    this.ormRepository = getRepository(GiftCard);
  }

  public async create(gift_card_data: ICreateGiftCardDTO): Promise<GiftCard> {
    const gift_card = this.ormRepository.create(gift_card_data);

    await this.ormRepository.save(gift_card);

    return gift_card;
  }

  public async save(gift_card: GiftCard): Promise<GiftCard> {
    return this.ormRepository.save(gift_card);
  }

  public async remove(gift_card: GiftCard): Promise<void> {
    await this.ormRepository.softRemove(gift_card);
  }
}

export default GiftCardsRepository;

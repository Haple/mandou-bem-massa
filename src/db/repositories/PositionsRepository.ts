import { getRepository, Repository } from 'typeorm';

import Position from '../entities/Position';

interface ICreatePositionDTO {
  account_id: string;
  position_name: string;
  points: number;
}

class PositionsRepository {
  private ormRepository: Repository<Position>;

  constructor() {
    this.ormRepository = getRepository(Position);
  }

  public async create(position_data: ICreatePositionDTO): Promise<Position> {
    const position = this.ormRepository.create(position_data);

    await this.ormRepository.save(position);

    return position;
  }

  public async save(position: Position): Promise<Position> {
    return this.ormRepository.save(position);
  }

  public async remove(position: Position): Promise<void> {
    await this.ormRepository.softRemove(position);
  }
}

export default PositionsRepository;

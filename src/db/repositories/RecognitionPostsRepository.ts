import { getMongoRepository, MongoRepository } from 'typeorm';

import RecognitionPost from '../schemas/RecognitionPost';

interface ICreateRecognitionPostDTO {
  account_id: string;
  from_user_id: string;
  from_name: string;
  from_avatar: string;
  to_user_id: string;
  to_name: string;
  to_avatar: string;
  content: string;
  recognition_points: number;
  created_at: Date;
}

class RecognitionPostsRepository {
  private ormRepository: MongoRepository<RecognitionPost>;

  constructor() {
    this.ormRepository = getMongoRepository(RecognitionPost, 'mongo');
  }

  public async create(
    recognition_post_data: ICreateRecognitionPostDTO,
  ): Promise<RecognitionPost> {
    const recognition_post = this.ormRepository.create(recognition_post_data);

    await this.ormRepository.save(recognition_post);

    return recognition_post;
  }

  public async save(
    recognition_post: RecognitionPost,
  ): Promise<RecognitionPost> {
    return this.ormRepository.save(recognition_post);
  }
}

export default RecognitionPostsRepository;

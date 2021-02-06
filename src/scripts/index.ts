import 'dotenv/config';
import * as faker from 'faker';

import User from 'db/entities/User';
import CatalogReward from 'db/entities/CatalogReward';
import RecognitionPostsRepository from 'db/repositories/RecognitionPostsRepository';
import RecognitionPost from 'db/schemas/RecognitionPost';
import randomInteger from './randomInteger';
import randomDate from './randomDate';
import connect from '../db';
import AccountsRepository from '../db/repositories/AccountsRepository';
import UsersRepository from '../db/repositories/UsersRepository';
import CatalogRewardsRepository from '../db/repositories/CatalogRewardsRepository';

// 1234
const DEFAULT_PASSWORD =
  '$2a$08$K2xbkODM0iAqjiTbXbFu4.500ScDyzo/tP1QN4bs89MbZpzX47zkS';

async function generateUser(account_id: string): Promise<User> {
  const usersRepository = new UsersRepository();
  const name = faker.name.findName();
  const user = await usersRepository.create({
    name,
    email: faker.internet.exampleEmail(name, ''),
    password: DEFAULT_PASSWORD,
    avatar: `https://i.pravatar.cc/180?u=${faker.random.uuid()}`,
    recognition_points: randomInteger(0, 1400),
    is_admin: false,
    account_id,
  });
  return user;
}

async function createUsersForAccount(
  account_id: string,
  quantity: number,
  admin_email: string,
): Promise<User[]> {
  const usersRepository = new UsersRepository();
  const users: User[] = [];

  const admin = await usersRepository.create({
    name: faker.name.findName(),
    email: admin_email,
    password: DEFAULT_PASSWORD,
    avatar: `https://i.pravatar.cc/180?u=${faker.random.uuid()}`,
    recognition_points: 1000000,
    is_admin: true,
    account_id,
  });
  users.push(admin);

  const generatedUsers: Promise<User>[] = [];
  for (let i = 0; i < quantity; i += 1) {
    generatedUsers.push(generateUser(account_id));
  }
  (await Promise.all(generatedUsers)).forEach(user => {
    users.push(user);
  });
  return users;
}

async function createDefaultRewards(
  account_id: string,
): Promise<CatalogReward[]> {
  const catalogRewardsRepository = new CatalogRewardsRepository();
  const reward1 = await catalogRewardsRepository.create({
    account_id,
    title: 'Dia de folga',
    image_url:
      'https://uknow.uky.edu/sites/default/files/styles/uknow_story_image/public/GettyImages-1160947136%20%281%29.jpg',
    points: 50000,
  });
  const reward2 = await catalogRewardsRepository.create({
    account_id,
    title: '2 meses de Netflix',
    image_url:
      'https://tecnoblog.net/wp-content/uploads/thumbs/285012-thumb-serp-1200x675.jpg',
    points: 500,
  });
  return [reward1, reward2];
}

async function createPosts(
  account_id: string,
  users: User[],
  quantity: number,
): Promise<void> {
  const recognitionPostsRepository = new RecognitionPostsRepository();
  const generatedPosts: Promise<RecognitionPost>[] = [];
  for (let i = 0; i < quantity; i += 1) {
    const from = users[randomInteger(0, users.length - 1)];
    const to = users[randomInteger(0, users.length - 1)];
    const randomCreatedAt = randomDate(new Date(2020, 0, 1), new Date());
    generatedPosts.push(
      recognitionPostsRepository.create({
        account_id,
        content: faker.lorem.paragraph(),
        from_avatar: from.avatar,
        from_name: from.name,
        from_user_id: from.id,
        to_avatar: to.avatar,
        to_name: to.name,
        to_user_id: to.id,
        recognition_points: randomInteger(4, 18),
        created_at: randomCreatedAt,
      }),
    );
  }
  await Promise.all(generatedPosts);
}

async function main(): Promise<void> {
  console.log('Connecting to databases...');

  await connect();

  console.log('Script started');

  const accountsRepository = new AccountsRepository();

  const nubank = await accountsRepository.create('Coca Cola');

  const users = await createUsersForAccount(
    nubank.id,
    50,
    'aleph.oliveira@etec.sp.gov.br',
  );
  await createDefaultRewards(nubank.id);

  await createPosts(nubank.id, users, 3000);

  console.log(`account1: ${JSON.stringify(nubank)}`);
  console.log(`user1: ${JSON.stringify(users[0])}`);

  console.log('Done!');
}

main();

import 'dotenv/config';
import * as faker from 'faker';

import User from 'db/entities/User';
import CustomReward from 'db/entities/CustomReward';
import RecognitionPostsRepository from 'db/repositories/RecognitionPostsRepository';
import RecognitionPost from 'db/schemas/RecognitionPost';
import Position from 'db/entities/Position';
import Department from 'db/entities/Department';
import GiftCard from 'db/entities/GiftCard';
import randomInteger from './randomInteger';
import randomDate from './randomDate';
import connect from '../db';
import AccountsRepository from '../db/repositories/AccountsRepository';
import UsersRepository from '../db/repositories/UsersRepository';
import CustomRewardsRepository from '../db/repositories/CustomRewardsRepository';
import GiftCardsRepository from '../db/repositories/GiftCardsRepository';
import DepartmentsRepository from '../db/repositories/DepartmentsRepository';
import PositionsRepository from '../db/repositories/PositionsRepository';
import ProviderAccountsRepository from '../db/repositories/ProviderAccountsRepository';

// 1234
// const DEFAULT_PASSWORD =
//   '$2a$08$K2xbkODM0iAqjiTbXbFu4.500ScDyzo/tP1QN4bs89MbZpzX47zkS';

// 123456
const DEFAULT_PASSWORD =
  '$2a$08$V7VrFYpqRKLV3ZMqvIRWtestPFYJxB8jnzuARJOC5Y3iSnt0E2Y7a';

async function generateUser(
  account_id: string,
  position_id: string,
  department_id: string,
): Promise<User> {
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
    position_id,
    department_id,
  });
  return user;
}

async function createDefaultPositions(account_id: string): Promise<Position[]> {
  const positionsRepository = new PositionsRepository();
  const position0 = await positionsRepository.create({
    account_id,
    position_name: 'Vendedor',
    points: 200,
  });
  const position1 = await positionsRepository.create({
    account_id,
    position_name: 'Analista de Marketing',
    points: 100,
  });
  const position2 = await positionsRepository.create({
    account_id,
    position_name: 'Analista de Logística',
    points: 200,
  });
  const position3 = await positionsRepository.create({
    account_id,
    position_name: 'Contador',
    points: 100,
  });
  const position4 = await positionsRepository.create({
    account_id,
    position_name: 'Gerente',
    points: 200,
  });
  return [position0, position1, position2, position3, position4];
}

async function createDefaultDepartments(
  account_id: string,
): Promise<Department[]> {
  const departmentsRepository = new DepartmentsRepository();
  const department0 = await departmentsRepository.create({
    account_id,
    department_name: 'Vendas',
  });
  const department1 = await departmentsRepository.create({
    account_id,
    department_name: 'Marketing',
  });
  const department2 = await departmentsRepository.create({
    account_id,
    department_name: 'Logística',
  });
  const department3 = await departmentsRepository.create({
    account_id,
    department_name: 'Financeiro',
  });
  return [department0, department1, department2, department3];
}

async function createUsersForAccount(
  account_id: string,
  quantity: number,
  admin_email: string,
): Promise<User[]> {
  const usersRepository = new UsersRepository();
  const users: User[] = [];

  const positions = await createDefaultPositions(account_id);
  const departments = await createDefaultDepartments(account_id);

  const admin = await usersRepository.create({
    name: faker.name.findName(),
    email: admin_email,
    password: DEFAULT_PASSWORD,
    avatar: `https://i.pravatar.cc/180?u=${faker.random.uuid()}`,
    recognition_points: 8500,
    is_admin: true,
    account_id,
    position_id: positions[4].id,
    department_id: departments[0].id,
  });
  users.push(admin);

  const generatedUsers: Promise<User>[] = [];
  for (let i = 0; i < quantity; i += 1) {
    const randomIndex = randomInteger(0, 3);
    generatedUsers.push(
      generateUser(
        account_id,
        positions[randomIndex].id,
        departments[randomIndex].id,
      ),
    );
  }
  (await Promise.all(generatedUsers)).forEach(user => {
    users.push(user);
  });
  return users;
}

async function createDefaultCustomRewards(
  account_id: string,
): Promise<CustomReward[]> {
  const catalogRewardsRepository = new CustomRewardsRepository();
  const reward1 = await catalogRewardsRepository.create({
    account_id,
    title: 'Dia de folga',
    image_url:
      'https://uknow.uky.edu/sites/default/files/styles/uknow_story_image/public/GettyImages-1160947136%20%281%29.jpg',
    points: 50000,
    units_available: 15,
    expiration_days: 365,
    description:
      'A solicitação de resgate passa por um processo de avaliação e' +
      ' assim que aprovado seu QR Code será exibido em sua listagem' +
      ' de resgates. Para fazer o usufruir desse prêmio basta ir ao RH' +
      ' de nossa empresa Escritório J&J e apresentar o QR Code' +
      ' gerado pelo sistema Mandou Bem. Para mais detalhes acesse' +
      ' o seguinte link: https://escritoriojej.com.br/mandou-bem.',
  });
  const reward2 = await catalogRewardsRepository.create({
    account_id,
    title: '2 meses de Netflix',
    image_url:
      'https://tecnoblog.net/wp-content/uploads/thumbs/285012-thumb-serp-1200x675.jpg',
    points: 500,
    units_available: 15,
    expiration_days: 365,
    description:
      'A solicitação de resgate passa por um processo de avaliação e' +
      ' assim que aprovado seu QR Code será exibido em sua listagem' +
      ' de resgates. Para fazer o usufruir desse prêmio basta ir ao RH' +
      ' de nossa empresa Escritório J&J e apresentar o QR Code' +
      ' gerado pelo sistema Mandou Bem. Para mais detalhes acesse' +
      ' o seguinte link: https://escritoriojej.com.br/mandou-bem.',
  });
  return [reward1, reward2];
}

async function createDefaultGiftCards(
  provider_id: string,
): Promise<GiftCard[]> {
  const giftCardsRepository = new GiftCardsRepository();
  const reward1 = await giftCardsRepository.create({
    provider_id,
    title: 'Vale Um Par de Havaianas',
    image_url:
      'https://giftty.com/wp-content/uploads/2020/11/MOCKUP_CARTA%CC%83O_HAVAIANAS.png',
    points: 100,
    units_available: 12,
    expiration_days: 365,
    description:
      'Para fazer o resgate desse prêmio basta ir a qualquer' +
      ' loja Havaianas do estado de São Paulo e apresentar o QR' +
      ' Code gerado pelo sistema Mandou Bem. Para mais detalhes' +
      ' acesse o seguinte link: https://havaianas.com.br/mandou-bem',
  });
  const reward2 = await giftCardsRepository.create({
    provider_id,
    title: 'Vale Dois Pares de Havaianas',
    image_url:
      'https://img.elo7.com.br/product/original/1140DA0/havaianas-mae-noivo-noiva-kit-2-pares-havaianas-para-noiva.jpg',
    points: 200,
    units_available: 6,
    expiration_days: 365,
    description:
      'Para fazer o resgate desse prêmio basta ir a qualquer' +
      ' loja Havaianas do estado de São Paulo e apresentar o QR' +
      ' Code gerado pelo sistema Mandou Bem. Para mais detalhes' +
      ' acesse o seguinte link: https://havaianas.com.br/mandou-bem',
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
  const fakeContents = [
    'Eu não posso agradecer o suficiente por me ajudar' +
      ' com a sessão de treinamento para clientes' +
      ' de ontem! Você falou com clareza e confiança sobre o' +
      ' valor de nosso produto e, ao mesmo tempo, tornou fácil' +
      ' ver como podemos trabalhar juntos para atender às ' +
      'necessidades deles. Muito obrigado! :)',
    'obrigado pelo brainstorming comigo durante nossa reunião' +
      ' 1:1 hoje. 🧠⛈ Agradeço sua perspectiva criativa e como' +
      ' você sempre coloca nossos clientes em primeiro lugar.',
    'Acho que o novo artigo que você acabou de publicar é o meu' +
      ' favorito até agora. A pesquisa que você fez é muito ' +
      'esclarecedora e suas ideias são 💯. Nossos leitores vão adorar!',
    'Muito obrigado por oraganizar a comida para nosso almoço da equipe ' +
      'e ter em mente as restrições alimentares de todos! Quem diria que' +
      ' alguns 🍣 não são isentos de glúten. 🤔',
    'Parabéns pela sua promoção! Eu sempre vi você como um líder em nossa' +
      ' equipe, e estou feliz que seu cargo agora reflete o quão importante' +
      ' você é para nós!',
  ];
  for (let i = 0; i < quantity; i += 1) {
    const from = users[randomInteger(0, users.length - 1)];
    const to = users[randomInteger(0, users.length - 1)];
    const randomCreatedAt = randomDate(new Date(2020, 0, 1), new Date());
    generatedPosts.push(
      recognitionPostsRepository.create({
        account_id,
        content: fakeContents[randomInteger(0, fakeContents.length - 1)],
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
  const account1 = await accountsRepository.create('Coca Cola');

  const users = await createUsersForAccount(account1.id, 50, 'aleph@gmail.com');
  await createDefaultCustomRewards(account1.id);

  await createPosts(account1.id, users, 300);

  const providerAccountsRepository = new ProviderAccountsRepository();
  const provider1 = await providerAccountsRepository.create({
    cnpj: '18995562000188',
    company_name: 'Alpargatas s/a',
    email: 'marcosaurelio@alpargatas.com.br',
    name: 'Marcos Aurelio',
    password: DEFAULT_PASSWORD,
  });
  await createDefaultGiftCards(provider1.id);

  console.log(`account1: ${JSON.stringify(account1)}`);
  console.log(`user1: ${JSON.stringify(users[0])}`);

  console.log('Done!');
}

main();

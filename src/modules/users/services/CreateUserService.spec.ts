import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: 'Joe Damarino',
      email: 'userTDD@teste.com',
      password: '12345678'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: 'Joe Damarino',
      email: 'userTDD@teste.com',
      password: '12345678'
    });

    expect(
      createUser.execute({
        name: 'Joe Damarino',
        email: 'userTDD@teste.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

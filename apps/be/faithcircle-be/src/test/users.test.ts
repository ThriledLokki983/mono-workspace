import request from 'supertest';
import { App } from '@/app';
import pg, { pool } from '@database';
import { CreateUserDto, UpdateUserDto, UserRole } from '@dtos/users.dto';
import { UserRoute } from '@routes/users.route';

// Test user data that matches the schema requirements
const testUser: CreateUserDto = {
  email: 'test.user@example.com',
  password: 'Password1!',
  name: 'Test User',
  first_name: 'Test',
  last_name: 'User',
  phone: '+31612345678',
  address: '123 Test Street',
  role: UserRole.USER,
  language_preference: 'en',
  is_active: true,
};

// Clean up test data
beforeAll(async () => {
  // Delete test users if they exist from previous test runs
  try {
    await pg.query(
      `DELETE FROM users WHERE email LIKE 'test.%@example.com' OR email LIKE 'get.%@example.com' OR email LIKE 'create.%@example.com' OR email LIKE 'duplicate.%@example.com' OR email LIKE 'update.%@example.com' OR email LIKE 'delete.%@example.com'`,
    );
  } catch (error) {
    console.error('Error cleaning test data:', error);
  }
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  // Clean up test data
  try {
    await pg.query(
      `DELETE FROM users WHERE email LIKE 'test.%@example.com' OR email LIKE 'get.%@example.com' OR email LIKE 'create.%@example.com' OR email LIKE 'duplicate.%@example.com' OR email LIKE 'update.%@example.com' OR email LIKE 'delete.%@example.com'`,
    );
  } catch (error) {
    console.error('Error cleaning test data:', error);
  }
  // Use pool.end() since pg is just an object with query, pool and redisClient
  await pool.end();
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return await request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', async () => {
      // First create a user to ensure we have a valid ID
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const createResponse = await request(app.getServer())
        .post(`${usersRoute.path}`)
        .send({
          ...testUser,
          email: 'get.test@example.com',
        });

      const userId = createResponse.body.data.id;

      // Now get the user by ID
      return await request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 / created', async () => {
      const userData: CreateUserDto = {
        ...testUser,
        email: 'create.test@example.com',
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const response = await request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', userData.email);
      expect(response.body.data).toHaveProperty('name', userData.name);
      expect(response.body.data).toHaveProperty('first_name', userData.first_name);
      expect(response.body.data).toHaveProperty('last_name', userData.last_name);
    });

    it('response statusCode 409 / conflict', async () => {
      // First create a user
      const userData: CreateUserDto = {
        ...testUser,
        email: 'duplicate.test@example.com',
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      await request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);

      // Try to create a user with the same email
      await request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(409);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 / updated', async () => {
      // First create a user
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const userData: CreateUserDto = {
        ...testUser,
        email: 'update.test@example.com',
      };

      const createResponse = await request(app.getServer()).post(`${usersRoute.path}`).send(userData);

      const userId = createResponse.body.data.id;

      // Now update the user
      const updateData: UpdateUserDto = {
        name: 'Updated Name',
        first_name: 'Updated',
        last_name: 'Name',
      };

      const response = await request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(updateData).expect(200);

      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('first_name', updateData.first_name);
      expect(response.body.data).toHaveProperty('last_name', updateData.last_name);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', async () => {
      // First create a user
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      const userData: CreateUserDto = {
        ...testUser,
        email: 'delete.test@example.com',
      };

      const createResponse = await request(app.getServer()).post(`${usersRoute.path}`).send(userData);

      const userId = createResponse.body.data.id;

      // Now delete the user
      const response = await request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);

      expect(response.body.data).toHaveProperty('id', userId);

      // Try to get the deleted user
      await request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(404);
    });
  });
});

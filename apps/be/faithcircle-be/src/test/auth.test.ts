import request from 'supertest';
import { App } from '@/app';
import pg, { pool } from '@database';
import { CreateUserDto, UserLoginDto, UserRole } from '@dtos/users.dto';
import { AuthRoute } from '@routes/auth.route';

// Test user data that matches the schema requirements
const testUser: CreateUserDto = {
  email: 'auth.test@example.com',
  password: 'Password1!',
  name: 'Auth Test',
  first_name: 'Auth',
  last_name: 'Test',
  phone: '+31612345678',
  address: '123 Auth Street',
  role: UserRole.USER,
  language_preference: 'en',
  is_active: true,
};

// Login credentials
const loginCredentials: UserLoginDto = {
  email: testUser.email,
  password: testUser.password,
};

// Clean up test data
beforeAll(async () => {
  // Delete test users if they exist from previous test runs
  try {
    await pg.query(
      `DELETE FROM users WHERE email LIKE 'auth.%@example.com' OR email LIKE 'signup_%@example.com' OR email LIKE 'duplicate_%@example.com' OR email LIKE 'login_%@example.com' OR email LIKE 'wrong_password_%@example.com' OR email LIKE 'logout_%@example.com'`,
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
      `DELETE FROM users WHERE email LIKE 'auth.%@example.com' OR email LIKE 'signup_%@example.com' OR email LIKE 'duplicate_%@example.com' OR email LIKE 'login_%@example.com' OR email LIKE 'wrong_password_%@example.com' OR email LIKE 'logout_%@example.com'`,
    );
  } catch (error) {
    console.error('Error cleaning test data:', error);
  }
  // Use pool.end() since pg is just an object with query, pool and redisClient
  await pool.end();
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      // Create a unique email for this test
      const signupUser = {
        ...testUser,
        email: `signup_${Date.now()}@example.com`,
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      const response = await request(app.getServer()).post('/signup').send(signupUser).expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', signupUser.email);
      expect(response.body.data).toHaveProperty('name', signupUser.name);
      expect(response.body.data).toHaveProperty('first_name', signupUser.first_name);
      expect(response.body.data).toHaveProperty('last_name', signupUser.last_name);
    });

    it('response should have 409 with duplicate email', async () => {
      // First create a user
      const signupUser = {
        ...testUser,
        email: `duplicate_${Date.now()}@example.com`,
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      await request(app.getServer()).post('/signup').send(signupUser).expect(201);

      // Try to create a user with the same email
      await request(app.getServer()).post('/signup').send(signupUser).expect(409);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      // First create a user
      const loginUser = {
        ...testUser,
        email: `login_${Date.now()}@example.com`,
      };

      await request(app.getServer()).post('/signup').send(loginUser);

      // Now login with that user
      const loginCreds = {
        email: loginUser.email,
        password: loginUser.password,
      };

      return await request(app.getServer())
        .post('/login')
        .send(loginCreds)
        .expect('Set-Cookie', /^Authorization=.+/);
    });

    it('response should have 409 with incorrect password', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      // First create a user
      const loginUser = {
        ...testUser,
        email: `wrong_password_${Date.now()}@example.com`,
      };

      await request(app.getServer()).post('/signup').send(loginUser);

      // Try to login with wrong password
      const loginCreds = {
        email: loginUser.email,
        password: 'WrongPassword1!',
      };

      return await request(app.getServer()).post('/login').send(loginCreds).expect(409);
    });
  });

  describe('[POST] /logout', () => {
    it('logout should set Authorization cookie to empty with Max-age=0', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      // First create a user
      const logoutUser = {
        ...testUser,
        email: `logout_${Date.now()}@example.com`,
      };

      await request(app.getServer()).post('/signup').send(logoutUser);

      // Login to get the authentication cookie
      const loginCreds = {
        email: logoutUser.email,
        password: logoutUser.password,
      };

      const loginResponse = await request(app.getServer()).post('/login').send(loginCreds);

      // Extract the auth cookie
      const cookies = loginResponse.headers['set-cookie'];

      // Use the cookie to logout
      return await request(app.getServer())
        .post('/logout')
        .set('Cookie', cookies)
        .expect('Set-Cookie', /^Authorization=\;/);
    });
  });
});

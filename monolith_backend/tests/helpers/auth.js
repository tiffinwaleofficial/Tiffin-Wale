const request = require('supertest');
const { app } = require('../../src/app');

// Test user credentials - should be replaced with actual test data
const testUser = {
  email: 'test@example.com',
  password: 'Password123!'
};

/**
 * Gets authentication token for use in API tests
 * @returns {Promise<string>} JWT token
 */
async function getToken() {
  try {
    // Try to login
    const response = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    
    if (response.status === 200 && response.body.accessToken) {
      return response.body.accessToken;
    }
    
    // If login fails, try to register and then login
    await request(app)
      .post('/api/auth/register')
      .send({
        ...testUser,
        name: 'Test User',
        phone: '1234567890'
      });
      
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(testUser);
      
    return loginResponse.body.accessToken;
  } catch (error) {
    console.error('Error getting auth token for tests:', error.message);
    throw error;
  }
}

module.exports = {
  getToken,
  testUser
}; 
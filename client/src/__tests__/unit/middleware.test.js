import request from 'supertest';
import app from '../../app.js';
import Bug from '../../models/Bug.js';

describe('Bug API Integration Tests', () => {
  beforeEach(async () => {
    await Bug.deleteMany({});
  });

  describe('POST /api/bugs', () => {
    test('creates a new bug with valid data', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug',
        severity: 'high'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body).toMatchObject(bugData);
      expect(response.body._id).toBeDefined();
      
      const savedBug = await Bug.findById(response.body._id);
      expect(savedBug).toBeTruthy();
    });

    test('returns 400 for invalid data', async () => {
      const invalidData = {
        description: 'Missing title'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/bugs', () => {
    test('returns all bugs', async () => {
      const bugs = [
        { title: 'Bug 1', description: 'First bug', severity: 'high' },
        { title: 'Bug 2', description: 'Second bug', severity: 'medium' }
      ];

      await Bug.insertMany(bugs);

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Bug 1');
      expect(response.body[1].title).toBe('Bug 2');
    });

    test('returns empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    test('updates existing bug', async () => {
      const bug = await Bug.create({
        title: 'Original Title',
        description: 'Original description',
        severity: 'low'
      });

      const updateData = {
        title: 'Updated Title',
        severity: 'high'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.severity).toBe('high');
      expect(response.body.description).toBe('Original description');
    });

    test('returns 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    test('deletes existing bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to delete',
        description: 'Will be deleted',
        severity: 'low'
      });

      await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);

      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });
  });
});
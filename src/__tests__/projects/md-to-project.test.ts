import { jest } from '@jest/globals';
import { mdToProject } from 'github-projects-md-sync';
import { syncMarkdownFilesToProject } from '../../projects/md-to-project';

jest.mock('github-projects-md-sync', () => ({
  mdToProject: jest.fn().mockResolvedValue({
    result: { success: true, processedFiles: 1, storyCount: 1, todoCount: 1, errors: [] },
    logs: [],
  }),
}));

const mockedMdToProject = mdToProject as jest.Mock;

describe('md-to-project', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should call mdToProject with correct parameters', async () => {
    process.env.PROJECT_ID = 'test-project-id';
    process.env.GITHUB_TOKEN = 'test-token';

    await syncMarkdownFilesToProject();

    const expectedMdDir = expect.stringContaining('stories');
    expect(mockedMdToProject).toHaveBeenCalledWith(
      'test-project-id',
      'test-token',
      expectedMdDir
    );
  });

  it('should handle errors properly', async () => {
    process.env.PROJECT_ID = 'test-project-id';
    process.env.GITHUB_TOKEN = 'test-token';

    mockedMdToProject.mockRejectedValueOnce(new Error('Test error'));

    await expect(syncMarkdownFilesToProject()).rejects.toThrow('Test error');
  });
});
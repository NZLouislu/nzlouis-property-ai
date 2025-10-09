import { jest } from '@jest/globals';
import { projectToMd } from 'github-projects-md-sync';
import { syncProjectItemsToMarkdown } from '../../projects/project-to-md';

jest.mock('github-projects-md-sync', () => ({
  projectToMd: jest.fn().mockResolvedValue({
    result: { success: true, processedItems: 1, createdFiles: 1, updatedFiles: 0, errors: [] },
    logs: [],
  }),
  // we need to provide all exports from the mocked module
  syncProjectItemsToMarkdown: jest.fn(),
}));

const mockedProjectToMd = projectToMd as jest.Mock;

describe('project-to-md', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should call projectToMd with correct parameters', async () => {
    process.env.PROJECT_ID = 'test-project-id';
    process.env.GITHUB_TOKEN = 'test-token';

    await syncProjectItemsToMarkdown();

    const expectedMdDir = expect.stringContaining('stories');
    expect(mockedProjectToMd).toHaveBeenCalledWith(
      'test-project-id',
      'test-token',
      expectedMdDir
    );
  });
});
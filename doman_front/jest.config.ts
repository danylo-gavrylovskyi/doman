import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	dir: './',
});

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/__tests__/mocks/'],
};

export default createJestConfig(config);

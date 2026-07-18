import "@testing-library/jest-dom";

process.env.NEXT_PUBLIC_API_URL = "http://test-api";

// Render next/image as a plain <img> so tests can assert on the raw `src`.
jest.mock("next/image", () => ({
	__esModule: true,
	default: ({ src, alt, ...rest }) => {
		const React = require("react");
		const { fill, priority, loader, quality, placeholder, blurDataURL, ...imgProps } = rest;
		// eslint-disable-next-line jsx-a11y/alt-text
		return React.createElement("img", { src, alt, ...imgProps });
	},
}));

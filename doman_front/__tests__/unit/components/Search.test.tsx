import { render, screen, fireEvent } from "@testing-library/react";

import { Search } from "@/components/Search/Search";

describe("Search Component (Units)", () => {
    let onChangeInput: jest.Mock
    const searchPlaceholderText = "Я шукаю..."

    beforeEach(() => {
        onChangeInput = jest.fn();
    })

    it("renders the search input with the correct placeholder and value", () => {
        const inputValue = "initial search";

        render(<Search onChangeInput={onChangeInput} inputValue={inputValue} />);

        const inputElement = screen.getByPlaceholderText(searchPlaceholderText);
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue(inputValue);
    });

    it("calls onChangeInput when the input value changes", () => {
        const inputValue = "";
        const newValue = "new search"

        render(<Search onChangeInput={onChangeInput} inputValue={inputValue} />);

        const inputElement = screen.getByPlaceholderText(searchPlaceholderText);
        fireEvent.change(inputElement, { target: { value: newValue } });
        expect(onChangeInput).toHaveBeenCalledTimes(1);
    });

    it("matches the snapshot", () => {
        const inputValue = "snapshot value";

        const { asFragment } = render(
            <Search onChangeInput={onChangeInput} inputValue={inputValue} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

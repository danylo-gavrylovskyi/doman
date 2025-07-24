import { useDispatch, useSelector } from "react-redux";
import { fireEvent, render, screen } from "@testing-library/react";

import { toggleAttribute } from "@/redux/features/filterSlice";

import { FilterBlock } from "@/components/FilterBlock/FilterBlock";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("FilterBlock (Unit)", () => {
    let mockDispatch: jest.Mock

    const filterProps = {
        attributeName: 'Test Attribute',
        attributeValues: ['Value 1', 'Value 2']
    }

    beforeEach(() => {
        mockDispatch = jest.fn();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
        (useSelector as jest.Mock).mockReturnValue([]);
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders attribute and its values correctly', () => {
        render(<FilterBlock {...filterProps}></FilterBlock>);

        expect(screen.getByText(filterProps.attributeName)).toBeInTheDocument();
        filterProps.attributeValues.map(attributeValue => {
            expect(screen.getByText(attributeValue)).toBeInTheDocument()
        })
    })

    it('calls toggleAttribute action when clicking checkbox', () => {
        render(<FilterBlock {...filterProps}></FilterBlock>);

        fireEvent.click(screen.getByLabelText(filterProps.attributeValues[0]))
        expect(mockDispatch).toHaveBeenCalledWith(toggleAttribute(filterProps.attributeValues[0]))
    })
})
import { render, screen } from "@testing-library/react"

import { useUpdateQueryParams } from "@/utils/updateQueryParams"

import { Pagination } from "@/components/Pagination/Pagination"

jest.mock("@/utils/updateQueryParams", () => ({
    useUpdateQueryParams: jest.fn(),
}));

describe("Pagination (Unit)", () => {
    let mockUpdateQueryParams: jest.Mock

    beforeEach(() => {
        mockUpdateQueryParams = jest.fn();
        (useUpdateQueryParams as jest.Mock).mockReturnValue(mockUpdateQueryParams)
    })

    it("renders the correct number of pages", () => {
        render(<Pagination pageQuantity={5} currentPage={1} />)

        expect(screen.getAllByRole("button")).toHaveLength(7) // 5 pages + 2 navigation buttons
    })

    it("marks the correct page as active", () => {
        render(<Pagination pageQuantity={5} currentPage={3} />)

        expect(screen.getByText("3")).toHaveClass("activePage")
    })

    it("disables 'previous page' button on first page", () => {
        render(<Pagination pageQuantity={5} currentPage={1} />)

        expect(screen.getAllByRole("button")[0]).toBeDisabled()
        expect(screen.getAllByRole("button")[0]).toHaveClass('disabledButton')
    })

    it("disables 'next page' button on last page", () => {
        render(<Pagination pageQuantity={5} currentPage={5} />)

        const nextButton = screen.getAllByRole("button")[6]; // assuming first and last are nav buttons

        expect(nextButton).toBeDisabled()
        expect(nextButton).toHaveClass('disabledButton')
    })
})
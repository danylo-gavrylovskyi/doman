import { fireEvent, render, screen } from "@testing-library/react"

import { Pagination } from "@/components/Pagination/Pagination"

let queryUpdate: { key: string, value: number } | null = null

const dummyUpdateQueryParams = ({ key, value }: { key: string, value: number }) => {
    queryUpdate = { key, value }
}

jest.mock("@/utils/updateQueryParams", () => ({
    useUpdateQueryParams: () => dummyUpdateQueryParams
}))

describe("Pagination (Integration)", () => {
    beforeEach(() => {
        queryUpdate = null
    })

    it("updates query params when clicking the next button", () => {
        render(<Pagination pageQuantity={5} currentPage={2} />)

        const nextButton = screen.getAllByRole("button")[6]; // assuming first and last are nav buttons

        fireEvent.click(nextButton)
        expect(queryUpdate).toEqual({ key: "page", value: 3 })
    })

    it("updates query params when clicking the previous button", () => {
        render(<Pagination pageQuantity={5} currentPage={3} />);

        fireEvent.click(screen.getAllByRole("button")[0]);
        expect(queryUpdate).toEqual({ key: "page", value: 2 });
    });

    it("updates query params when clicking a specific page number", () => {
        render(<Pagination pageQuantity={5} currentPage={1} />);

        fireEvent.click(screen.getByText("4"));
        expect(queryUpdate).toEqual({ key: "page", value: 4 });
    });
})
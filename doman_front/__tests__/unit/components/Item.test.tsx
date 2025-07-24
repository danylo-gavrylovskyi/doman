import { fireEvent, render, screen } from "@testing-library/react"
import { useDispatch } from "react-redux"

import { addToCart } from "@/redux/features/cartSlice"

import { Item } from "@/components/Item/Item"

import { mockProduct } from "@/__tests__/mocks/product"

jest.mock("react-redux", () => ({
    useDispatch: jest.fn()
}))

describe("Item (Unit)", () => {
    const notInStockText = "Немає в наявності"
    const addToCartText = "Додати"

    let mockDispatch: jest.Mock
    beforeEach(() => {
        mockDispatch = jest.fn();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    })
    afterEach(() => jest.clearAllMocks())

    it("renders item with provided properties", () => {
        render(<Item {...mockProduct} />)


        expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
        expect(screen.getByText(`${mockProduct.price}грн.`)).toBeInTheDocument()
        expect(screen.getByRole("img")).toHaveAttribute("src", `${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${mockProduct.image}`)
        screen.getAllByRole("link").forEach(link => {
            expect(link).toHaveAttribute("href", `/products/${mockProduct.slug}`)
        });
    })

    it("renders item with tint and 'not in stock' text when item quantity <= 0", () => {
        render(<Item {...mockProduct} quantity={0} />)

        expect(screen.getByText(notInStockText)).toBeInTheDocument()
        expect(screen.getByTestId("tint-overlay")).toBeInTheDocument()
    })

    it("renders item without tint when product is in stock", () => {
        render(<Item {...mockProduct} />);

        expect(screen.queryByText(notInStockText)).not.toBeInTheDocument()
        expect(screen.queryByTestId("tint-overlay")).not.toBeInTheDocument()
    });

    it("calls addToCart action when 'add' button is clicked", () => {
        render(<Item {...mockProduct} />);

        fireEvent.click(screen.getByText(addToCartText))
        expect(mockDispatch).toHaveBeenCalledWith(addToCart(mockProduct))
    });
})
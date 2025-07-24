import { fireEvent, render, screen } from "@testing-library/react";
import { useDispatch } from "react-redux";

import { addToCart, removeFromCart, removeOneUnit } from "@/redux/features/cartSlice";

import { CartProductCard } from "@/components/CartProductCard/CartProductCard";

import { mockCartProduct } from "@/__tests__/mocks/product";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

describe("CartProductCard (Unit)", () => {
    let mockDispatch: jest.Mock;

    beforeEach(() => {
        mockDispatch = jest.fn();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders product image and title", () => {
        const expectedProductPrice = mockCartProduct.product.price * mockCartProduct.quantity;

        render(<CartProductCard {...mockCartProduct} />);

        expect(screen.getByText("Test Product")).toBeInTheDocument();
        expect(screen.getByText(`${expectedProductPrice}грн.`)).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            `${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${mockCartProduct.product.image}`
        );
    });

    it("calls addToCart action when + button is clicked", () => {
        render(<CartProductCard {...mockCartProduct} />);

        fireEvent.click(screen.getByText("+"));
        expect(mockDispatch).toHaveBeenCalledWith(addToCart(mockCartProduct.product));
    })

    it("calls removeOneUnit action when - button is clicked", () => {
        render(<CartProductCard {...mockCartProduct} />);

        fireEvent.click(screen.getByText("-"));
        expect(mockDispatch).toHaveBeenCalledWith(removeOneUnit(mockCartProduct.product.id));
    })

    it("calls removeFromCart action when remove button is clicked", () => {
        render(<CartProductCard {...mockCartProduct} />);

        fireEvent.click(screen.getByTestId("removeProduct"));
        expect(mockDispatch).toHaveBeenCalledWith(removeFromCart(mockCartProduct.product.id));
    })
});

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit"
import { fireEvent, render, screen } from "@testing-library/react";

import cartReducer from "@/redux/features/cartSlice"

import { CartProductCard } from "@/components/CartProductCard/CartProductCard";

import { mockCartProduct } from "@/__tests__/mocks/product";

describe("CartProductCard (Integration)", () => {
    let store: ReturnType<typeof configureStore>

    beforeEach(() => {
        store = configureStore({
            reducer: { cart: cartReducer },
            preloadedState: {
                cart: {
                    cartProducts: [mockCartProduct],
                    isOpened: false
                }
            }
        })
    })

    it("decrements product quantity in Redux state when '-' is clicked", () => {
        render(
            <Provider store={store}>
                <CartProductCard {...mockCartProduct} />
            </Provider>
        )

        fireEvent.click(screen.getByText('-'))
        const cartProducts = store.getState().cart.cartProducts
        const newProductQuantity = cartProducts.find(obj => obj.product.id === mockCartProduct.product.id).quantity

        expect(newProductQuantity).toBe(mockCartProduct.quantity - 1)
    })

    it("removes the product if its quantity is 1 from Redux state when '-' is clicked", () => {
        render(
            <Provider store={store}>
                <CartProductCard {...mockCartProduct} />
            </Provider>
        )

        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('-'))
        const cartProducts = store.getState().cart.cartProducts

        expect(cartProducts).not.toContain(mockCartProduct)
    })

    it("increments product quantity in Redux state when '+' is clicked", () => {
        render(
            <Provider store={store}>
                <CartProductCard {...mockCartProduct} />
            </Provider>
        )

        fireEvent.click(screen.getByText('+'))
        const cartProducts = store.getState().cart.cartProducts
        const newProductQuantity = cartProducts.find(obj => obj.product.id === mockCartProduct.product.id).quantity

        expect(newProductQuantity).toBe(mockCartProduct.quantity + 1)
    })

    it("removes the product from Redux state when remove button is clicked", () => {
        render(
            <Provider store={store}>
                <CartProductCard {...mockCartProduct} />
            </Provider>
        )

        fireEvent.click(screen.getByTestId("removeProduct"))
        const cartProducts = store.getState().cart.cartProducts

        expect(cartProducts).not.toContain(mockCartProduct)
    })
})
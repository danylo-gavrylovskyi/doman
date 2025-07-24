import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit"
import { fireEvent, render, screen } from "@testing-library/react";

import cartReducer from "@/redux/features/cartSlice"

import { Item } from "@/components/Item/Item";

import { mockCartProduct, mockProduct } from "@/__tests__/mocks/product";

describe("Item (Integration)", () => {
    const addToCartText = "Додати"

    let store: ReturnType<typeof configureStore>
    beforeEach(() => {
        store = configureStore({
            reducer: { cart: cartReducer },
        })
    })

    it("adds product to Redux state when 'add' button is clicked", () => {
        render(
            <Provider store={store}>
                <Item {...mockProduct} />
            </Provider>
        )

        fireEvent.click(screen.getByText(addToCartText))
        const cartProducts = store.getState().cart.cartProducts
        const newProduct = cartProducts.find(obj => obj.product.id === mockCartProduct.product.id)

        expect(newProduct).toBeTruthy()
        expect(cartProducts[0].quantity).toBe(1)
    })
})
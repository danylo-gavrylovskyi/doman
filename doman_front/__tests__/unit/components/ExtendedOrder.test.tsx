import { render, screen } from "@testing-library/react"

import { ExtendedOrder } from "@/components/Order/ExtendedOrder"

import { mockExtendedOrderProps } from "@/__tests__/mocks/orderProps"

describe("ExtendedOrder (Unit)", () => {
    it("renders order details correctly", () => {
        render(<ExtendedOrder {...mockExtendedOrderProps} />)

        const { firstName, lastName, phoneNumber, email } = mockExtendedOrderProps.customer
        const pathToImage = `${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/`

        expect(screen.getByText(`№ ${mockExtendedOrderProps.orderId}`)).toBeInTheDocument()
        expect(screen.getByText(`від ${mockExtendedOrderProps.createdAt}`)).toBeInTheDocument()
        expect(screen.getByText(`${mockExtendedOrderProps.totalPrice}`)).toBeInTheDocument()
        expect(screen.getByText("Отримувач замовлення")).toBeInTheDocument()
        expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument()
        expect(screen.getByText(phoneNumber)).toBeInTheDocument()
        expect(screen.getByText(email)).toBeInTheDocument()
        mockExtendedOrderProps.orderProducts.forEach((orderProduct, i) => {
            const image = screen.getAllByRole("img")[i];
            expect(image).toHaveAttribute("src", `${pathToImage}${orderProduct.product.image}`)
            expect(image).toHaveAttribute("alt", orderProduct.product.slug)
            expect(screen.getByText(orderProduct.product.title)).toBeInTheDocument()
            expect(screen.getByText(`${orderProduct.product.price}₴ x ${orderProduct.quantity} од.`)).toBeInTheDocument()
            expect(screen.getByText(`${orderProduct.quantity * orderProduct.product.price} ₴`)).toBeInTheDocument()
        });
    })

    it("matches snapshot", () => {
        const { asFragment } = render(<ExtendedOrder {...mockExtendedOrderProps} />)
        expect(asFragment()).toMatchSnapshot()
    })
})
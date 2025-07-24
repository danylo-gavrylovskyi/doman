import { Order } from "@/components/Order/Order"
import { mockOrderProps } from "@/__tests__/mocks/orderProps"
import { render, screen } from "@testing-library/react"

describe("Order (Unit)", () => {
    it("renders order details correctly", () => {
        render(<Order {...mockOrderProps} />)

        const pathToImage = `${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/`

        expect(screen.getByText(`№ ${mockOrderProps.orderId}`)).toBeInTheDocument()
        expect(screen.getByText(`від ${mockOrderProps.createdAt}`)).toBeInTheDocument()
        expect(screen.getByText(`${mockOrderProps.totalPrice} ₴`)).toBeInTheDocument()
        mockOrderProps.orderProducts.forEach((orderProduct, i) => {
            const image = screen.getAllByRole("img")[i]
            expect(image).toHaveAttribute("src", `${pathToImage}${orderProduct.product.image}`)
            expect(image).toHaveAttribute("alt", orderProduct.product.slug)
        });
    })

    it("matches snapshot", () => {
        const { asFragment } = render(<Order {...mockOrderProps} />)
        expect(asFragment()).toMatchSnapshot()
    })
})
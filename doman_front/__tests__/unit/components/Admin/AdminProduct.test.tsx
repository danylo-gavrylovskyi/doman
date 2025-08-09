import { render, screen, fireEvent } from "@testing-library/react";

import { AdminProduct } from "@/components/Admin/AdminProduct/AdminProduct";

import { useDeleteProduct } from "@/hooks/products.hooks";
import { useGetSubcategories } from "@/hooks/subcategories.hooks";

import { mockProduct } from "@/__tests__/mocks/product";
import { mockSubcategory } from "@/__tests__/mocks/category";

jest.mock("@/hooks/products.hooks", () => ({
    useDeleteProduct: jest.fn(),
}));

jest.mock("@/hooks/subcategories.hooks", () => ({
    useGetSubcategories: jest.fn(),
}));

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe("AdminProduct (Unit)", () => {
    const LABELS = {
        TITLE: "Назва",
        ARTICLE: "Артикул",
        QUANTITY: "Кількість",
        PRICE: "Ціна",
        SUBCATEGORY: "Підкатегорія",
        EDIT: "Змінити",
        DELETE: "Видалити",
    } as const;
    const UNITS = {
        QUANTITY: "шт.",
        PRICE: "грн",
    } as const;

    const mockDeleteProduct = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = "http://test-api";

        (useDeleteProduct as jest.Mock).mockReturnValue(mockDeleteProduct);
        (useGetSubcategories as jest.Mock).mockReturnValue({
            data: [mockSubcategory],
        });
    });

    describe("Product rendering", () => {
        it("renders product with correct image URL", () => {
            render(<AdminProduct {...mockProduct} />);

            const image = screen.getByRole("img");
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute("src", `${process.env.NEXT_PUBLIC_API_URL}/uploads/productsImages/${mockProduct.image}`);
        });

        it("renders all product information", () => {
            render(<AdminProduct {...mockProduct} />);

            expect(screen.getByText(`${LABELS.TITLE}: ${mockProduct.title}`)).toBeInTheDocument();
            expect(screen.getByText(`${LABELS.ARTICLE}: ${mockProduct.article}`)).toBeInTheDocument();
            expect(screen.getByText(`${LABELS.QUANTITY}: ${mockProduct.quantity}${UNITS.QUANTITY}`)).toBeInTheDocument();
            expect(screen.getByText(`${LABELS.PRICE}: ${mockProduct.price}${UNITS.PRICE}`)).toBeInTheDocument();
            expect(screen.getByText(`${LABELS.SUBCATEGORY}: ${mockSubcategory.title}`)).toBeInTheDocument();
        });

        it("renders edit and delete buttons", () => {
            render(<AdminProduct {...mockProduct} />);

            expect(screen.getByText(LABELS.EDIT)).toBeInTheDocument();
            expect(screen.getByText(LABELS.DELETE)).toBeInTheDocument();
        });

        it("renders edit button with correct link", () => {
            render(<AdminProduct {...mockProduct} />);

            const editLink = screen.getByText(LABELS.EDIT).closest("a");
            expect(editLink).toHaveAttribute("href", `/admin/products/${mockProduct.id}`);
        });
    });

    describe("Delete functionality", () => {
        it("calls deleteProduct with correct id when delete button is clicked", () => {
            render(<AdminProduct {...mockProduct} />);

            fireEvent.click(screen.getByText(LABELS.DELETE));

            expect(mockDeleteProduct).toHaveBeenCalledTimes(1);
            expect(mockDeleteProduct).toHaveBeenCalledWith(mockProduct.id);
        });
    });

    describe("Subcategory handling", () => {
        it("displays subcategory title when found", () => {
            render(<AdminProduct {...mockProduct} />);

            expect(screen.getByText(`${LABELS.SUBCATEGORY}: ${mockSubcategory.title}`)).toBeInTheDocument();
        });
    });
}); 
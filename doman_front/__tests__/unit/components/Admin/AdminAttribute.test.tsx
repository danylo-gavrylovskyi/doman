import { render, screen, fireEvent } from "@testing-library/react";

import { AdminAttribute } from "@/components/Admin/AdminAttribute/AdminAttribute";

describe("AdminAttribute (Unit)", () => {
    const mockAdminAttributeProps = {
        id: 1,
        title: "Test Attribute",
        attributeId: 42,
        attributeValue: "Test Value",
        deleteAttribute: jest.fn(),
    };
    const deleteButtonText = "Видалити"

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders with correct title", () => {
        render(<AdminAttribute {...mockAdminAttributeProps} />);

        expect(screen.getByText(mockAdminAttributeProps.title)).toBeInTheDocument();
    });

    it("renders delete button", () => {
        render(<AdminAttribute {...mockAdminAttributeProps} />);

        const deleteButton = screen.getByText(deleteButtonText);
        expect(deleteButton).toBeInTheDocument();
    });

    it("calls deleteAttribute with correct id when delete button is clicked", () => {
        render(<AdminAttribute {...mockAdminAttributeProps} />);

        const deleteButton = screen.getByText(deleteButtonText);
        fireEvent.click(deleteButton);

        expect(mockAdminAttributeProps.deleteAttribute).toHaveBeenCalledTimes(1);
        expect(mockAdminAttributeProps.deleteAttribute).toHaveBeenCalledWith(mockAdminAttributeProps.id);
    });
}); 
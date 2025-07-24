import { render, screen, fireEvent } from "@testing-library/react";

import { AdminBanner } from "@/components/Admin/AdminBanner/AdminBanner";

describe("AdminBanner (Unit)", () => {
    const mockAdminBannerProps = {
        bannerUrl: "test-banner.jpg",
        deleteBanner: jest.fn(),
    };
    const deleteButtonText = "Видалити";

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = "http://test-api";
    });

    it("renders banner image with correct URL", () => {
        render(<AdminBanner {...mockAdminBannerProps} />);

        const image = screen.getByRole("img");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", `${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${mockAdminBannerProps.bannerUrl}`);
    });

    it("renders delete button", () => {
        render(<AdminBanner {...mockAdminBannerProps} />);

        const deleteButton = screen.getByText(deleteButtonText);
        expect(deleteButton).toBeInTheDocument();
    });

    it("calls deleteBanner with correct bannerUrl when delete button is clicked", () => {
        render(<AdminBanner {...mockAdminBannerProps} />);

        const deleteButton = screen.getByText(deleteButtonText);
        fireEvent.click(deleteButton);

        expect(mockAdminBannerProps.deleteBanner).toHaveBeenCalledTimes(1);
        expect(mockAdminBannerProps.deleteBanner).toHaveBeenCalledWith(mockAdminBannerProps.bannerUrl);
    });
}); 
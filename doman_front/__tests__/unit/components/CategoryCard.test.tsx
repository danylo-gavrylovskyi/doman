import { render, screen } from "@testing-library/react"

import { CategoryCard } from "@/components/CategoryCard/CategoryCard"

describe('CategoryCard', () => {
    const categoryProps = {
        title: 'some category',
        slug: 'some-category',
        image: 'some-image.jpg'
    }
    const categoryFolder = 'categoriesImages'
    const subcategoryFolder = 'subcategoriesImages'

    it('renders provided category properties correct', () => {
        render(<CategoryCard {...categoryProps} imageFolder={categoryFolder} />)

        expect(screen.getByText(categoryProps.title)).toBeInTheDocument()
        expect(screen.getByRole('img')).toHaveAttribute('src', `${process.env.NEXT_PUBLIC_API_URL}/uploads/${categoryFolder}/${categoryProps.image}`)
        expect(screen.getByRole('link')).toHaveAttribute('href', `/categories/${categoryProps.slug}`)
    })

    it('renders provided subcategory properties correct', () => {
        render(<CategoryCard {...categoryProps} imageFolder={subcategoryFolder} />)

        expect(screen.getByText(categoryProps.title)).toBeInTheDocument()
        expect(screen.getByRole('img')).toHaveAttribute('src', `${process.env.NEXT_PUBLIC_API_URL}/uploads/${subcategoryFolder}/${categoryProps.image}`)
        expect(screen.getByRole('link')).toHaveAttribute('href', `/subcategories/${categoryProps.slug}`)
    })
})
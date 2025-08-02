import React from "react"

import styles from "./admin-header.module.scss"
import Link from "next/link"
import { PerPageSelector } from "@/components/PerPageSelector/PerPageSelector"

interface AdminHeaderProps {
    addBtnText: string
    perPage: number
    entityName: string
    children?: React.ReactNode
}

export const AdminHeader = ({ addBtnText, perPage, entityName, children }: AdminHeaderProps) => {
    return (
        <header className={styles.header}>
            <Link href={`/admin/${entityName}/new`}>
                <button>{addBtnText}</button>
            </Link>

            <PerPageSelector perPage={perPage} />

            {children}
        </header>
    )
}

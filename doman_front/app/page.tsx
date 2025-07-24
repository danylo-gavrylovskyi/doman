import React from "react";

import { AutoplaySlider } from "../modules/AutoplaySlider/AutoplaySlider";
import { Categories } from "../modules/Categories/Categories";
import { PopularItems } from "../modules/PopularItems/PopularItems";

import { CategoriesService } from "@/services/categories.service";

import { BannersService } from "@/services/banners.service";

import styles from "./page.module.scss";

const Home = async () => {
	const categories = await CategoriesService.getAll();
	const banners = await BannersService.getAll();

	return (
		<div>
			<div className={styles.container}>
				<AutoplaySlider banners={banners} />
				<PopularItems />
				<Categories categories={categories} />
			</div>
		</div>
	);
};

export default Home;

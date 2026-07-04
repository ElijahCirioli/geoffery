import { Anton } from "next/font/google";
import Category from "@/lib/models/trivia/Category";
import styles from "./DisplayCategory.module.css";

interface DisplayCategoryProps {
	category: Category;
	pointValues: number[];
	isQuestionAvailable: boolean[];
}

const anton = Anton({ weight: "400" });

const DisplayCategory: React.FC<DisplayCategoryProps> = ({
	category,
	pointValues,
	isQuestionAvailable,
}: DisplayCategoryProps) => {
	return (
		<div className={styles.category}>
			<div className={styles.tile}>
				<h1 className={anton.className}>{category.title}</h1>
			</div>
			{pointValues.map((pointValue, i) => (
				<div className={styles.tile} key={i}>
					{isQuestionAvailable[i] && <h2 className={anton.className}>{`$${pointValue}`}</h2>}
				</div>
			))}
		</div>
	);
};

export default DisplayCategory;

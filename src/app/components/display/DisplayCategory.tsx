"use client";

import { Anton } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
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
	// State for measuring the text width in order to shrink it programatically
	const wrappingRef = useRef<HTMLDivElement | null>(null);
	const measuringRef = useRef<HTMLHeadingElement | null>(null);
	const smallMeasuringRef = useRef<HTMLHeadingElement | null>(null);
	const [width, setWidth] = useState(0);
	const [textWidth, setTextWidth] = useState(0);
	const [smallTextWidth, setSmallTextWidth] = useState(0);

	function recalculateTextSize() {
		if (measuringRef.current && wrappingRef.current && smallMeasuringRef.current) {
			setWidth(wrappingRef.current.offsetWidth);
			setTextWidth(measuringRef.current.offsetWidth);
			setSmallTextWidth(smallMeasuringRef.current.offsetWidth);
		}
	}

	useEffect(() => {
		recalculateTextSize();

		window.addEventListener("resize", recalculateTextSize);
		return () => {
			window.removeEventListener("resize", recalculateTextSize);
		};
	}, [category.title]);

	const titleClasses = [anton.className];
	if (textWidth > width) {
		titleClasses.push(styles.smallTitle);
	}
	if (smallTextWidth > width) {
		titleClasses.push(styles.extraSmallTitle);
	}

	return (
		<div className={styles.category}>
			<div className={styles.tile} ref={wrappingRef}>
				<h1 className={`${anton.className} ${styles.measuringText}`} ref={measuringRef}>
					{category.title}
				</h1>
				<h1
					className={`${anton.className} ${styles.measuringText} ${styles.smallTitle}`}
					ref={smallMeasuringRef}
				>
					{category.title}
				</h1>
				<h1 className={titleClasses.join(" ")}>{category.title}</h1>
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

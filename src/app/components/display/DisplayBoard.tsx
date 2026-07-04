import { StandardRound } from "@/lib/models/trivia/Round";
import DisplayCategory from "./DisplayCategory";
import styles from "./DisplayBoard.module.css";

interface DisplayBoardProps {
	round: StandardRound;
}

const DisplayBoard: React.FC<DisplayBoardProps> = ({ round }: DisplayBoardProps) => {
	return (
		<div id={styles.board}>
			{round.categories.map((category, i) => (
				<DisplayCategory
					category={category}
					pointValues={round.pointValues}
					isQuestionAvailable={round.pointValues.map(() => true)}
					key={i}
				/>
			))}
		</div>
	);
};

export default DisplayBoard;

import React from 'react';

interface OptionButtonProps {
		option: string;
		isSelected: boolean;
		isCorrect: boolean;
		isLocked: boolean;
		onClick: () => void;
		showFeedback: boolean;
		theme?: string | number;
}

const OptionButton: React.FC<OptionButtonProps> = ({
	option,
	isSelected,
	isCorrect,
	isLocked,
	onClick,
	showFeedback,
	theme,
}) => {
		const base = 'w-full py-3 px-6 rounded-full text-base font-semibold transition-all duration-200 cursor-pointer border';
		const hover = 'hover:bg-gray-100';
		let selected = '';
		let feedback = '';
		let textColor = 'text-gray-800';
		let borderColor = 'border-gray-300';
		// Always fill correct option with green when locked, fill selected wrong with red
		if (showFeedback && isLocked) {
			if (isCorrect) {
				feedback = 'bg-green-200';
				textColor = 'text-green-800';
				borderColor = 'border-green-400';
			} else if (isSelected && !isCorrect) {
				feedback = 'bg-red-200';
				textColor = 'text-red-800';
				borderColor = 'border-red-400';
			}
		} else if (isSelected) {
			selected = 'bg-blue-50';
			textColor = 'text-blue-700';
			borderColor = 'border-blue-400';
		}
		const classes = `${base} ${hover} ${selected} ${feedback} ${textColor} ${borderColor} flex items-center gap-4 w-full`;

				// Always show A/B/C/D in the pill based on index
				const labels = ['A', 'B', 'C', 'D'];
					// Remove only the label and separator (A), A., A ) etc.)
						// Only remove label if followed by separator (A), A., A:, A-) but NOT just a space
				const text = option.replace(/^([A-Da-d])\s*[).:,-]\s*/, '');
				const idx = typeof theme === 'number' ? theme : undefined;
				const displayLabel = labels[idx ?? 0];

				return (
					<button
						className={classes}
						disabled={isLocked}
						onClick={onClick}
						aria-label={`Select option ${displayLabel}`}
						style={{ minHeight: '56px', width: '100%', padding: 0 }}
					>
						<span
							className="flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 rounded-full bg-gray-100 border border-gray-300 font-bold text-lg"
							style={{ flexShrink: 0, marginRight: '0.75rem' }}
						>
							{displayLabel}
						</span>
						<span className="flex-1 text-left break-words text-base font-semibold text-gray-800" style={{paddingLeft: 0}}>
							{text}
						</span>
					</button>
				);
};

export default OptionButton;

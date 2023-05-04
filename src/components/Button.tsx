type ButtonType = {
	type: 'button' | 'submit' | 'reset' | undefined;
};

interface ButtonProps extends ButtonType {
	children: string;
	onClick?: () => void;
	disabled?: boolean;
	className: string;
}

export const Button = ({
	children,
	type,
	onClick,
	disabled,
	className,
}: ButtonProps) => {
	return (
		<button
			className={className}
			type={type}
			onClick={onClick}
			disabled={disabled}>
			{children}
		</button>
	);
};

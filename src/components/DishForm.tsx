import { FormEventHandler, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';
import { Button } from './Button';

enum DishType {
	PIZZA = 'pizza',
	SOUP = 'soup',
	SANDWICH = 'sandwich',
}

type CreateDishResponse = {
	name: string;
	preparation_time: string;
	type: string;
	no_of_slices: number | undefined;
	diameter: number | undefined;
	spiciness_scale: number | undefined;
	slices_of_bread: number | undefined;
};

interface DishFormProps {
	handleSubmit: (e: any) => FormEventHandler<HTMLFormElement> | undefined;
	reset: () => void;
	submitting: boolean;
}

const DishForm = ({ handleSubmit, reset, submitting }: DishFormProps) => {
	const [showPizzaFields, setShowPizzaFields] = useState(false);
	const [showSpicinessField, setShowSpicinessField] = useState(false);
	const [showBreadField, setShowBreadField] = useState(false);

	const onCreateDish = async (values: CreateDishResponse) => {
		const {
			name,
			preparation_time,
			type,
			no_of_slices,
			diameter,
			spiciness_scale,
			slices_of_bread,
		} = values;

		const payload: CreateDishResponse = {
			name,
			preparation_time,
			type,
			no_of_slices: no_of_slices || undefined,
			diameter: diameter || undefined,
			spiciness_scale: spiciness_scale || undefined,
			slices_of_bread: slices_of_bread || undefined,
		};

		try {
			await axios.post<CreateDishResponse>(
				'https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/',
				JSON.stringify(payload),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			alert(`Sending data...`);
		} catch (error) {
			alert(`Failed to create dish: ${error}`);
		}
	};

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const type = e.target.value as DishType;

		setShowPizzaFields(type === DishType.PIZZA);
		setShowSpicinessField(type === DishType.SOUP);
		setShowBreadField(type === DishType.SANDWICH);
	};

	return (
		<form onSubmit={handleSubmit(onCreateDish)} className='form'>
			<div>
				<Field
					className='input'
					name='name'
					component='input'
					type='text'
					placeholder='Dish name'
					required
				/>
			</div>
			<div>
				<Field
					className='input'
					name='preparation_time'
					component='input'
					type='text'
					pattern='^([0-9][0-9]):([0-5][0-9]):([0-5][0-9])$'
					placeholder='Preparation time: 00:00:00'
					required
				/>
			</div>
			<div>
				<Field
					className='input narrow-input'
					name='type'
					component='select'
					onChange={handleTypeChange}
					required>
					<option value='' disabled>
						--Select--
					</option>
					<option value={DishType.PIZZA}>Pizza</option>
					<option value={DishType.SOUP}>Soup</option>
					<option value={DishType.SANDWICH}>Sandwich</option>
				</Field>
			</div>
			{showPizzaFields && (
				<div>
					<div>
						<Field
							className='input'
							name='no_of_slices'
							component='input'
							type='number'
							min={1}
							placeholder='Number of slices'
							required
						/>
					</div>

					<div>
						<Field
							className='input'
							name='diameter'
							component='input'
							type='number'
							min={20}
							step={0.1}
							placeholder='Diameter'
							required
						/>
					</div>
				</div>
			)}
			{showSpicinessField && (
				<div>
					<Field
						className='input narrow-input'
						name='spiciness_scale'
						component='input'
						type='number'
						min={1}
						max={10}
						placeholder='Spiciness scale (1-10)'
						required
					/>
				</div>
			)}
			{showBreadField && (
				<div>
					<Field
						className='input'
						name='slices_of_bread'
						component='input'
						type='number'
						min={2}
						placeholder='Slices of bread'
						required
					/>
				</div>
			)}
			<Button className='button submit' type='submit' disabled={submitting}>
				Submit
			</Button>
			<Button className='button reset' type='button' onClick={reset}>
				Reset
			</Button>
		</form>
	);
};

export default reduxForm({
	form: 'hex-form',
})(DishForm);

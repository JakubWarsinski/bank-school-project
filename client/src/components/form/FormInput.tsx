import React, { InputHTMLAttributes } from 'react';

type FormInputProps = {
	label?: string;
	error?: string;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	id?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({
	label,
	error,
	className = '',
	inputClassName = '',
	labelClassName = '',
	type = 'text',
	name,
	id,
	...props
}: FormInputProps) {
	const baseInputClass = 'w-full rounded-md border px-3 py-2 text-sm outline-none transition';

	const normalState = 'border-gray-300 focus:border-blue-500';

	const errorState = 'border-red-500';

	return (
		<div className='space-y-1'>
			{label && (
				<label htmlFor={id || name} className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
					{label}
				</label>
			)}

			<input
				id={id || name}
				name={name}
				type={type}
				className={`${baseInputClass} ${error ? errorState : normalState} ${inputClassName} ${className}`}
				{...props}
			/>

			{error && <span className='text-xs text-red-500'>{error}</span>}
		</div>
	);
}

import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { useState, useRef, useEffect } from 'react';
import { Text } from '../text';
import { Select } from '../select';
import { RadioGroup } from '../radio-group';
import { Separator } from '../separator';
import { fontFamilyOptions, 
	fontSizeOptions, 
	fontColors, 
	backgroundColors, 
	contentWidthArr, 
	defaultArticleState, 
	ArticleStateType} from 'src/constants/articleProps';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

export type ArticleParamsFormProps = {
	newArticleStateType: (newSettings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ newArticleStateType }: ArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [formState, setFormState] = useState(defaultArticleState);
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setIsSidebarOpen(false);
			}
		};

		if (isSidebarOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSidebarOpen, rootRef]);

	const handleOptionChange = (key: string) => (value: any) => {
        setFormState({
            ...formState,
            [key]: value,
        });
    };

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
		newArticleStateType(formState);
        // Применить новые стили к статье
    };

    const handleReset = () => {
        setFormState(defaultArticleState);
		newArticleStateType(defaultArticleState);
        // Применить начальные стили к статье
    };

	return (
		<div ref={rootRef}>
			<ArrowButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} isOpen={isSidebarOpen}/>
			<aside className={clsx(styles.container, isSidebarOpen && styles.container_open)}>
				<form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title="Шрифт"
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={handleOptionChange('fontFamilyOption')}
					/>
					<RadioGroup
						name="Размер шрифта"
						title="Размер шрифта"
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleOptionChange('fontSizeOption')}
					/>
					<Select
						title="Цвет шрифта"
						options={fontColors}
						selected={formState.fontColor}
						onChange={handleOptionChange('fontColor')}
					/>
					<Separator />
					<Select
						title="Цвет фона"
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={handleOptionChange('backgroundColor')}
					/>
					<Select
						title="Ширина контента"
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={handleOptionChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</div>
	);
};

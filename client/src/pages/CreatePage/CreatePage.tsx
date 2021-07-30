import React, { useEffect } from 'react'
import cn from 'classnames';
import { each } from 'lodash';
import { useAnswers } from '../../core/hooks/useCreatePage';
import { usePrevious } from '../../core/hooks/usePrevious';

export const CreatePage = () => {
    const [
        createAnswer,
        onChangeAnswer,
        answers,
        question,
        onChangeQuestion,
        createPoll,
        pressedOnCreatePoll,
    ] = useAnswers();
    const [prevAnswers] = usePrevious(answers);

    useEffect(() => {
        if (!prevAnswers) {
            each(
                answers,
                (answer, index) => {
                    const elem = document.querySelector(`#answer-${index}`);

                    if (elem) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const counter = new M.CharacterCounter(elem);
                    }
                },
            );

            return;
        }

        /**
         * Initializing character counter for a new inputs
         */
        if (prevAnswers.length !== answers.length) {
            for (let i = prevAnswers.length; i < answers.length; i++) {
                const elem = document.querySelector(`#answer-${i}`);

                if (elem) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const counter = new M.CharacterCounter(elem);
                }
            }
        }
    }, [answers, prevAnswers]);
    useEffect(() => {
        const elem = document.querySelector('#question');

        if (elem) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const counter1 = new M.CharacterCounter(elem);
        }
    }, []);

    return (
        <div className="row">
            <div className="col s12">
                <h3>Create a new poll:</h3>
                <div className="input-field col s12">
                    <input
                        id="question"
                        className={cn([question.length < 3 && pressedOnCreatePoll && 'invalid'])}
                        type="text"
                        value={question}
                        onChange={onChangeQuestion}
                        autoComplete="off"
                        data-length="100"
                    />
                    <label htmlFor="question">Question</label>
                </div>
                {answers.map(
                    (answer, index) => (
                        <div
                            key={index}
                            className="input-field col s8"
                        >
                            <input
                                id={`answer-${index}`}
                                className={cn([answer.length === 0 && pressedOnCreatePoll && 'invalid'])}
                                type="text"
                                data-length="100"
                                value={answer}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeAnswer(event, index)}
                                autoComplete="off"
                            />
                            <label
                                htmlFor={`answer-${index}`}
                            >
                                {`Answer ${index + 1}`}
                            </label>
                        </div>
                    ),
                )}
                <div className="input-field col s8">
                    <button
                        className="btn waves-effect waves-light"
                        name="add"
                        type="button"
                        onClick={createAnswer}
                        data-cy="add-answer-btn"
                    >
                        <i className="material-icons">add</i>
                    </button>
                </div>
                <div className="input-field col s8">
                    <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="Start"
                        onClick={createPoll}
                        data-cy="create-poll-btn"
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    )
}

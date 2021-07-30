import { each } from 'lodash';
import { useContext, useCallback, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { post } from '../api/fetch';
import { useMessage } from './useMessage';

interface IWithResponse<T> {
    data: T;
    message: string;
}

interface IPollData {
    id: string;
}

/**
 * Hook that managing process of creating a new poll. \
 * Used at component **CreatePage**
 */
export const useAnswers = () => {
    const { token } = useContext(AuthContext);
    const history = useHistory();
    const message = useMessage();
    const [question, setQuestion] = useState<string>('');
    const [pressedOnCreatePoll, setPressedOnCreatePoll] = useState<boolean>(false);
    const onChangeQuestion = (event: React.ChangeEvent<HTMLInputElement>) => setQuestion(event.target.value);

    const [answers, setAnswers] = useState<string[]>(['', '']);

    const onChangeAnswer = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
            setAnswers(
                answers
                    .slice(0, index)
                    .concat([event.target.value]
                        .concat(answers.slice(index + 1))),
            )
        },
        [answers],
    );

    const createAnswer = () => setAnswers([
        ...answers,
        '',
    ]);

    /**
     * Provides validation for all fields
     */
    const isPollValid = () => {
        if (question.length === 0) {
            message('Question field cannot be empty.');

            return false;
        }

        if (question.length < 3) {
            message('Question field should contain at least 3 characters.');

            return false;
        }

        if (question.length > 100) {
            message('Question field should contain maximum 100 characters.');

            return false;
        }

        let answersNotEmpty = true;
        let answersNotLong = true;

        each(
            answers,
            (answer) => {
                if (answer.length === 0) {
                    answersNotEmpty = false;
                }

                if (answer.length > 100) {
                    answersNotLong = false;
                }
            },
        );

        if (!answersNotEmpty) {
            message('Answer field cannot be empty.');
        }

        if (!answersNotLong) {
            message('Answer field should contain maximum 100 characters.');
        }

        return answersNotEmpty && answersNotLong;
    }
    const createPoll = async () => {
        setPressedOnCreatePoll(true);
        if (isPollValid()) {
            const dataToSend = {
                subject: question,
                options: answers,
            }

            try {
                const result = await post<IWithResponse<IPollData>>(
                    'api/poll/create',
                    token || '',
                    dataToSend,
                );
                const { data } = result;

                if (data) {
                    history.push(`/poll/view/${data.id}`)
                }
            } catch (e) {
                if (e instanceof Error) {
                    message(e.message);
                }
            }
        }
    }

    return [createAnswer, onChangeAnswer, answers, question, onChangeQuestion, createPoll, pressedOnCreatePoll] as const;
}

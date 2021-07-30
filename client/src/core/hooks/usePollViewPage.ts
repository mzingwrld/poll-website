import some from 'lodash/some';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { get, post } from '../api/fetch';
import { useMessage } from './useMessage';

interface IWithResponse<T> {
    data: T;
    message: string;
}

interface IPollsListData {
    answers: IAnswerData[];
    poll: IPollData
}

interface IAnswersForAPollData {
    answers: IAnswerData[];
}

interface IPollData {
    subject: string;
    _id: string;
    options: string[];
    user_id: string;
}

interface IAnswerData {
    answer: number;
    poll_id: string;
    user_id: string;
    name: string;
    _id: string;
}

/**
 * Hook that provides above functionality:
 * - Fetch data for a view of a poll with answers
 * - Refresh data of answers
 * - Validation of possibility to vote
 * - Sends vote result to backend
 */
export const usePollViewPage = () => {
    const { token, userId } = useContext(AuthContext);
    const message = useMessage();
    const [poll, setPoll] = useState<IPollData | null>(null);
    const [answers, setAnswers] = useState<IAnswerData[] | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [isPollAnswered, setIsPollAnswered] = useState<boolean>(false);
    const [pollPending, setPollPending] = useState<boolean>(false);
    const [answersPending, setAnswersPending] = useState<boolean>(false);
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<string[][]>([[]]);

    const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);

    const fetchPoll = async (pollId: string) => {
        setPollPending(true)
        try {
            const result = await get<IWithResponse<IPollsListData>>(
                `/api/poll/view/${pollId}`,
                token || '',
            );
            const { data } = result;
            if (data) {
                setPoll(data.poll);
                setAnswers(data.answers);
            }
        } catch (e) {
            if (e instanceof Error) {
                message(e.message);
            }
        } finally {
            setPollPending(false);
        }
    }

    const fetchAnswers = async (pollId: string) => {
        setAnswersPending(true);
        try {
            const result = await get<IWithResponse<IAnswersForAPollData>>(
                `/api/poll/answers/${pollId}`,
                token || '',
            );
            const { data } = result;
            if (data) {
                setAnswers(data.answers);
            }
        } catch (e) {
            if (e instanceof Error) {
                message(e.message);
            }
        } finally {
            setAnswersPending(false);
        }
    }

    useEffect(() => {
        if (answers
            && userId
            && some(answers, (answer) => answer.user_id === userId)
        ) {
            setIsPollAnswered(true);
        }
    }, [answers, userId]);

    useEffect(() => {
        if (poll
            && answers
        ) {
            setHeaders(['Name', ...poll.options]);

            setRows(
                answers.map((answer) => {
                    const arr: string[] = new Array<string>(poll.options.length + 1).fill('');
                    arr[0] = answer.name;
                    arr[answer.answer + 1] = 'X';

                    return arr;
                }),
            );
        }
    }, [poll, answers]);

    const onSelectOption = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.id);
    };

    /**
     * Checking that user provided all necessary data
     */
    const readyToSubmitAnswer = () => {
        if (name.length < 1 || name.length > 100) {
            return false;
        }

        if (!selectedOption) {
            return false;
        }

        return true;
    }

    const sendVoteResult = async () => {
        setPollPending(true);
        if (readyToSubmitAnswer()) {
            const dataToSend = {
                poll_id: poll?._id,
                answer: selectedOption,
                name,
            }

            try {
                const result = await post<IWithResponse<IPollData>>(
                    '/api/poll/vote',
                    token || '',
                    dataToSend,
                );
                const { data } = result;

                if (data) {
                    setIsPollAnswered(true);
                }
            } catch (e) {
                if (e instanceof Error) {
                    message(e.message);
                }
            } finally {
                setPollPending(false);
            }
        }
    }

    return [
        poll,
        fetchPoll,
        fetchAnswers,
        selectedOption,
        onSelectOption,
        name,
        onChangeName,
        readyToSubmitAnswer,
        isPollAnswered,
        sendVoteResult,
        pollPending,
        answersPending,
        headers,
        rows,
    ] as const;
}

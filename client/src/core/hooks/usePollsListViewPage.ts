import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { get } from '../api/fetch';
import { useMessage } from './useMessage';

interface IWithResponse<T> {
    data: T;
    message: string;
}

interface IPollsListData {
    subject: string;
    _id: string;
}

/**
 * Hook that managing output of polls that were created by a user
 */
export const usePollsListViewPage = () => {
    const { token } = useContext(AuthContext);
    const message = useMessage();
    const [polls, setPolls] = useState<IPollsListData[] | null>(null);

    const fetchPolls = async () => {
        try {
            const result = await get<IWithResponse<IPollsListData[]>>(
                'api/poll/list',
                token || '',
            );
            const { data } = result;
            if (data) {
                setPolls(data);
            }
        } catch (e) {
            if (e instanceof Error) {
                message(e.message);
            }
        }
    }

    return [polls, fetchPolls] as const;
}

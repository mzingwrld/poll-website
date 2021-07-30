import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Loader } from '../../components/Loader/Loader';
import { Locations } from '../../core/models/locations';
import { usePollsListViewPage } from '../../core/hooks/usePollsListViewPage';

export const PollsPage = () => {
    const history = useHistory();
    const [polls, fetchPolls] = usePollsListViewPage();

    useEffect(() => {
        fetchPolls();
    }, []);

    if (!polls) {
        return (
            <Loader />
        );
    }

    if (polls.length === 0) {
        return (
            <div className="row">
                <div className="col s12">
                    <h3>You have no created polls yet.</h3>
                    <h4>Do you want to create one?</h4>
                    <button
                        className="btn waves-effect waves-light"
                        type="button"
                        name="add"
                        onClick={() => history.push(Locations.CREATE_POLL)}
                        data-cy="poll-create-btn"
                    >
                        create
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col s12">
                <h3>Your polls:</h3>
                <table
                    className="responsive-table striped"
                >
                    <tbody>
                        {polls.map((poll, index) => (
                            <tr
                                key={index}
                                data-cy={`poll-${index}`}
                            >
                                <td>
                                    {poll.subject}
                                </td>
                                <td>
                                    <button
                                        className="btn waves-effect waves-light"
                                        name="add"
                                        type="button"
                                        onClick={() => history.push(`${Locations.VIEW_POLL}${poll._id}`)}
                                        data-cy={`poll-${index}-view-btn`}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

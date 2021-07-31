import React, { useContext, useEffect } from 'react';
import { useInstance } from 'react-ioc';
import { useHistory } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { ResultsTable } from '../../components/ResultsTable/ResultsTable';
import { AuthContext } from '../../context/AuthContext';
import { Locations } from '../../core/models/locations';
import WebSocketService, { IPollUpdatedInfo } from '../../core/services/websocket/WebSocketService';
import { useMessage } from '../../core/hooks/useMessage';
import { usePollViewPage } from '../../core/hooks/usePollViewPage';

export const PollViewPage = () => {
    const { token } = useContext(AuthContext);
    const message = useMessage();
    const history = useHistory();
    const { pathname } = history.location;
    const pollId = pathname.replace('/poll/view/', '');
    const { on: wsOn, off: wsOff } = useInstance(WebSocketService);

    const [
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
    ] = usePollViewPage();

    const handlePollUpdatedEvent = (data: IPollUpdatedInfo) => {
        if (data.poll_id === pollId) {
            fetchAnswers(pollId);
        }
    }

    useEffect(() => {
        fetchPoll(pollId);
        wsOn(token || '', handlePollUpdatedEvent);

        return () => {
            wsOff();
        }
    }, []);

    const handleCopyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        message('Link copied to clipboard');
    };

    useEffect(() => {
        const nameElem = document.querySelector('#name');

        if (nameElem) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const counter1 = new M.CharacterCounter(nameElem);
        }
    }, [poll]);

    if (!poll && !pollPending) {
        return (
            <div className="row">
                <div className="col s12">
                    <h3>This poll does not exist</h3>
                    <h4>Do you want to create poll?</h4>
                    <button
                        className="btn waves-effect waves-light"
                        type="button"
                        name="add"
                        onClick={() => history.push(Locations.CREATE_POLL)}
                        data-cy="create-btn"
                    >
                        create
                    </button>
                </div>
            </div>
        );
    }

    if (!poll) {
        return (
            <Loader />
        );
    }

    return (
        <div className="row">

            <div className="row valign-wrapper">
                <div className="col s10">
                    <h1>
                        {poll.subject}
                    </h1>
                </div>
                <div className="col s2">
                    <button
                        className="btn waves-effect waves-light"
                        type="button"
                        name="share"
                        onClick={handleCopyLinkToClipboard}
                        data-cy="share-btn"
                    >
                        <i className="material-icons">share</i>
                    </button>
                </div>
            </div>

            <div className="col s12">
                {!isPollAnswered && (
                    <>
                        <div className="input-field col s12">
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={onChangeName}
                                autoComplete="off"
                                data-length="100"
                            />
                            <label htmlFor="name">Your name</label>
                        </div>
                        {poll.options.map((option, index) => (
                            <p
                                key={index}
                            >
                                <label
                                    htmlFor={String(index)}
                                >
                                    <input
                                        name={`${poll._id}-${index}`}
                                        type="radio"
                                        value={option}
                                        id={String(index)}
                                        checked={selectedOption === String(index)}
                                        onChange={onSelectOption}
                                        data-cy={selectedOption === String(index) && `option-${index}-checked`}
                                    />
                                    <span
                                        data-cy={`option-${index}`}
                                    >
                                        {option}
                                    </span>
                                </label>

                            </p>
                        ))}
                        <button
                            className="btn waves-effect waves-light"
                            type="submit"
                            name="vote"
                            disabled={!readyToSubmitAnswer() || pollPending}
                            onClick={sendVoteResult}
                            data-cy="vote-btn"
                        >
                            submit
                        </button>
                    </>
                )}
                {isPollAnswered && (
                    <div
                        data-cy="already-answered-notification"
                    >
                        You already answered to this poll.
                    </div>
                )}
            </div>
            {answersPending && (
                <div className="col s12">
                    <Loader />
                </div>
            )}
            {!answersPending && (
                <ResultsTable
                    headers={headers}
                    rows={rows}
                />
            )}

        </div>
    )
}

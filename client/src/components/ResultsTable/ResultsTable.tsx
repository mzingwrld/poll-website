import React, { FunctionComponent } from 'react'

export interface ITableProps {
    headers: string[];
    rows: string[][];
}

export const ResultsTable: FunctionComponent<ITableProps> = ({ headers, rows }) => {
    if (rows.length === 0) {
        return (
            <div
                className="col s12"
                data-cy="no-results-table"
            >
                <h3>Results:</h3>
                <div>
                    This poll does not have answers yet.
                </div>
            </div>
        )
    }

    return (
        <div
            className="col s12"
            data-cy="results-table"
        >
            <h3>Results:</h3>
            <table
                className="responsive-table striped"
            >
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((rowParent, index) => (
                        <tr
                            key={index}
                        >
                            {rowParent.map((cell, _index) => (
                                <td
                                    key={_index}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

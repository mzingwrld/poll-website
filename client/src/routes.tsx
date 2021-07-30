import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { PollViewPage } from './pages/PollViewPage/PollViewPage'
import { PollsPage } from './pages/PollsPage/PollsPage'
import { CreatePage } from './pages/CreatePage/CreatePage'
import { Locations } from './core/models/locations'

export const useRoutes = () => (
    <Switch>
        <Route path={Locations.POLLS_LIST} exact>
            <PollsPage />
        </Route>
        <Route path={Locations.CREATE_POLL} exact>
            <CreatePage />
        </Route>
        <Route path={Locations.VIEW_POLL}>
            <PollViewPage />
        </Route>
        <Redirect to={Locations.CREATE_POLL} />
    </Switch>
)

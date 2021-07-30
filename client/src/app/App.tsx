import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from '../routes';
import { Loader } from '../components/Loader/Loader';
import { Navbar } from '../components/Navbar/Navbar';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../core/hooks/useAuth';

const App: FunctionComponent = (): JSX.Element => {
    const routes = useRoutes();
    const [isAuthenticated, token, userId] = useAuth();

    if (!isAuthenticated) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{
            token, userId, isAuthenticated,
        }}
        >
            <Router>
                <Navbar />
                <div className="container main-container">
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;

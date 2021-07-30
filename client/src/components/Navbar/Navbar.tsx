import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Locations } from '../../core/models/locations';
import './Navbar.css';

export const Navbar = () => {
    useEffect(() => {
        const elems = document.querySelectorAll('.sidenav');
        if (elems) {
            M.Sidenav.init(elems);
        }
    }, []);

    return (
        <>
            <nav>
                <div className="navbar nav-wrapper blue darken-1 navbar-padding">
                    <span className="brand-logo">Poll website</span>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
                    <a
                        href="#"
                        data-target="mobile-demo"
                        className="sidenav-trigger"
                    >
                        <i className="material-icons">
                            menu
                        </i>
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <NavLink to={Locations.CREATE_POLL}>
                                Create
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={Locations.POLLS_LIST}>
                                Polls
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-demo">
                <li>
                    <NavLink to={Locations.CREATE_POLL}>
                        Create
                    </NavLink>
                </li>
                <li>
                    <NavLink to={Locations.POLLS_LIST}>
                        Polls
                    </NavLink>
                </li>
            </ul>
        </>
    );
}

import React from 'react';
import './Loader.css';

export const Loader = () => (
    <div className="loader-flex">
        <div className="preloader-wrapper active">
            <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                    <div className="circle" />
                </div>
                <div className="gap-patch">
                    <div className="circle" />
                </div>
                <div className="circle-clipper right">
                    <div className="circle" />
                </div>
            </div>
        </div>
    </div>
);

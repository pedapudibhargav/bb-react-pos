import './Loader.scss';
import React from 'react';
import { WP_RESOUCES_FOLDER } from '../../config/AppConstants';

class Loader extends React.Component {
    render() {
        return (
            <div className="loading-spinner">
                 <img src={WP_RESOUCES_FOLDER + '/img/loading.gif'} alt="loading spinner" />
            </div>
        );
    }
}

export default Loader;
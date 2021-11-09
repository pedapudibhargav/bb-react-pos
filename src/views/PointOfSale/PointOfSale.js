import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import React from 'react';
import { WP_DOMAIN } from '../../config/AppConstants';
import AddOrRemoveInventory from '../InventoryManagement/AddOrRemoveInventory/AddOrRemoveInventory';
import './PointOfSale.scss'
import Cart from "./Cart/Cart";

class PointOfSale extends React.Component {
    constructor(props) {
        super(props)
        let { path, url } = this.props.match;
        this.state = {
            transaction: [],
            path: path,
            url: url,
            enableLoader: true
        };
        this.onTransactionUpdate = this.onTransactionUpdate.bind(this);
    }
    componentDidMount() {
        fetch(`${WP_DOMAIN}/wp-json/bb/v1/products`)
            .then(res => res.json())
            .then(
                (data) => {
                    this.setState({
                        inventory: data,
                        enableLoader: false
                    });
                },
                (error) => {
                    console.error(error);
                }
            )
        console.log('POS sessionStorage:',sessionStorage.getItem('pos-transaction'));
        let transactionInSstorage = JSON.parse(sessionStorage.getItem('pos-transaction'));
        console.log('POS transactionInSstorage', transactionInSstorage);
        this.setState({
            transaction: (transactionInSstorage && transactionInSstorage.length > 0) ? transactionInSstorage : []
        });
    }
    onTransactionUpdate(transactionIn) {
        console.log('transactionIn:',transactionIn);
        sessionStorage.setItem('pos-transaction', JSON.stringify(transactionIn));
        this.setState({
            transaction: transactionIn
        });
    }

    render() {
        return (
            <div className="pos-wrapper">
                <Switch>
                    <Route exact path={`${this.state.path}`} render={(props) => <AddOrRemoveInventory {...props} onTransactionUpdate={this.onTransactionUpdate} currentTransaction={this.state.transaction} inventory={this.state.inventory} variant='pos' key='pos' enableLoader={this.state.enableLoader} />}>
                    </Route>
                    <Route path={`${this.state.path}/cart`} render={(props) => <Cart {...props} onTransactionUpdate={this.onTransactionUpdate} currentTransaction={this.state.transaction} key='cart' />}>
                    </Route>
                    {/* <Route path={`${this.state.path}/removeInventory`} render={(props) => <AddOrRemoveInventory {...props} onInventoryChange={this.handleInventoryUpdate} inventory={this.state.inventory} variant='remove' key='remove' enableLoader={this.state.enableLoader} />}>
                    </Route> */}
                </Switch>
            </div>
        );
    }
}
export default withRouter(PointOfSale);


import {
  Switch,
  Route,
  withRouter,
  NavLink
} from "react-router-dom";
import React from 'react';
import AddOrRemoveInventory from "./AddOrRemoveInventory/AddOrRemoveInventory";
import InventoryHome from "./InventoryHome/InventoryHome";
import { WP_DOMAIN } from "../../config/AppConstants";

class InventoryManagement extends React.Component {
  constructor(props) {
    super(props)
    let { path, url } = this.props.match;
    this.state = {
      inventory: [],
      path: path,
      url: url,
      enableLoader: false
    };
    this.handleInventoryUpdate = this.handleInventoryUpdate.bind(this);
  }

  componentDidMount() {
    this.setState({
      enableLoader: true
    });
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
  }

  handleInventoryUpdate(invArrIn) {
    console.log(`Received Inventory`,invArrIn);
    this.setState({
      inventory: invArrIn
    });
  }

  render() {

    return (
      <div className="inventory-management">
        <div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <NavLink activeClassName='active' className="nav-link" aria-current="page" to={`${this.state.url}/addInventory`}>Add products</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName='active' className="nav-link" aria-current="page" to={`${this.state.url}/removeInventory`}>Add Wastage</NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName='active' className="nav-link disabled" aria-current="page" to={`${this.state.url}/history`}>History</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Switch>
            <Route exact path={this.state.path}>
              <InventoryHome></InventoryHome>
            </Route>
            <Route path={`${this.state.path}/addInventory`} render={(props) => <AddOrRemoveInventory {...props} onInventoryChange={this.handleInventoryUpdate} inventory={this.state.inventory} variant='add' key='add' enableLoader={this.state.enableLoader}/>}>
            </Route>
            <Route path={`${this.state.path}/removeInventory`} render={(props) => <AddOrRemoveInventory {...props} onInventoryChange={this.handleInventoryUpdate} inventory={this.state.inventory} variant='remove' key='remove' enableLoader={this.state.enableLoader}/>}>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}
export default withRouter(InventoryManagement);


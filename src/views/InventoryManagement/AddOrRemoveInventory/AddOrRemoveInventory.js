import './AddOrRemoveInventory.scss';
import React from 'react';
import { Modal, Button, Toast } from 'react-bootstrap';
import { WP_DOMAIN } from '../../../config/AppConstants';
import Loader from '../../../components/Loader/Loader';
import {
  Link
} from "react-router-dom";


class AddOrRemoveInventory extends React.Component {
  constructor(props) {
    super(props);
    let currentVariant = this.props.variant;
    let isCurrentVairantAdd = currentVariant === 'add' || currentVariant === 'pos';
    let dropdownRangeArr = [];
    let startIterator = isCurrentVairantAdd ? 0 : -40;
    let endIterator = isCurrentVairantAdd ? 40 : 0;
    let transactionInSstorage = JSON.parse(sessionStorage.getItem('pos-transaction'));
    console.log('AddOrRemeoveInventory session storage:' + sessionStorage.getItem('pos-transaction'));
    transactionInSstorage = transactionInSstorage != null ? transactionInSstorage : {};
    for (let i = startIterator; i <= endIterator; i++) {
      dropdownRangeArr.push(i);
    }
    this.state = {
      error: null,
      items: this.props.inventory,
      currentTransaction: transactionInSstorage,
      show: false,
      tossShow: false,
      enableLoader: false,
      dropdownRangeArr: isCurrentVairantAdd ? dropdownRangeArr.sort(function (a, b) { return a - b }) : dropdownRangeArr.sort(function (a, b) { return b - a })
    };
    console.log('AddOrRemeoveInventory: props.currentTransaction', this.props.currentTransaction);
    console.log('AddOrRemeoveInventory: state.currentTransaction', this.state.currentTransaction);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleTossClose = this.handleTossClose.bind(this);
    this.handleInventoryUpdates = this.handleInventoryUpdates.bind(this);
    this.handlePOSChekout = this.handlePOSChekout.bind(this);
  }
  handleInventoryUpdates(invIn) {
    this.props.onInventoryChange(invIn);
  }
  handleClose = () => {
    this.setState({
      show: false
    });
  };
  handleShow = () => {
    this.setState({
      show: true
    });
  };

  handleSelectChange(productIn, event) {
    let orderQuantity = event.target.value;
    console.log(`Product In: ${JSON.stringify(productIn)},orderQuantity: ${orderQuantity}`);
    let curTrans = this.state.currentTransaction;
    productIn['order_quantity'] = parseInt(orderQuantity);
    productIn['price'] = parseInt(productIn['price'].toString().replace('&#8377;', ''));
    curTrans[productIn.id] = productIn;
    this.setState({
      currentTransaction: curTrans
    });
    console.log(JSON.stringify(this.state.currentTransaction));
  }
  handleTossClose(inputFlag) {
    this.setState({
      tossShow: inputFlag
    });
  }
  handleSubmit() {
    this.handleClose();
    let requstInvTrans = [];
    let allProductsInOrder = Object.values(this.state.currentTransaction);
    if (!allProductsInOrder.length) {
      alert("Please add new products by using dropdops");
      return;
    }
    for (let productIn of allProductsInOrder) {
      requstInvTrans.push({
        'id': productIn.id,
        'value': productIn.order_quantity
      });
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requstInvTrans)
    };
    this.setState({
      enableLoader: true
    });
    fetch(`${WP_DOMAIN}/wp-json/bb/v1/inventory/add`, requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        this.setState({
          enableLoader: false
        });
        this.handleInventoryUpdates(data);
        this.handleTossClose(true);
      })
      .catch((error) => {
        console.log('error: ' + error);
        // this.setState({ requestFailed: true });
      });
  }
  handlePOSChekout() {
    this.props.onTransactionUpdate(this.state.currentTransaction);
  }

  render() {
    return (
      <div className="add-inventory-wrapper">
        <div className="container">
          <div className="row">
            {
              this.state.enableLoader || this.props.enableLoader ? "" :
                this.props.inventory.map(item => (
                  // const selectValue = this.state.currentTransaction[item.id] && this.state.currentTransaction["order_quantity"] ? this.state.currentTransaction["order_quantity"] : '0';

                  <div className="col-12 col-md-6 col-lg-4 my-2" key={item.id}>
                    <div className="card">
                      <div className="row g-0">
                        <div className="col-4">
                          <img src={item.product_image} className="img-fluid rounded-start" alt="dummytext"></img>
                        </div>
                        <div className="col-8">
                          <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <div className="d-flex flex-row">
                              <select className="form-select mr-1 inv-select" name={item.id}
                                defaultValue={this.state.currentTransaction[item.id] ? this.state.currentTransaction[item.id]['order_quantity'] : 0}
                                onChange={(e) => this.handleSelectChange(item, e)} aria-label="Default select example">
                                {
                                  this.state.dropdownRangeArr.map((currNum) => (
                                    <option value={currNum} key={currNum.toString()}>{currNum}</option>
                                  )
                                  )
                                }
                              </select>
                              <div>
                                <span className="badge bg-primary d-inline">{item.stock_quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
          {
            this.state.enableLoader || this.props.enableLoader ?
              <div className="row">
                <div className="col-12">
                  <Loader show={true}></Loader>
                </div>
              </div> :
              ""
          }

          <Toast onClose={(e) => this.handleTossClose(false, e)} show={this.state.tossShow} className="inv-update-toss" delay={5000} autohide>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Bootstrap</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body>Your changes are saved.</Toast.Body>
          </Toast>
          <div className={this.state.enableLoader ? "row d-none" : "row"}>
            <div className="col-12">
              <button type="button" className="btn btn-secondary btn-lg">Cancel</button>
              {
                this.props.variant === "pos" ?
                  // <Button variant="primary" className="btn-lg m-4" onClick={this.handlePOSChekout}>
                  //   Cart
                  // </Button>
                  <Link className="btn btn-primary btn-lg m-4" to="/pos/cart" onClick={this.handlePOSChekout}>Cart</Link>
                  :
                  <Button variant="primary" className="btn-lg m-4" onClick={this.handleShow}>
                    Save
                  </Button>
              }
            </div>
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Save changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to save?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default AddOrRemoveInventory;
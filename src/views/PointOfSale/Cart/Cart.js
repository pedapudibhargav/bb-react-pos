import React from 'react';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Cart.scss'

class Cart extends React.Component {
    constructor(props) {
        super(props);
        let transactionInSstorage = JSON.parse(sessionStorage.getItem('pos-transaction'));
        transactionInSstorage = transactionInSstorage?transactionInSstorage:[];
        let orderTotal = 0;
        let itemsInOrder = 0;
        for(let productIn of Object.values(transactionInSstorage)){
            let productPrice = parseInt(productIn.price)
            let productQuantity = parseInt(productIn.order_quantity)
            orderTotal += productPrice * productQuantity
            itemsInOrder += productQuantity;
        }
        this.state = {
            transaction: transactionInSstorage,
            orderTotal: orderTotal,
            itemsInOrder: itemsInOrder
        }
        this.handleTransactionUpdate = this.handleTransactionUpdate.bind(this);
    }

    handleTransactionUpdate = (productId, event) => {
        let tmpTrans = this.state.transaction;
        tmpTrans[productId]['order_quantity'] = event.target.value;
        this.setState({
            transaction: tmpTrans
        });
        this.props.onTransactionUpdate(this.state.transaction);
    }
    render() {
        return (
            <div className="cart-wrapper">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className="cart-col">
                                <div className="cart-items mt-2">
                                    {
                                        Object.values(this.state.transaction).map((productIn, proI) => (
                                            <div className="cart-item" key={proI}>
                                                <img src={productIn.product_image} alt="" />
                                                <div className="cart-item-content p-2">
                                                    <h5>{productIn.name}</h5>
                                                    <div className="cart-item-quant">
                                                        <Form.Select aria-label="Default select example" defaultValue={productIn.order_quantity} onChange={(e) => this.handleSelectChange(productIn.id, e)}>
                                                            {[...Array(19)].map((x, i) =>
                                                                <option key={i} value={i}>
                                                                    Qty: {i}</option>
                                                            )}
                                                        </Form.Select>
                                                        <p className="cart-item-price">₹{productIn.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        )
                                    }
                                </div>
                                <div className="cart-nav py-3 bg-light">                                    
                                    <h4 className="">Total ({this.state.itemsInOrder} items): <strong>₹{this.state.orderTotal}</strong></h4>
                                    <div className="cart-nav-btns">
                                        <div className="d-grid gap-2">
                                            <Button variant="primary" size="lg">Checkout</Button>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <Link className="btn btn-secondary btn-lg mt-2" to="/pos">Back</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default Cart;
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation/Navigation';
import Home from './views/Home/Home';
import InventoryManagement from './views/InventoryManagement/InventoryManagement';
import StoreFront from './views/StoreFront/StoreFront';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import PointOfSale from './views/PointOfSale/PointOfSale';
import Cart from './views/PointOfSale/Cart/Cart';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation></Navigation>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/store-front" component={StoreFront}>
          </Route>
          <Route path="/inventory">
            <InventoryManagement />
          </Route>
          <Route path="/pos">
            <PointOfSale></PointOfSale>
          </Route>
          <Route path="/cart">
            <Cart></Cart>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

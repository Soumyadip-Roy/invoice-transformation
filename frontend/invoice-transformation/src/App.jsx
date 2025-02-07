import DashboardLayoutStruct from "./component/SideDrawer";
import UploadInvoice from "./pages/UploadInvoice";
import Invoice from "./pages/invoicePage";
import Product from "./pages/productPage";
import Customer from "./pages/CustomerPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<DashboardLayoutStruct />}>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<UploadInvoice />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/product" element={<Product />} />
            <Route path="/customer" element={<Customer />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

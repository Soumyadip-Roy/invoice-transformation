import { AppProvider } from "@toolpad/core/react-router-dom";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
// import swipeLogo from "../assets/swipeLogo.png";

// Sidebar icon
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

import { Outlet } from "react-router-dom";

import theme from "../theme/theme";

const NAVIGATION = [
  {
    kind: "header",
    // title: "Requirements",
  },
  {
    segment: "upload",
    title: "Upload Invoice",
    icon: <FileUploadRoundedIcon />,
  },
  {
    segment: "invoice",
    title: "Invoice",
    icon: <DescriptionRoundedIcon />,
  },
  {
    segment: "product",
    title: "Product",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "customer",
    title: "Customer",
    icon: <PeopleAltIcon />,
  },
];

export default function DashboardLayoutStruct({ children }) {
  return (
    <AppProvider navigation={NAVIGATION} theme={theme}>
      <DashboardLayout
        slots={{
          toolbarAccount: () => null,
        }}>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

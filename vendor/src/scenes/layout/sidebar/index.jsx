/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme, useMediaQuery, Badge } from "@mui/material";
import { useContext, useState, useMemo } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
  MessageOutlined
} from "@mui/icons-material";
import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/logo.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from '@mui/icons-material/Store';
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Memoize styles for better performance
  const sidebarStyles = useMemo(() => ({
    backgroundColor: colors.primary[400],
    rootStyles: {
      border: 0,
      height: "100%",
      boxShadow: "2px 0px 20px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }
  }), [colors.primary]);

  return (
    <Sidebar
      {...sidebarStyles}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { 
            ":hover": { 
              background: "transparent",
              transform: "translateX(5px)",
              transition: "all 0.3s ease"
            } 
          },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px"
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ 
                  transition: "all .3s ease",
                  transform: "translateX(0)",
                  "&:hover": {
                    transform: "translateX(5px)"
                  }
                }}
              >
                {/* <img
                  style={{ 
                    width: "35px", 
                    height: "35px", 
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}
                  src={logo}
                  alt="Ecom"
                  loading="lazy"
                /> */}
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                  sx={{
                    letterSpacing: "0.5px",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    fontSize: "1.6rem",
                  }}
                >
                  Shopvibe
                </Typography>
              </Box>
            )}
            <IconButton 
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                backgroundColor: colors.primary[300],
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: colors.primary[200],
                }
              }}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            mb: "25px",
            padding: "10px",
            background: `linear-gradient(145deg, ${colors.primary[300]}, ${colors.primary[500]})`,
            margin: "0 15px",
            borderRadius: "15px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color={colors.gray[100]}
              sx={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                letterSpacing: "1px"
              }}
            >
              Vendor Panel
            </Typography>
          </Box>
        </Box>
      )}

      <Box 
        mb={5} 
        pl={collapsed ? undefined : "5%"}
        sx={{
          "& .ps-menu-button": {
            borderRadius: "10px",
            margin: "5px 15px",
            padding: "10px 15px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: `${colors.primary[300]} !important`,
              transform: "translateX(5px)"
            }
          }
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: colors.greenAccent[500],
                background: "transparent",
                transition: "all .4s ease",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/dashboard"
            colors={colors}
            icon={<DashboardOutlined />}
          />

          <Typography
            variant="h6"
            color={colors.gray[300]}
            sx={{ 
              m: "25px 0 15px 20px",
              fontSize: "0.8rem",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              opacity: 0.8
            }}
          >
            {!collapsed ? "Manage" : " "}
          </Typography>

          {/* Existing menu items with enhanced styling */}
          <Item
            title="Profile"
            path="/profile"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Products"
            path="/products"
            colors={colors}
            icon={<StorefrontIcon />}
          />
          <Item
            title="Orders"
            path="/orders"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />
          <Item
            title="Payments"
            path="/payments"
            colors={colors}
            icon={<AttachMoneyIcon />}
          />
          <Item
            title="Message"
            path="/message"
            colors={colors}
            icon={<MessageOutlined />}
          />
          <Item
            title="Feedbacks"
            path="/feedbacks"
            colors={colors}
            icon={<RateReviewOutlined />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;

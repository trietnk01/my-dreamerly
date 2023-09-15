import React from "react";
// material-ui
import { Avatar, Badge, Box, CssBaseline, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "store";
import { toggleDrawer } from "store/slices/drawer";
import { openSnackbar } from "store/slices/snackbar";
import axios from "utils/axios";
import { END_POINT } from "configs";
interface IUser {
	id: number;
	display_name: string;
	email: string;
	phone: string;
	avatar: string;
}
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	marginLeft: `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: 0
	})
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));
const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-end"
}));
const menuId = "primary-search-account-menu";
const MainLayout = () => {
	const { t } = useTranslation();
	const { logout } = useAuth();
	const dispatch = useDispatch();
	const { user } = useAuth();
	const { isOpenDrawer } = useSelector((state) => state.drawer);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleToggleDrawer = () => {
		dispatch(toggleDrawer());
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleLogout = () => {
		logout(user && user.id ? user.id : 0);
	};
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleMenuClose}>{t("My account")}</MenuItem>
			<MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
		</Menu>
	);
	return (
		<Box display="flex">
			<CssBaseline />
			<AppBar position="fixed" open={isOpenDrawer}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleToggleDrawer}
						edge="start"
						sx={{ mr: 2, ...(isOpenDrawer && { display: "none" }) }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
						MUI
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
						<Box>{user && user.display_name ? user.display_name : ""}</Box>
						<Box sx={{ ml: 2 }}>{user && user.email ? user.email : ""}</Box>
						<IconButton size="large" aria-label="show 4 new mails" color="inherit">
							<Badge badgeContent={4} color="error">
								<MailIcon />
							</Badge>
						</IconButton>
						<IconButton size="large" aria-label="show 17 new notifications" color="inherit">
							<Badge badgeContent={17} color="error">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<IconButton
							size="large"
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							<Avatar src={`${END_POINT.URL_SERVER}/images/${user?.avatar}`} />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			<Sidebar />
			{renderMenu}
			<Main open={isOpenDrawer} sx={{ p: 1 }}>
				<DrawerHeader />
				<Box sx={{ backgroundColor: "#f6fbff" }} borderRadius={2} p={2}>
					<Outlet />
				</Box>
			</Main>
		</Box>
	);
};

export default MainLayout;

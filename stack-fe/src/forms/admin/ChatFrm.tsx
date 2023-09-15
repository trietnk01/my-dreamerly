import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import { Avatar, Box, Card, Divider, IconButton, useTheme } from "@mui/material";
import NoAvatar from "assets/images/no-avatar.jpg";
import { BoxChat } from "components";
import { END_POINT, socket } from "configs";
import { MyTextField } from "control";
import useAuth from "hooks/useAuth";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "store";
import { toggleDrawer } from "store/slices/drawer";
import { openSnackbar } from "store/slices/snackbar";
import axios from "utils/axios";
interface IFormInput {
	message: string;
}
interface IUser {
	id: number;
	display_name: string;
	email: string;
	phone: string;
	avatar: string;
}
const ChatFrm = () => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const { t } = useTranslation();
	const { user } = useAuth();
	const [isConnected, setIsConnected] = React.useState(socket.connected);
	const [messageData, setMessageData] = React.useState<string[]>([]);
	const [emailUser, setEmailUser] = React.useState<string>("");
	const [displayNameUser, setDisplayNameUser] = React.useState<string>("");
	const [avatarUser, setAvatarUser] = React.useState<string>("");
	const {
		register,
		handleSubmit,
		control,
		getValues,
		watch,
		setValue,
		setError,
		clearErrors,
		formState: { errors }
	} = useForm<IFormInput>({
		defaultValues: {
			message: ""
		}
	});
	const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
		await socket.emit("CLIENT_SEND_MESSAGE", {
			user_id: user?.id,
			display_name: user && user.display_name ? user?.display_name : "",
			content: dataForm.message
		});
		setValue("message", "");
	};
	React.useEffect(() => {
		dispatch(toggleDrawer());
		const onConnect = () => {
			setIsConnected(true);
		};
		const onDisconnect = () => {
			setIsConnected(false);
		};
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);
	React.useEffect(() => {
		socket.on("SERVER_RETURN_MESSAGE", (data) => {
			setMessageData((prevState) => [...prevState, data]);
		});
	}, [socket]);
	const handleClickUser = React.useCallback(async (userId: number) => {
		try {
			const res: any = await axios.get(`/users/show/${parseInt(userId.toString())}`, { headers: { isShowLoading: false } });
			const { status, item } = res.data;
			if (status) {
				const userElmt: IUser = item ? item : null;
				if (userElmt) {
					setEmailUser(userElmt.email);
					setDisplayNameUser(userElmt.display_name);
					setAvatarUser(userElmt.avatar);
				}
			} else {
				dispatch(
					openSnackbar({
						open: true,
						message: t("User detail shown failure"),
						anchorOrigin: { vertical: "bottom", horizontal: "left" },
						variant: "alert",
						alert: {
							color: "error"
						},
						transition: "Fade",
						close: false
					})
				);
			}
		} catch (err) {
			dispatch(
				openSnackbar({
					open: true,
					message: t("Error system"),
					anchorOrigin: { vertical: "bottom", horizontal: "left" },
					variant: "alert",
					alert: {
						color: "error"
					},
					transition: "Fade",
					close: false
				})
			);
		}
	}, []);
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card variant="outlined">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: theme.palette.grey[800],
						fontWeight: 500,
						fontSize: "20px",
						height: "60px",
						pl: "20px",
						pr: "20px"
					}}
				>
					{t("Chat")}
				</Box>
				<Divider />
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: theme.palette.grey[600],
						fontSize: "11px",
						height: "60px",
						pl: "20px",
						pr: "20px"
					}}
				>
					{t("State")}: {isConnected ? t("Connected") : t("Disconnected")}
				</Box>
			</Card>
			<Box sx={{ display: "flex", mt: "10px", columnGap: "8px" }}>
				<BoxChat onSetUserId={handleClickUser} />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "1000px",
						border: "1px solid",
						borderColor: theme.palette.grey[300],
						bgcolor: "#FFF",
						borderRadius: "6px",
						p: "8px",
						flexGrow: 1
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							columnGap: "8px",
							borderBottom: "1px solid",
							borderColor: theme.palette.grey[300],
							pb: "8px"
						}}
					>
						<IconButton size="large">
							<MenuRoundedIcon />
						</IconButton>
						<Box sx={{ display: "flex", columnGap: "12px" }}>
							<Avatar src={avatarUser ? `${END_POINT.URL_SERVER}/images/${avatarUser}` : NoAvatar} />
							<Box>
								<Box sx={{ fontWeight: 600 }}>{displayNameUser}</Box>
								<Box sx={{ color: theme.palette.grey[400], fontSize: "11px" }}>{emailUser}</Box>
							</Box>
						</Box>
					</Box>
					<Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px", flexGrow: 1, pt: "12px", pb: "12px" }}>
						{messageData &&
							messageData.map((elmt: string, idx: number) => {
								return (
									<Box key={`chat-frm-receiver-idx-${idx}`} sx={{ display: "flex", justifyContent: "flex-end" }}>
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												rowGap: "4px",
												bgcolor: "#e3f2fd",
												p: "12px",
												borderRadius: "8px"
											}}
										>
											<Box sx={{ fontSize: "14px", color: theme.palette.grey[800] }}>{elmt}</Box>
											<Box
												sx={{
													display: "flex",
													justifyContent: "flex-end",
													fontSize: "11px",
													color: theme.palette.grey[500]
												}}
											>
												11:23 AM
											</Box>
										</Box>
									</Box>
								);
							})}

						<Box sx={{ display: "flex", justifyContent: "flex-start" }}>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									rowGap: "4px",
									bgcolor: "#ede7f6",
									p: "12px",
									borderRadius: "8px"
								}}
							>
								<Box sx={{ fontSize: "14px", color: theme.palette.grey[800] }}>Hey. Very Good morning. How are you?</Box>
								<Box sx={{ display: "flex", justifyContent: "flex-end", fontSize: "11px", color: theme.palette.grey[500] }}>
									11:23 AM
								</Box>
							</Box>
						</Box>
					</Box>
					<Box sx={{ height: "80px", p: "2px", display: "flex", columnGap: "12px", alignItems: "center" }}>
						<Controller
							name="message"
							defaultValue=""
							control={control}
							render={({ field }) => {
								return <MyTextField {...field} fullWidth label={t("Type a message")} />;
							}}
						/>

						<IconButton color="primary" size="large" type="submit">
							<SendTwoToneIcon />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</form>
	);
};

export default ChatFrm;

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import VideoIcon from "@material-ui/icons/VideoLibrary";
import MusicIcon from "@material-ui/icons/LibraryMusic";
import ImageIcon from "@material-ui/icons/Collections";
import AddIcon from "@material-ui/icons/Add";
import DocIcon from "@material-ui/icons/FileCopy";
import ShareIcon from "@material-ui/icons/Share";
import BackIcon from "@material-ui/icons/ArrowBack";
import SdStorage from "@material-ui/icons/SdStorage";
import OpenIcon from "@material-ui/icons/OpenInNew";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import OpenFolderIcon from "@material-ui/icons/FolderOpen";
import RenameIcon from "@material-ui/icons/BorderColor";
import MoveIcon from "@material-ui/icons/Input";
import DeleteIcon from "@material-ui/icons/Delete";
import UploadIcon from "@material-ui/icons/CloudUpload";
import FolderShared from "@material-ui/icons/FolderShared";
import SaveIcon from "@material-ui/icons/Save";
import MenuIcon from "@material-ui/icons/Menu";
import { isPreviewable } from "../../config";
import {
    drawerToggleAction,
    setSelectedTarget,
    navitateTo,
    openCreateFolderDialog,
    changeContextMenu,
    searchMyFile,
    saveFile,
    openMusicDialog,
    showImgPreivew,
    toggleSnackbar,
    openMoveDialog,
    openRemoveDialog,
    openShareDialog,
    openRenameDialog, openLoadingDialog
} from "../../actions";
import {
    allowSharePreview,
    checkGetParameters,
    changeThemeColor
} from "../../untils";
import Uploader from "../Upload/Uploader.js";
import { sizeToString } from "../../untils";
import pathHelper from "../../untils/page";
import SezrchBar from "./SearchBar";
import StorageBar from "./StorageBar";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";
import { AccountArrowRight, AccountPlus } from "mdi-material-ui";
import { withRouter } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    withStyles,
    withTheme,
    Button,
    Drawer,
    SwipeableDrawer,
    IconButton,
    Hidden,
    Avatar,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    List,
    Badge,
    Grow,
    Tooltip
} from "@material-ui/core";
import Auth from "../../middleware/Auth";
import { baseURL } from "../../middleware/Api";

const drawerWidth = 240;
const drawerWidthMobile = 270;

const mapStateToProps = state => {
    return {
        desktopOpen: state.viewUpdate.open,
        selected: state.explorer.selected,
        isMultiple: state.explorer.selectProps.isMultiple,
        withFolder: state.explorer.selectProps.withFolder,
        withFile: state.explorer.selectProps.withFile,
        path: state.navigator.path,
        keywords: state.explorer.keywords,
        title: state.siteConfig.title,
        subTitle:state.viewUpdate.subTitle,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleDesktopToggle: open => {
            dispatch(drawerToggleAction(open));
        },
        setSelectedTarget: targets => {
            dispatch(setSelectedTarget(targets));
        },
        navitateTo: path => {
            dispatch(navitateTo(path));
        },
        openCreateFolderDialog: () => {
            dispatch(openCreateFolderDialog());
        },
        changeContextMenu: (type, open) => {
            dispatch(changeContextMenu(type, open));
        },
        searchMyFile: keywords => {
            dispatch(searchMyFile(keywords));
        },
        saveFile: () => {
            dispatch(saveFile());
        },
        openMusicDialog: () => {
            dispatch(openMusicDialog());
        },
        showImgPreivew: first => {
            dispatch(showImgPreivew(first));
        },
        toggleSnackbar: (vertical, horizontal, msg, color) => {
            dispatch(toggleSnackbar(vertical, horizontal, msg, color));
        },
        openRenameDialog: () => {
            dispatch(openRenameDialog());
        },
        openMoveDialog: () => {
            dispatch(openMoveDialog());
        },
        openRemoveDialog: () => {
            dispatch(openRemoveDialog());
        },
        openShareDialog: () => {
            dispatch(openShareDialog());
        },
        openLoadingDialog:(text) => {
            dispatch(openLoadingDialog(text))
        }
    };
};

const styles = theme => ({
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.down("xs")]: {
            marginLeft: drawerWidthMobile
        },
        zIndex: theme.zIndex.drawer + 1,
        transition: " background-color 250ms"
    },

    drawer: {
        width: 0,
        flexShrink: 0
    },
    drawerDesktop: {
        width: drawerWidth,
        flexShrink: 0
    },
    icon: {
        marginRight: theme.spacing(2)
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    menuButtonDesktop: {
        marginRight: 20,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    menuIcon: {
        marginRight: 20
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidthMobile
    },
    upDrawer: {
        marginBottom: 90
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: 0
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    hiddenButton: {
        display: "none"
    },
    grow: {
        flexGrow: 1
    },
    badge: {
        top: 1,
        right: -15
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    sectionForFile: {
        display: "flex"
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    addButton: {
        marginLeft: "40px",
        marginTop: "25px",
        marginBottom: "15px"
    },
    fabButton: {
        borderRadius: "100px"
    },
    badgeFix: {
        right: "10px"
    },
    iconFix: {
        marginLeft: "16px"
    },
    dividerFix: {
        marginTop: "8px"
    },
    folderShareIcon: {
        verticalAlign: "sub",
        marginRight: "5px"
    },
    shareInfoContainer: {
        display: "flex",
        marginTop: "15px",
        marginBottom: "20px",
        marginLeft: "28px",
        textDecoration: "none"
    },
    shareAvatar: {
        width: "40px",
        height: "40px"
    },
    stickFooter: {
        bottom: "0px",
        position: "absolute",
        backgroundColor: theme.palette.background.paper,
        width: "100%"
    },
    ownerInfo: {
        marginLeft: "10px",
        width: "150px"
    }
});
class NavbarCompoment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
        this.UploaderRef = React.createRef();
    }

    componentDidMount = () => {
        changeThemeColor(
            this.props.selected.length <= 1 &&
                !(!this.props.isMultiple && this.props.withFile)
                ? this.props.theme.palette.primary.main
                : this.props.theme.palette.background.default
        );
    };

    componentWillReceiveProps = nextProps => {
        if (
            (this.props.selected.length <= 1 &&
                !(!this.props.isMultiple && this.props.withFile)) !==
            (nextProps.selected.length <= 1 &&
                !(!nextProps.isMultiple && nextProps.withFile))
        ) {
            changeThemeColor(
                !(
                    this.props.selected.length <= 1 &&
                    !(!this.props.isMultiple && this.props.withFile)
                )
                    ? this.props.theme.palette.primary.main
                    : this.props.theme.palette.background.default
            );
        }
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    loadUploader() {
        if (pathHelper.isHomePage(this.props.location.pathname)) {
            return <Uploader />;
        }
    }

    filterFile = type => {
        this.props.searchMyFile("{filterType:" + type + "}");
    };

    openPreview = () => {
        if (!allowSharePreview()) {
            this.props.toggleSnackbar(
                "top",
                "right",
                "未登录用户无法预览",
                "warning"
            );
            return;
        }
        this.props.changeContextMenu("file", false);
        let previewPath =
            this.props.selected[0].path === "/"
                ? this.props.selected[0].path + this.props.selected[0].name
                : this.props.selected[0].path +
                  "/" +
                  this.props.selected[0].name;
        switch (isPreviewable(this.props.selected[0].name)) {
            case "img":
                this.props.showImgPreivew(this.props.selected[0]);
                return;
            case "msDoc":
                if (pathHelper.isSharePage(this.props.location.pathname)) {
                    return;
                }
                this.props.history.push("/doc" + previewPath);
                return;
            case "audio":
                this.props.openMusicDialog();
                return;
            case "open":
                window.open(
                    window.apiURL.preview +
                        "/?action=preview&path=" +
                        encodeURIComponent(previewPath)
                );
                return;
            case "video":
                if (pathHelper.isSharePage(this.props.location.pathname)) {
                    return;
                }
                this.props.history.push("/video" + previewPath);
                return;
            case "edit":
                if (pathHelper.isSharePage(this.props.location.pathname)) {
                    return;
                }
                this.props.history.push("/text" + previewPath);
                return;
            default:
                return;
        }
    };

    openDownload = () => {
        if (!allowSharePreview()) {
            this.props.toggleSnackbar(
                "top",
                "right",
                "未登录用户无法预览",
                "warning"
            );
            return;
        }
        this.props.openLoadingDialog("获取下载地址...");
    };

    archiveDownload = () =>{
        this.props.openLoadingDialog("打包中...");
    }

    render() {
        const { classes } = this.props;
        const user  =Auth.GetUser();

        const drawer = (
            <div id="container" className={classes.upDrawer}>
                {pathHelper.isMobile() && <UserInfo />}
                {Auth.Check() && (
                        <div>
                            <ListItem
                                button
                                key="我的文件"
                                onClick={() => (this.props.history.push("/home?path=%2F"))}
                            >
                                <ListItemIcon>
                                    <FolderShared className={classes.iconFix} />
                                </ListItemIcon>
                                <ListItemText primary="我的文件" />
                            </ListItem><Divider />
                        </div>
                    )}

                {pathHelper.isHomePage(this.props.location.pathname) && (
                    <div>

                            <ListItem
                                button
                                id="pickfiles"
                                className={classes.hiddenButton}
                            >
                                <ListItemIcon>
                                    <UploadIcon />
                                </ListItemIcon>
                                <ListItemText />
                            </ListItem>
                        <ListItem
                            button
                            key="视频"
                            onClick={() => this.filterFile("video")}
                        >
                            <ListItemIcon>
                                <VideoIcon
                                    className={[
                                        classes.iconFix,
                                        classes.iconVideo
                                    ]}
                                />
                            </ListItemIcon>
                            <ListItemText primary="视频" />
                        </ListItem>
                        <ListItem
                            button
                            key="图片"
                            onClick={() => this.filterFile("image")}
                        >
                            <ListItemIcon>
                                <ImageIcon
                                    className={[
                                        classes.iconFix,
                                        classes.iconImg
                                    ]}
                                />
                            </ListItemIcon>
                            <ListItemText primary="图片" />
                        </ListItem>
                        <ListItem
                            button
                            key="音频"
                            onClick={() => this.filterFile("audio")}
                        >
                            <ListItemIcon>
                                <MusicIcon
                                    className={[
                                        classes.iconFix,
                                        classes.iconAudio
                                    ]}
                                />
                            </ListItemIcon>
                            <ListItemText primary="音频" />
                        </ListItem>
                        <ListItem
                            button
                            key="文档"
                            onClick={() => this.filterFile("doc")}
                        >
                            <ListItemIcon>
                                <DocIcon
                                    className={[
                                        classes.iconFix,
                                        classes.iconDoc
                                    ]}
                                />
                            </ListItemIcon>
                            <ListItemText primary="文档" />
                        </ListItem>{" "}
                        <Divider />
                    </div>
                )}

                {Auth.Check() && (
                    <div>
                        <ListItem
                            button
                            key="我的分享"
                            onClick={() => (window.location.href = "/Share/My")}
                        >
                            <ListItemIcon>
                                <ShareIcon className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="我的分享" />
                        </ListItem>
                        <ListItem
                            button
                            key="离线下载"
                            onClick={() =>
                                (window.location.href = "/Home/Download")
                            }
                        >
                            <ListItemIcon>
                                <DownloadIcon className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="离线下载" />
                        </ListItem>
                        <ListItem
                            button
                            key="容量配额"
                            onClick={() =>
                                (window.location.href = "/Home/Quota")
                            }
                        >
                            <ListItemIcon>
                                <SdStorage className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="容量配额" />
                        </ListItem>
                        {!pathHelper.isSharePage(
                            this.props.location.pathname
                        ) && (
                            <div>
                                <StorageBar></StorageBar>
                            </div>
                        )}
                    </div>
                )}
                {!Auth.Check() && (
                    <div>
                        <ListItem
                            button
                            key="登录"
                            onClick={() => (window.location.href = "/Login")}
                        >
                            <ListItemIcon>
                                <AccountArrowRight
                                    className={classes.iconFix}
                                />
                            </ListItemIcon>
                            <ListItemText primary="登录" />
                        </ListItem>
                        <ListItem
                            button
                            key="注册"
                            onClick={() => (window.location.href = "/Signup")}
                        >
                            <ListItemIcon>
                                <AccountPlus className={classes.iconFix} />
                            </ListItemIcon>
                            <ListItemText primary="注册" />
                        </ListItem>
                    </div>
                )}
                {pathHelper.isSharePage(this.props.location.pathname) && (
                    <div className={classes.stickFooter}>
                        <Divider />
                        <a
                            className={classes.shareInfoContainer}
                            href={"/Profile/" + window.shareInfo.ownerUid}
                        >
                            <Avatar
                                src={
                                    "/Member/Avatar/" +
                                    window.shareInfo.ownerUid +
                                    "/l"
                                }
                                className={classes.shareAvatar}
                            />
                            <div className={classes.ownerInfo}>
                                <Typography noWrap>
                                    {window.shareInfo.ownerNick}
                                </Typography>
                                <Typography
                                    noWrap
                                    variant="caption"
                                    color="textSecondary"
                                >
                                    分享于{window.shareInfo.shareDate}
                                </Typography>
                            </div>
                        </a>
                    </div>
                )}
            </div>
        );
        const iOS =
            process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
        return (
            <div>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                    color={
                        this.props.selected.length <= 1 &&
                        !(!this.props.isMultiple && this.props.withFile)
                            ? "primary"
                            : "default"
                    }
                >
                    <Toolbar>
                        {((this.props.selected.length <= 1 &&
                            !(!this.props.isMultiple && this.props.withFile)) ||
                            !pathHelper.isHomePage(
                                this.props.location.pathname
                            )) &&
                            !pathHelper.isSharePage(
                                this.props.location.pathname
                            ) && (
                                <IconButton
                                    color="inherit"
                                    aria-label="Open drawer"
                                    onClick={this.handleDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        {((this.props.selected.length <= 1 &&
                            !(!this.props.isMultiple && this.props.withFile)) ||
                            !pathHelper.isHomePage(
                                this.props.location.pathname
                            )) &&
                            !pathHelper.isSharePage(
                                this.props.location.pathname
                            ) && (
                                <IconButton
                                    color="inherit"
                                    aria-label="Open drawer"
                                    onClick={() =>
                                        this.props.handleDesktopToggle(
                                            !this.props.desktopOpen
                                        )
                                    }
                                    className={classes.menuButtonDesktop}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        {(this.props.selected.length > 1 ||
                            (!this.props.isMultiple && this.props.withFile)) &&
                            (pathHelper.isHomePage(
                                this.props.location.pathname
                            ) ||
                                pathHelper.isSharePage(
                                    this.props.location.pathname
                                )) && (
                                <Grow
                                    in={
                                        this.props.selected.length > 1 ||
                                        (!this.props.isMultiple &&
                                            this.props.withFile)
                                    }
                                >
                                    <IconButton
                                        color="inherit"
                                        className={classes.menuIcon}
                                        onClick={() =>
                                            this.props.setSelectedTarget([])
                                        }
                                    >
                                        <BackIcon />
                                    </IconButton>
                                </Grow>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && (
                                <Typography variant="h6" color="inherit" noWrap>
                                    {pathHelper.isSharePage(
                                        this.props.location.pathname
                                    ) &&
                                        window.pageId === "" && (
                                            <FolderShared
                                                className={
                                                    classes.folderShareIcon
                                                }
                                            />
                                        )}
                                    {this.props.subTitle?this.props.subTitle : this.props.title}
                                </Typography>
                            )}

                        {!this.props.isMultiple &&
                            this.props.withFile &&
                            !pathHelper.isMobile() && (
                                <Typography variant="h6" color="inherit" noWrap>
                                    {this.props.selected[0].name}{" "}
                                    {(pathHelper.isHomePage(
                                        this.props.location.pathname
                                    ) ||
                                        pathHelper.isSharePage(
                                            this.props.location.pathname
                                        )) &&
                                        "(" +
                                            sizeToString(
                                                this.props.selected[0].size
                                            ) +
                                            ")"}
                                </Typography>
                            )}

                        {this.props.selected.length > 1 &&
                            !pathHelper.isMobile() && (
                                <Typography variant="h6" color="inherit" noWrap>
                                    {this.props.selected.length}个对象
                                </Typography>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && <SezrchBar />}
                        <div className={classes.grow} />
                        {(this.props.selected.length > 1 ||
                            (!this.props.isMultiple && this.props.withFile)) &&
                            !pathHelper.isHomePage(
                                this.props.location.pathname
                            ) &&
                            !pathHelper.isSharePage(
                                this.props.location.pathname
                            ) &&
                            Auth.Check() &&
                            !checkGetParameters("share") && (
                                <div className={classes.sectionForFile}>
                                    <Tooltip title="保存">
                                        <IconButton
                                            color="inherit"
                                            onClick={() =>
                                                this.props.saveFile()
                                            }
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )}
                        {(this.props.selected.length > 1 ||
                            (!this.props.isMultiple && this.props.withFile)) &&
                            (pathHelper.isHomePage(
                                this.props.location.pathname
                            ) ||
                                pathHelper.isSharePage(
                                    this.props.location.pathname
                                )) && (
                                <div className={classes.sectionForFile}>
                                    {!this.props.isMultiple &&
                                        this.props.withFile &&
                                        isPreviewable(
                                            this.props.selected[0].name
                                        ) && (
                                            <Grow
                                                in={
                                                    !this.props.isMultiple &&
                                                    this.props.withFile &&
                                                    isPreviewable(
                                                        this.props.selected[0]
                                                            .name
                                                    )
                                                }
                                            >
                                                <Tooltip title="打开">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.openPreview()
                                                        }
                                                    >
                                                        <OpenIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {!this.props.isMultiple &&
                                        this.props.withFile && (
                                            <Grow
                                                in={
                                                    !this.props.isMultiple &&
                                                    this.props.withFile
                                                }
                                            >
                                                <Tooltip title="下载">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.openDownload()
                                                        }
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {(this.props.isMultiple || this.props.withFolder) &&
                                    user.group.allowArchiveDownload && (
                                        <Grow
                                            in={
                                                (this.props.isMultiple || this.props.withFolder) &&
                                                user.group.allowArchiveDownload
                                            }
                                        >
                                            <Tooltip title="打包下载">
                                                <IconButton
                                                    color="inherit"
                                                    onClick={() =>
                                                        this.archiveDownload()
                                                    }
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grow>
                                    )}

                                    {!this.props.isMultiple &&
                                        this.props.withFolder && (
                                            <Grow
                                                in={
                                                    !this.props.isMultiple &&
                                                    this.props.withFolder
                                                }
                                            >
                                                <Tooltip title="进入目录">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.props.navitateTo(
                                                                this.props
                                                                    .path ===
                                                                    "/"
                                                                    ? this.props
                                                                          .path +
                                                                          this
                                                                              .props
                                                                              .selected[0]
                                                                              .name
                                                                    : this.props
                                                                          .path +
                                                                          "/" +
                                                                          this
                                                                              .props
                                                                              .selected[0]
                                                                              .name
                                                            )
                                                        }
                                                    >
                                                        <OpenFolderIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {!this.props.isMultiple &&
                                        !pathHelper.isSharePage(
                                            this.props.location.pathname
                                        ) && (
                                            <Grow in={!this.props.isMultiple}>
                                                <Tooltip title="分享">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.props.openShareDialog()
                                                        }
                                                    >
                                                        <ShareIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {!this.props.isMultiple &&
                                        !pathHelper.isSharePage(
                                            this.props.location.pathname
                                        ) && (
                                            <Grow in={!this.props.isMultiple}>
                                                <Tooltip title="重命名">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.props.openRenameDialog()
                                                        }
                                                    >
                                                        <RenameIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        )}
                                    {!pathHelper.isSharePage(
                                        this.props.location.pathname
                                    ) && (
                                        <div>
                                            {!pathHelper.isMobile() && (
                                                <Grow
                                                    in={
                                                        this.props.selected
                                                            .length !== 0 &&
                                                        !pathHelper.isMobile()
                                                    }
                                                >
                                                    <Tooltip title="移动">
                                                        <IconButton
                                                            color="inherit"
                                                            onClick={() =>
                                                                this.props.openMoveDialog()
                                                            }
                                                        >
                                                            <MoveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grow>
                                            )}

                                            <Grow
                                                in={
                                                    this.props.selected
                                                        .length !== 0
                                                }
                                            >
                                                <Tooltip title="删除">
                                                    <IconButton
                                                        color="inherit"
                                                        onClick={() =>
                                                            this.props.openRemoveDialog()
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grow>
                                        </div>
                                    )}
                                </div>
                            )}
                        {this.props.selected.length <= 1 &&
                            !(
                                !this.props.isMultiple && this.props.withFile
                            ) && <UserAvatar />}
                    </Toolbar>
                </AppBar>
                {this.loadUploader()}

                <Hidden smUp implementation="css">
                    <SwipeableDrawer
                        container={this.props.container}
                        variant="temporary"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        anchor="left"
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        onOpen={() =>
                            this.setState(state => ({ mobileOpen: true }))
                        }
                        disableDiscovery={iOS}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classNames({
                                [classes.drawerOpen]: this.props.desktopOpen,
                                [classes.drawerClose]: !this.props.desktopOpen
                            })
                        }}
                        className={classNames(classes.drawer, {
                            [classes.drawerOpen]: this.props.desktopOpen,
                            [classes.drawerClose]: !this.props.desktopOpen
                        })}
                        variant="persistent"
                        anchor="left"
                        open={this.props.desktopOpen}
                    >
                        <div className={classes.toolbar} />
                        {drawer}
                    </Drawer>
                </Hidden>
            </div>
        );
    }
}
NavbarCompoment.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const Navbar = connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme(withStyles(styles)(withRouter(NavbarCompoment))));

export default Navbar;
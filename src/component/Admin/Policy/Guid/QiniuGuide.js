import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { toggleSnackbar } from "../../../../actions";
import API from "../../../../middleware/Api";
import { getNumber } from "../../../../utils";
import DomainInput from "../../Common/DomainInput";
import SizeInput from "../../Common/SizeInput";
import MagicVar from "../../Dialogs/MagicVar";

const useStyles = makeStyles((theme) => ({
    stepContent: {
        padding: "16px 32px 16px 32px",
    },
    form: {
        maxWidth: 400,
        marginTop: 20,
    },
    formContainer: {
        [theme.breakpoints.up("md")]: {
            padding: "0px 24px 0 24px",
        },
    },
    subStepContainer: {
        display: "flex",
        marginBottom: 20,
        padding: 10,
        transition: theme.transitions.create("background-color", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        "&:focus-within": {
            backgroundColor: theme.palette.background.default,
        },
    },
    stepNumber: {
        width: 20,
        height: 20,
        backgroundColor: lighten(theme.palette.secondary.light, 0.2),
        color: theme.palette.secondary.contrastText,
        textAlign: "center",
        borderRadius: " 50%",
    },
    stepNumberContainer: {
        marginRight: 10,
    },
    stepFooter: {
        marginTop: 32,
    },
    button: {
        marginRight: theme.spacing(1),
    },
}));

const steps = [
    {
        title: "????????????",
        optional: false,
    },
    {
        title: "????????????",
        optional: false,
    },
    {
        title: "????????????",
        optional: false,
    },
    {
        title: "????????????",
        optional: false,
    },
    {
        title: "??????",
        optional: false,
    },
];

export default function RemoteGuide(props) {
    const classes = useStyles();
    const history = useHistory();

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [skipped] = React.useState(new Set());
    const [magicVar, setMagicVar] = useState("");
    // const [useCDN, setUseCDN] = useState("false");
    const [policy, setPolicy] = useState(
        props.policy
            ? props.policy
            : {
                  Type: "qiniu",
                  Name: "",
                  SecretKey: "",
                  AccessKey: "",
                  BaseURL: "",
                  IsPrivate: "true",
                  DirNameRule: "uploads/{year}/{month}/{day}",
                  AutoRename: "true",
                  FileNameRule: "{randomkey8}_{originname}",
                  IsOriginLinkEnable: "false",
                  MaxSize: "0",
                  OptionsSerialized: {
                      file_type: "",
                      mimetype: "",
                  },
              }
    );

    const handleChange = (name) => (event) => {
        setPolicy({
            ...policy,
            [name]: event.target.value,
        });
    };

    const handleOptionChange = (name) => (event) => {
        setPolicy({
            ...policy,
            OptionsSerialized: {
                ...policy.OptionsSerialized,
                [name]: event.target.value,
            },
        });
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch]
    );

    const submitPolicy = (e) => {
        e.preventDefault();
        setLoading(true);

        const policyCopy = { ...policy };
        policyCopy.OptionsSerialized = { ...policyCopy.OptionsSerialized };

        // ????????????
        policyCopy.AutoRename = policyCopy.AutoRename === "true";
        policyCopy.IsOriginLinkEnable =
            policyCopy.IsOriginLinkEnable === "true";
        policyCopy.IsPrivate = policyCopy.IsPrivate === "true";
        policyCopy.MaxSize = parseInt(policyCopy.MaxSize);
        policyCopy.OptionsSerialized.file_type = policyCopy.OptionsSerialized.file_type.split(
            ","
        );
        if (
            policyCopy.OptionsSerialized.file_type.length === 1 &&
            policyCopy.OptionsSerialized.file_type[0] === ""
        ) {
            policyCopy.OptionsSerialized.file_type = [];
        }

        API.post("/admin/policy", {
            policy: policyCopy,
        })
            .then(() => {
                ToggleSnackbar(
                    "top",
                    "right",
                    "???????????????" + (props.policy ? "??????" : "??????"),
                    "success"
                );
                setActiveStep(5);
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
            })
            .then(() => {
                setLoading(false);
            });

        setLoading(false);
    };

    return (
        <div>
            <Typography variant={"h6"}>
                {props.policy ? "??????" : "??????"} ?????? ????????????
            </Typography>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (label.optional) {
                        labelProps.optional = (
                            <Typography variant="caption">??????</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label.title} {...stepProps}>
                            <StepLabel {...labelProps}>{label.title}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            {activeStep === 0 && (
                <form
                    className={classes.stepContent}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setActiveStep(1);
                    }}
                >
                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>0</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ???????????????????????????????????????????????? ???????????? -
                                ???????????? - ??????URL ???????????? ??????????????????????????????
                                <strong>???????????????????????????</strong>???
                            </Typography>
                        </div>
                    </div>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>1</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ??????
                                <Link
                                    href={"https://portal.qiniu.com/create"}
                                    target={"_blank"}
                                >
                                    ??????????????????
                                </Link>
                                ???????????????????????????
                            </Typography>
                        </div>
                    </div>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>2</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ????????????????????????????????????????????????????????????????????????????????????
                            </Typography>
                            <div className={classes.form}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="component-helper">
                                        ??????????????????
                                    </InputLabel>
                                    <Input
                                        required
                                        value={policy.BucketName}
                                        onChange={handleChange("BucketName")}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>3</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                            </Typography>
                            <div className={classes.form}>
                                <FormControl required component="fieldset">
                                    <RadioGroup
                                        required
                                        value={policy.IsPrivate}
                                        onChange={handleChange("IsPrivate")}
                                        row
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                        <FormControlLabel
                                            value={"false"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>4</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ????????????????????????????????? CDN ???????????????
                            </Typography>
                            <div className={classes.form}>
                                <DomainInput
                                    value={policy.BaseURL}
                                    onChange={handleChange("BaseURL")}
                                    required
                                    label={"CDN ????????????"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>5</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ??????????????????????????? ???????????? -
                                ?????????????????????????????????????????? AK???SK???
                            </Typography>
                            <div className={classes.form}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="component-helper">
                                        AK
                                    </InputLabel>
                                    <Input
                                        required
                                        value={policy.AccessKey}
                                        onChange={handleChange("AccessKey")}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.form}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="component-helper">
                                        SK
                                    </InputLabel>
                                    <Input
                                        required
                                        value={policy.SecretKey}
                                        onChange={handleChange("SecretKey")}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <div className={classes.stepFooter}>
                        <Button
                            disabled={loading}
                            type={"submit"}
                            variant={"contained"}
                            color={"primary"}
                        >
                            ?????????
                        </Button>
                    </div>
                </form>
            )}

            {activeStep === 1 && (
                <form
                    className={classes.stepContent}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setActiveStep(2);
                    }}
                >
                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>1</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ????????????????????????????????????????????????????????????????????????????????????????????????
                                ?????????
                                Cloudreve??????????????????????????????????????????????????????????????????????????????????????????????????????
                                ???????????????????????????{" "}
                                <Link
                                    color={"secondary"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMagicVar("path");
                                    }}
                                >
                                    ????????????????????????
                                </Link>{" "}
                                ???
                            </Typography>
                            <div className={classes.form}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="component-helper">
                                        ????????????
                                    </InputLabel>
                                    <Input
                                        required
                                        value={policy.DirNameRule}
                                        onChange={handleChange("DirNameRule")}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>2</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                ????????????????????????????????????????????????
                                ???????????????????????????{" "}
                                <Link
                                    color={"secondary"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMagicVar("file");
                                    }}
                                >
                                    ???????????????????????????
                                </Link>{" "}
                                ???
                            </Typography>
                            <div className={classes.form}>
                                <FormControl required component="fieldset">
                                    <RadioGroup
                                        aria-label="gender"
                                        name="gender1"
                                        value={policy.AutoRename}
                                        onChange={handleChange("AutoRename")}
                                        row
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="???????????????"
                                        />
                                        <FormControlLabel
                                            value={"false"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="?????????"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <Collapse in={policy.AutoRename === "true"}>
                                <div className={classes.form}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="component-helper">
                                            ????????????
                                        </InputLabel>
                                        <Input
                                            required={
                                                policy.AutoRename === "true"
                                            }
                                            value={policy.FileNameRule}
                                            onChange={handleChange(
                                                "FileNameRule"
                                            )}
                                        />
                                    </FormControl>
                                </div>
                            </Collapse>
                        </div>
                    </div>

                    <div className={classes.stepFooter}>
                        <Button
                            color={"default"}
                            className={classes.button}
                            onClick={() => setActiveStep(0)}
                        >
                            ?????????
                        </Button>
                        <Button
                            disabled={loading}
                            type={"submit"}
                            variant={"contained"}
                            color={"primary"}
                        >
                            ?????????
                        </Button>
                    </div>
                </form>
            )}

            {activeStep === 2 && (
                <form
                    className={classes.stepContent}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setActiveStep(3);
                    }}
                >
                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>1</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ???????????????????????????????????????
                                <br />
                                ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
                            </Typography>

                            <div className={classes.form}>
                                <FormControl required component="fieldset">
                                    <RadioGroup
                                        required
                                        value={policy.IsOriginLinkEnable}
                                        onChange={(e) => {
                                            if (
                                                policy.IsPrivate === "true" &&
                                                e.target.value === "true"
                                            ) {
                                                ToggleSnackbar(
                                                    "top",
                                                    "right",
                                                    "?????????????????????????????????",
                                                    "warning"
                                                );
                                                return;
                                            }
                                            handleChange("IsOriginLinkEnable")(
                                                e
                                            );
                                        }}
                                        row
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                        <FormControlLabel
                                            value={"false"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <div className={classes.stepFooter}>
                        <Button
                            color={"default"}
                            className={classes.button}
                            onClick={() => setActiveStep(1)}
                        >
                            ?????????
                        </Button>{" "}
                        <Button
                            disabled={loading}
                            type={"submit"}
                            variant={"contained"}
                            color={"primary"}
                        >
                            ?????????
                        </Button>
                    </div>
                </form>
            )}

            {activeStep === 3 && (
                <form
                    className={classes.stepContent}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setActiveStep(4);
                    }}
                >
                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>1</div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ???????????????????????????????????????
                            </Typography>

                            <div className={classes.form}>
                                <FormControl required component="fieldset">
                                    <RadioGroup
                                        required
                                        value={
                                            policy.MaxSize === "0"
                                                ? "false"
                                                : "true"
                                        }
                                        onChange={(e) => {
                                            if (e.target.value === "true") {
                                                setPolicy({
                                                    ...policy,
                                                    MaxSize: "10485760",
                                                });
                                            } else {
                                                setPolicy({
                                                    ...policy,
                                                    MaxSize: "0",
                                                });
                                            }
                                        }}
                                        row
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                        <FormControlLabel
                                            value={"false"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="?????????"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <Collapse in={policy.MaxSize !== "0"}>
                        <div className={classes.subStepContainer}>
                            <div className={classes.stepNumberContainer}>
                                <div className={classes.stepNumber}>2</div>
                            </div>
                            <div className={classes.subStepContent}>
                                <Typography variant={"body2"}>
                                    ???????????????
                                </Typography>
                                <div className={classes.form}>
                                    <SizeInput
                                        value={policy.MaxSize}
                                        onChange={handleChange("MaxSize")}
                                        min={0}
                                        max={9223372036854775807}
                                        label={"?????????????????????"}
                                    />
                                </div>
                            </div>
                        </div>
                    </Collapse>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>
                                {policy.MaxSize !== "0" ? "3" : "2"}
                            </div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ????????????????????????????????????
                            </Typography>

                            <div className={classes.form}>
                                <FormControl required component="fieldset">
                                    <RadioGroup
                                        required
                                        value={
                                            policy.OptionsSerialized
                                                .file_type === ""
                                                ? "false"
                                                : "true"
                                        }
                                        onChange={(e) => {
                                            if (e.target.value === "true") {
                                                setPolicy({
                                                    ...policy,
                                                    OptionsSerialized: {
                                                        ...policy.OptionsSerialized,
                                                        file_type:
                                                            "jpg,png,mp4,zip,rar",
                                                    },
                                                });
                                            } else {
                                                setPolicy({
                                                    ...policy,
                                                    OptionsSerialized: {
                                                        ...policy.OptionsSerialized,
                                                        file_type: "",
                                                    },
                                                });
                                            }
                                        }}
                                        row
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                        <FormControlLabel
                                            value={"false"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="?????????"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <Collapse in={policy.OptionsSerialized.file_type !== ""}>
                        <div className={classes.subStepContainer}>
                            <div className={classes.stepNumberContainer}>
                                <div className={classes.stepNumber}>
                                    {policy.MaxSize !== "0" ? "4" : "3"}
                                </div>
                            </div>
                            <div className={classes.subStepContent}>
                                <Typography variant={"body2"}>
                                    ??????????????????????????????????????????????????????????????? ,
                                    ??????
                                </Typography>
                                <div className={classes.form}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="component-helper">
                                            ???????????????
                                        </InputLabel>
                                        <Input
                                            value={
                                                policy.OptionsSerialized
                                                    .file_type
                                            }
                                            onChange={handleOptionChange(
                                                "file_type"
                                            )}
                                        />
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </Collapse>

                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}>
                            <div className={classes.stepNumber}>
                                {getNumber(3, [
                                    policy.MaxSize !== "0",
                                    policy.OptionsSerialized.file_type !== "",
                                ])}
                            </div>
                        </div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ???????????????????????? MimeType???
                            </Typography>

                            <div className={classes.form}>
                                <FormControl required component="fieldset">
                                    <RadioGroup
                                        required
                                        value={
                                            policy.OptionsSerialized
                                                .mimetype === ""
                                                ? "false"
                                                : "true"
                                        }
                                        onChange={(e) => {
                                            if (e.target.value === "true") {
                                                setPolicy({
                                                    ...policy,
                                                    OptionsSerialized: {
                                                        ...policy.OptionsSerialized,
                                                        mimetype: "image/*",
                                                    },
                                                });
                                            } else {
                                                setPolicy({
                                                    ...policy,
                                                    OptionsSerialized: {
                                                        ...policy.OptionsSerialized,
                                                        mimetype: "",
                                                    },
                                                });
                                            }
                                        }}
                                        row
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="??????"
                                        />
                                        <FormControlLabel
                                            value={"false"}
                                            control={
                                                <Radio color={"primary"} />
                                            }
                                            label="?????????"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    <Collapse in={policy.OptionsSerialized.mimetype !== ""}>
                        <div className={classes.subStepContainer}>
                            <div className={classes.stepNumberContainer}>
                                <div className={classes.stepNumber}>
                                    {getNumber(4, [
                                        policy.MaxSize !== "0",
                                        policy.OptionsSerialized.file_type !==
                                            "",
                                    ])}
                                </div>
                            </div>
                            <div className={classes.subStepContent}>
                                <Typography variant={"body2"}>
                                    ????????????????????? MimeType??????????????????????????? ,
                                    ??????????????????????????????????????????????????????
                                    MimeType????????????????????????????????????????????????????????????????????????
                                </Typography>
                                <div className={classes.form}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="component-helper">
                                            MimeType ??????
                                        </InputLabel>
                                        <Input
                                            value={
                                                policy.OptionsSerialized
                                                    .mimetype
                                            }
                                            onChange={handleOptionChange(
                                                "mimetype"
                                            )}
                                        />
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </Collapse>

                    <div className={classes.stepFooter}>
                        <Button
                            color={"default"}
                            className={classes.button}
                            onClick={() => setActiveStep(2)}
                        >
                            ?????????
                        </Button>{" "}
                        <Button
                            disabled={loading}
                            type={"submit"}
                            variant={"contained"}
                            color={"primary"}
                        >
                            ?????????
                        </Button>
                    </div>
                </form>
            )}

            {activeStep === 4 && (
                <form className={classes.stepContent} onSubmit={submitPolicy}>
                    <div className={classes.subStepContainer}>
                        <div className={classes.stepNumberContainer}></div>
                        <div className={classes.subStepContent}>
                            <Typography variant={"body2"}>
                                ??????????????????????????????????????????
                            </Typography>
                            <div className={classes.form}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="component-helper">
                                        ???????????????
                                    </InputLabel>
                                    <Input
                                        required
                                        value={policy.Name}
                                        onChange={handleChange("Name")}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className={classes.stepFooter}>
                        <Button
                            color={"default"}
                            className={classes.button}
                            onClick={() => setActiveStep(3)}
                        >
                            ?????????
                        </Button>{" "}
                        <Button
                            disabled={loading}
                            type={"submit"}
                            variant={"contained"}
                            color={"primary"}
                        >
                            ??????
                        </Button>
                    </div>
                </form>
            )}

            {activeStep === 5 && (
                <>
                    <form className={classes.stepContent}>
                        <Typography>
                            ???????????????{props.policy ? "??????" : "??????"}???
                        </Typography>
                        <Typography variant={"body2"} color={"textSecondary"}>
                            ???????????????????????????????????????????????????????????????????????????????????????????????????
                        </Typography>
                    </form>
                    <div className={classes.stepFooter}>
                        <Button
                            color={"primary"}
                            className={classes.button}
                            onClick={() => history.push("/admin/policy")}
                        >
                            ????????????????????????
                        </Button>
                    </div>
                </>
            )}

            <MagicVar
                open={magicVar === "file"}
                isFile
                onClose={() => setMagicVar("")}
            />
            <MagicVar
                open={magicVar === "path"}
                onClose={() => setMagicVar("")}
            />
        </div>
    );
}

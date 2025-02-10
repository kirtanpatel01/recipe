import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token!",
        );
    }
}

const userRegister = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(409, "Both fields required!");
    }

    if (password.length < 6) {
        throw new ApiError(409, "Password must be greater than 6 characters!");
    } else if (password.length > 16) {
        throw new ApiError(409, "Password must be less than 16 characters!");
    }

    if (!/[A-Z]/.test(password)) {
        throw new ApiError(
            409,
            "Password must be contain at least one CAPITAL letter!",
        );
    }

    if (!/[0-9]/.test(password)) {
        throw new ApiError(
            409,
            "Password must be contain at least one numeric value!",
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists with this email adderss!");
    }

    const user = await User.create({ email, password });
    if (!user) {
        throw new ApiError(500, "Error while registering the user!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const newUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("recipe_accessToken", accessToken, options)
        .cookie("recipe_refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: newUser,
                    accessToken,
                    refreshToken,
                },
                "User registered successfully!",
            ),
        );
});

const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(401, "Both fields are required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User doesn't exists with this credential!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid password!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id,
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
    );

    return res
        .status(200)
        .cookie("recipe_accessToken", accessToken, options)
        .cookie("recipe_refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User login working!",
            ),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        },
    );

    res.status(200)
        .clearCookie("recipe_accessToken")
        .clearCookie("recipe_refreshToken")
        .json(new ApiResponse(200, {}, "User successfully logged out!"));
});

export { userRegister, userLogin, logoutUser };

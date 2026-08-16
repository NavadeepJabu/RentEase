import User from "../models/User.js";

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const updateProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.fullName = req.body.fullName || user.fullName;
        user.phone = req.body.phone || user.phone;
        user.city = req.body.city || user.city;
        user.address = req.body.address || user.address;

        await user.save();

const updatedUser = await User.findById(user._id).select("-password");

return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser
});

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const uploadProfileImage = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.profileImage = `/uploads/profiles/${req.file.filename}`;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
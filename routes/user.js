import express from "express";
import User from '../models/User.js';

const router = express.Router();

// GET ALL USERS
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        
        res.status(200).json({ 
            success: true, 
            message: 'Get all user successfully!', 
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})

// GET USER
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        res.status(200).json({ 
            success: true, 
            message: 'Get user successfully!', 
            data: user 
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// Middleware kiểm tra xem yêu cầu có chứa thông tin người dùng hợp lệ hay không
const validateUser = (req, res, next) => {
    const { userName, email } = req.body;
    
    if (!userName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Username or email are required'
        });
    }
    // Nếu thông tin người dùng hợp lệ, tiếp tục xử lý yêu cầu
    next();
};
// ADD USER
// Sử dụng middleware validateUser cho route '/create' (thêm người dùng)
router.post('/create', validateUser, async (req, res) => {
    const { userName, email } = req.body;

    try {
        // Kiểm tra userName hoặc email của user mới thêm có tồn tại hay chưa
        const existUserName = await User.findOne({ userName: userName });
        const existEmail = await User.findOne({ email: email });

        if (existUserName || existEmail) {
            res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        } else {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();

            res.status(200).json({
                success: true,
                message: 'Add user successfully!',
                user: savedUser
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
// EDIT USER
router.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { userName, email } = req.body;

    try {
        const existUserName = await User.findOne({ userName: userName });
        const existEmail = await User.findOne({ email: email });

        if(!existUserName && !existEmail) { 
            const userUpdated = await User.findOneAndUpdate(
                { _id: id },
                { ...req.body },
                { new: true }
            )

            res.status(200).json({
                success: true,
                message: 'Update user successfully!',
                data: userUpdated
             });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Username or email already exist',
             });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})

// DELETE USER
router.delete('/delete/:id', async (req, res) => {
    try {
        const userDeleted = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Delete user successfully!',
            data: userDeleted
         });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

    
});

export default router
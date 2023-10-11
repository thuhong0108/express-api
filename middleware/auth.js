export const validateUser = (req, res, next) => {
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
// Middleware สำหรับตรวจสอบการ login
export function checkLogin(req, res, next) {
  if (req.cookies && req.cookies.userId) {
    next();
  } else {
    res.status(401).json({ message: "กรุณา login ก่อนใช้งาน" });
  }
}
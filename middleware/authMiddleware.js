import jwt from "jsonwebtoken";

// checkRole 함수 정의
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "접근 권한이 없습니다." });
    }
  };
};

const authenticationMiddleware = (req, res, next) => {
  const token = req.cookies.adminCookie ?? req.cookies.userCookie;
  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "토큰이 만료되었습니다. 다시 로그인 해주세요." });
      }
      if (err.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "유효하지 않은 토큰입니다. 다시 로그인 해주세요." });
      }
      return next(err);
    }
    req.user = decoded;
    next();
  });
};

export { checkRole, authenticationMiddleware };

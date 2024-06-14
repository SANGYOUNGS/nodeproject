import jwt from 'jsonwebtoken';

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

    // 인증된 사용자의 역할에 따라 권한 부여
    if (decoded.role === 'admin') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    if (decoded.role === 'user') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
  });
};

export { authenticationMiddleware };

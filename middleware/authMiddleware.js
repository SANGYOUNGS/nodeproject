import jwt from 'jsonwebtoken'; 

const authenticationMiddleware =(req, res, next) => {
  const token =
  req.cookies.token || req.cookies.userCookie || req.cookies.adminCookie;
  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = userInfo;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "토큰이 만료되었습니다. 다시 로그인 해주세요." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "유효하지 않은 토큰입니다. 다시 로그인 해주세요." });
    }
    res.status(500).json({ message: "서버 에러" });
  }
};

      const checkRole = (req, res, next) => {
        const { user } = res.locals;
        if (user.role === "admin") {
          next();
        } else {
        const error = new Error("관리자 권한이 필요합니다.");
        error.statusCode = 403;
        next(error);
        }
      };

      export { authenticationMiddleware, checkRole};
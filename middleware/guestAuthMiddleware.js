import jwt from 'jsonwebtoken';

const guestAuthMiddleware = (req, res, next) => {
    const token = req.cookies.guestCookie;
    if(!token) {
        return res.status(401).json({ message: '비회원 전용 페이지입니다. 로그인 해주세요.'});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.role !== 'guest') {
            return res.status(403).json({ message: '비회원 전용 페이지입니다. 접근할 수 없습니다.'});
        }
        next();
    } catch(error) {
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

    export default guestAuthMiddleware;

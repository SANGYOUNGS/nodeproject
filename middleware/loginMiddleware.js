authenticationMiddleware =(req, res, next) => {
    const { token } = req.cookies;
    try {
        const secretKey = process.env.JWT_SECRET_KEY || 'jwt-secret-key';
        const userInfo = jwt.verify(token, secretKey);
      // { em: "team2@gmail.com", ro: "user"}
  
      // 토큰 검증이 성공적으로 완료되면 토큰에 담긴 값을 이후 request handler에서도 사용할수 있도록 임시 저장소인 res.locals에 등록
      res.locals.user = userInfo;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({
          error: "토큰이 만료되었습니다. 다시 로그인 해주세요.",
          data: null,
        });
        return;
      } else if (error.name === "JsonWebTokenError") {
        res.status(401).json({
          error: "유효하지 않은 토큰입니다. 다시 로그인 해주세요.",
          data: null,
        });
        return;
      }
      res.status(500).json({
        error: "서버 에러",
        data: null,
      });
    }
}
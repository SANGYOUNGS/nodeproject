// 관리자 인증 미들웨어
export const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("인증이 필요합니다.");
    }
    if (req.user.role !== 'admin') {
      return res.status(403).send("접근 권한이 없습니다.");
    }
    next();
  };
  
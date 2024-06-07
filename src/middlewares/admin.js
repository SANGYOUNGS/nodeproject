const admin = (req, res, next) => {

    try {
        const userRole = req.userRole;
        console.log(userRole);

        if(userRole !== 'admin') {
            res.status(403).json({
                result : 'forbidden-approach',
                reason: '접근 권한이 없는 페이지입니다.'
            });
            return;
        }

        next();
    } catch(e) {
        next(e);
    }
}

export { admin };
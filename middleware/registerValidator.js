import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("name")
    .not().isEmpty().withMessage("이름은 필수 항목입니다.")
    .isLength({ max: 10 }).withMessage("이름은 최대 10자까지 허용됩니다."),
  body("email")
    .isEmail().withMessage("유효한 이메일 주소를 입력해 주세요."),
  body("password")
    .isLength({ min: 6 }).withMessage("비밀번호는 최소 6자 이상이어야 합니다."),
  body("phoneNumber")
    .optional()
    .isMobilePhone().withMessage("유효한 전화번호를 입력해 주세요."),
];

export const formatValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;  // 첫 번째 에러 메시지 추출
    return res.status(400).json({ message: firstError });
  }
  next();
};

export default { registerValidator, formatValidationErrors };
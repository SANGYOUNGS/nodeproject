import { body } from 'express-validator';

const productValidationRules = [
    body('name').optional().notEmpty().withMessage('상품 이름은 필수입니다.'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('가격을 확인해주세요.'),
    body('description').optional().isString().withMessage('설명은 문자열이어야 합니다.'),
    body('longdescription').optional().isString().withMessage('긴 설명은 문자열이어야 합니다.'),
    body('brand').optional().isMongoId().withMessage('유효한 브랜드 ID여야 합니다.'),
    body('category').optional().isMongoId().withMessage('유효한 카테고리 ID여야 합니다.')
];

export default productValidationRules;
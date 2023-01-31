const CREATED_CODE = 201;
const DEFAULT_ERROR_CODE = 500;

const AUTH_ERROR_MESSAGE = 'Неправильные почта или пароль';
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';
const NOT_FOUND_CARD_MESSAGE = 'Передан несуществующий _id карточки.';
const NOT_FOUND_USER_MESSAGE = 'Пользователь по указанному _id не найден.';
const INCORRECT_ERROR_MESSAGE = 'Переданы некорректные данные';
const DEFAULT_ERROR_MESSAGE = 'Ошибка по умолчанию.';

module.exports = {
  CREATED_CODE,
  DEFAULT_ERROR_CODE,
  NOT_FOUND_CARD_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  INCORRECT_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  AUTH_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
};

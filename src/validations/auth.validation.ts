import joi from "joi";

class Auth {
  static signup = joi.object({
    name: joi.string().lowercase().required(),
    email: joi.string().lowercase().required(),
    password: joi.string().required(),
    image: joi.any(),
  });

  static login = joi.object({
    email: joi.string().lowercase().required(),
    password: joi.string().required(),
  });

  static email = joi.object({
    email: joi
      .string()
      .lowercase()
      .required()
      .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
  });

  static setNewPassword = joi.object({
    password: joi
      .string()
      .required()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    code: joi.string().required().trim(),
  });
}

export default Auth;

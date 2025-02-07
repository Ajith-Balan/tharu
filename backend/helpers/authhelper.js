<<<<<<< HEAD
import bcrypt from "bcryptjs";
=======
import bcrypt from "bcrypt.js";
>>>>>>> 9fb45e36d4d6eb8f959998b324dc1a7e8620eb83

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

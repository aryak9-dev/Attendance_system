import userApi from './userApi';

export const login = async ({ registrationNumber, password }) => {
  if (!registrationNumber?.trim()) {
    throw new Error("Registration number is required.");
  }

  if (!password?.trim()) {
    throw new Error("Password is required.");
  }

  const user = await userApi.getUserByRegistrationNumber(registrationNumber);

  if (!user) {
    throw new Error("User not found.");
  }

  // IMPORTANT:
  // Current backend contract does not expose a login endpoint.
  // Password verification must eventually be handled by the backend.
  return user;
};

export const register = async (data) => {
  return userApi.createUser(data);
};

export default { login, register };
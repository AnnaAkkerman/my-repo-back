import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { Models } from '../db/models/index.js';
import { HttpError } from '../utils/HttpError.js';
import { NewSession } from '../utils/NewSession.js';
import { env } from '../utils/env.js';
import { ENV_VARS, JWT, SMTP } from '../constants/constants.js';
import { sendEmail } from '../utils/sendMail.js';
import { googleOauth } from '../utils/googleOauth.js';

const registerUser = async (payload) => {
  const user = await Models.UserModel.findOne({ email: payload.email });
  if (user) throw HttpError(409, 'Email has had already in use!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await Models.UserModel.create({
    ...payload,
    password: encryptedPassword,
  });
};

const loginUser = async (payload) => {
  const user = await Models.UserModel.findOne({ email: payload.email });
  if (!user) throw HttpError(404, 'User was not found!');

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordEqual) throw HttpError(401, 'Unauthorized!');

  await Models.SessionModel.deleteOne({ userId: user.id });

  return await Models.SessionModel.create(NewSession(user.id));
};

const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Models.SessionModel.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw HttpError(401, 'The session was not found!');

  const isTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isTokenExpired)
    throw HttpError(401, 'The refresh session token has expired!');

  await Models.SessionModel.findOneAndDelete({
    _id: sessionId,
    refreshToken,
  });
  const newSession = NewSession(session.userId);

  return await Models.SessionModel.create({ ...newSession });
};

const logoutUser = async ({ sessionId, refreshToken }) => {
  if (!sessionId) throw HttpError(400, 'The session data was not provided!');
  await Models.SessionModel.deleteOne({ _id: sessionId, refreshToken });
};
const requestResetPassword = async (email) => {
  const user = await Models.UserModel.findOne({ email });
  if (!user) throw HttpError(404, 'The user hasn`t been found!');

  const resetToken = jwt.sign({ sub: user.id, email }, env(JWT.SECRET), {
    expiresIn: '5m',
  });

  try {
    await sendEmail({
      from: env(SMTP.FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${env(
        ENV_VARS.APP_DOMAIN,
      )}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error);
    throw HttpError(500, 'Failed to send the email, please try again later');
  }
};

const resetPwd = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env(JWT.SECRET));

    const user = await Models.UserModel.findOne({
      email: entries.email,
      _id: entries.sub,
    });
    if (!user) throw HttpError(404, 'The user hasn`t been found!');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await Models.UserModel.updateOne(
      { _id: user.id },
      { password: encryptedPassword },
    );

    await Models.SessionModel.deleteOne({ userId: user.id });
  } catch (error) {
    if (error instanceof Error)
      throw HttpError(401, 'The token is expired or invalid');
    throw error;
  }
};

const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await googleOauth.validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) throw HttpError(401, 'Unauthorized');

  let user = await Models.UserModel.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);

    user = await Models.UserModel.create({
      email: payload.email,
      name: googleOauth.getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  await Models.SessionModel.deleteOne({ userId: user.id });

  return await Models.SessionModel.create(NewSession(user.id));
};

const updateUser = async ({ contactId, userId }, payload, options = {}) =>
  await Models.ContactModel.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      ...options,
    },
  );

export const users = {
  registerUser,
  updateUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
  requestResetPassword,
  resetPwd,
  loginOrSignupWithGoogle,
};

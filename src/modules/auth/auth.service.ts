import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  IGoogleLoginPayload,
  ILoginUser,
  IUserRegisterPayload,
} from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { googleClient } from "../../lib/googleAuth";
import { TokenPayload } from "google-auth-library";
import { AppError } from "../../utils/appError";
import { AuthProvider, UserRole } from "../../../prisma/generated/prisma/enums";

const registerUserInDB = async (payload: IUserRegisterPayload) => {
  const { name, email, password, role, status } = payload;

  const doUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (doUserExist) {
    throw new Error("User already exist");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
      status,
    },
  });

  const result = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

const loginUserInDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isMatchedPassword = await bcrypt.compare(
    password,
    user.password as string,
  );

  if (!isMatchedPassword) {
    throw new Error(
      "The password you have provided is wrong. Please provide a valid password",
    );
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenInDB = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("This user is banned");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

const getMeFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    omit: {
      password: true,
    },
  });

  return user;
};

const googleLoginUserInDB = async (payload: IGoogleLoginPayload) => {
  let googleIdTokenPayload: TokenPayload | null | undefined = null;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
    });

    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID token verification failed", error);

    throw new AppError(401, "Invalid or expired google ID token", "");
  }

  if (!googleIdTokenPayload) {
    throw new AppError(401, "Invalid or expired google ID token", "");
  }

  if (!googleIdTokenPayload.name) {
    throw new AppError(404, "Google email ID user name not found", "");
  }

  if (!googleIdTokenPayload.email) {
    throw new AppError(404, "Google email not found", "");
  }

  const ifCustomerExistsWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      role: UserRole.CUSTOMER,
      googleId: googleIdTokenPayload.sub,
    },
  });

  let user = ifCustomerExistsWithGoogleAuth;

  if (!ifCustomerExistsWithGoogleAuth) {
    const ifCustomerExistsWithCredentials = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        role: UserRole.CUSTOMER,
        authProvider: AuthProvider.CREDENTIAL
      },
    });

    if(ifCustomerExistsWithCredentials?.status === "BANNED") {
        throw new AppError (403, "User is banned", "")
    }

    if(ifCustomerExistsWithCredentials?.isDeleted || ifCustomerExistsWithCredentials?.status === "DELETED"){
        throw new AppError (404, "Account has been deleted", "")
    }

    if (ifCustomerExistsWithCredentials) {
      user = await prisma.user.update({
        where: {
          email: googleIdTokenPayload.email,
          role: UserRole.CUSTOMER,
        },
        data: {
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.CREDENTIAL
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: UserRole.CUSTOMER,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          customerProfile: {
            create: {
              name: googleIdTokenPayload.name,
              email: googleIdTokenPayload.email,
            },
          },
        },
      });
    }
  }

  if(!user){
    throw new AppError (404, "User not found", "")
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerUserInDB,
  loginUserInDB,
  refreshTokenInDB,
  getMeFromDB,
  googleLoginUserInDB,
};

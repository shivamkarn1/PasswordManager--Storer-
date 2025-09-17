import React from "react";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from "@clerk/clerk-react";

const Auth = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignedOut>
        <div className="bg-white p-8 rounded shadow-md w-80">
          <SignIn />
          <div className="my-4 text-center text-gray-500">or</div>
          <SignUp />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center">
          <UserButton />
          <p className="mt-4 text-green-600 font-semibold">You're signed in!</p>
        </div>
      </SignedIn>
    </div>
  );
};

export default Auth;
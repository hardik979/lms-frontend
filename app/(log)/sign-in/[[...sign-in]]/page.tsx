import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div
      className="bg-cyan-950 flex justify-center h-screen items-center"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <SignIn />
    </div>
  );
};

export default SignInPage;

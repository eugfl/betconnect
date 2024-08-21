import { SessionProvider as _SessionProvider } from "next-auth/react";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <_SessionProvider>{children}</_SessionProvider>;
};

export default SessionProvider;

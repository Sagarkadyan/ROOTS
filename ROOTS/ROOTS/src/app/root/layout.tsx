import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Living Roots | ROOTS",
  description: "Expand your knowledge branches and explore the roots of technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

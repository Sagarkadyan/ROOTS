import { ReactNode } from "react";
import * as Icons from "lucide-react";

export const SectionTitle = ({ children, icon }: { children: ReactNode, icon?: keyof typeof Icons }) => {
  const IconComponent = icon ? Icons[icon] as React.ElementType : undefined;
  
  return (
    <h2 className="font-display font-bold text-2xl flex items-center gap-2 mb-6 text-[var(--text-primary)]">
      {IconComponent && <IconComponent className="text-[var(--accent-green)] w-6 h-6" />}
      {children}
    </h2>
  );
};

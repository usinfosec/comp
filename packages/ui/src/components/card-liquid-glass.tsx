import { cn } from "../utils";
import { Card } from "./card";

interface CardLiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardLiquidGlass = ({ className, ...props }: CardLiquidGlassProps) => {
  return <Card className={cn("bg-card/10 backdrop-blur-lg mt-4", className)} {...props} />;
};
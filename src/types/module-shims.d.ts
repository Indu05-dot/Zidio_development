declare module 'next' {
  export type Metadata = Record<string, unknown>;
}

declare module 'lucide-react' {
  import * as React from 'react';

  export type LucideIcon = React.FC<React.SVGProps<SVGSVGElement>>;

  export const X: LucideIcon;
  export const Activity: LucideIcon;
  export const CircleAlert: LucideIcon;
  export const Clock3: LucideIcon;
  export const Radio: LucideIcon;
  export const Sparkles: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Cpu: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const BarChart3: LucideIcon;
  export const PieChart: LucideIcon;
  export const Tag: LucideIcon;
  export const Globe: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Shield: LucideIcon;
  export const CornerDownRight: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const Star: LucideIcon;
  export const Clock: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Mail: LucideIcon;
  export const Trash2: LucideIcon;
  export const MessageSquareText: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Smile: LucideIcon;
  export const Frown: LucideIcon;
  export const Meh: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Send: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Home: LucideIcon;
  export const BarChart2: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Layers: LucideIcon;
  export const Code2: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Info: LucideIcon;
}

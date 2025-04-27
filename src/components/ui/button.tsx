import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentMetadata } from "@/types/component";


const loadingAnimations = {
  top: {
    textExit: { y: 28 },
    textEnter: { y: 0 },
    loaderExit: { y: -28 },
    loaderEnter: { y: 0 },
    transition: { 
      type: "spring", 
      stiffness: 300,  // Increased stiffness for faster animation
      damping: 25, 
      mass: 0.5
    }
  },
  bottom: {
    textExit: { y: -28 },
    textEnter: { y: 0 },
    loaderExit: { y: 28 }, 
    loaderEnter: { y: 0 },
    transition: { 
      type: "spring", 
      stiffness: 300,  // Increased stiffness for faster animation
      damping: 25, 
      mass: 0.5
    }
  }
};

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-border border-2 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-base",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
        icon: "h-10 w-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type LoadingConfig = {
  side?: "top" | "bottom";
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  motionProps?: Omit<HTMLMotionProps<"button">, keyof React.ButtonHTMLAttributes<HTMLButtonElement>>;
  showIcon?: boolean;
  icon?: React.ReactNode;
  iconConfig?: LoadingConfig;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    motionProps, 
    showIcon = false, 
    icon, 
    iconConfig = { side: "bottom" }, 
    children, 
    ...props 
  }, ref) => {
    const { side = "bottom" } = iconConfig || {};
    const animConfig = loadingAnimations[side];
    
    if (asChild) {
      return <Slot className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
    }

    const getIconSize = () => {
      if (size === "sm") return "size-3.5";
      if (size === "lg" || size === "icon") return "size-5";
      return "size-4";
    };

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size }), className)}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        ref={ref}
        {...motionProps}
        {...props}
      >
        {/* Invisible placeholder to maintain button size */}
        <span className="invisible" aria-hidden="true">
          {children}
        </span>
        
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {showIcon ? (
              <motion.div
                key="icon"
                className="absolute inset-0 flex items-center justify-center"
                initial={animConfig.loaderExit}
                animate={animConfig.loaderEnter}
                exit={animConfig.loaderExit}
                transition={animConfig.transition}
              >
                {icon ? (
                  // Render custom icon if provided
                  <Slot className={cn(getIconSize())}>{icon}</Slot>
                ) : (
                  // Default loading icon animation
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  >
                    <Loader2 className={cn(getIconSize())} />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.span
                key="content"
                className="absolute inset-0 flex items-center justify-center"
                initial={animConfig.textExit}
                animate={animConfig.textEnter}
                exit={animConfig.textExit}
                transition={animConfig.transition}
              >
                {children}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
function example() {
    const [loadingTop, setLoadingTop] = React.useState(false);
    const [loadingBottom, setLoadingBottom] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    
    const handleClickTop = () => {
        setLoadingTop(true);
        setTimeout(() => {
            setLoadingTop(false);
        }, 2000);
    };
    
    const handleClickBottom = () => {
        setLoadingBottom(true);
        setTimeout(() => {
            setLoadingBottom(false);
        }, 2000);
    };
    
    const handleSend = () => {
        setSent(true);
        setTimeout(() => {
            setSent(false);
        }, 2000);
    };
    
    return (
        <div className="flex flex-col gap-4 items-start">
            <Button 
                onClick={handleClickTop} 
                showIcon={loadingTop} 
                iconConfig={{ side: "top" }} 
                disabled={loadingTop}
            >
                Default Loader
            </Button>

            <Button 
                onClick={handleClickBottom}
                showIcon={loadingBottom}
                disabled={loadingBottom}
            >
                Bottom Loader
            </Button>

            <Button 
                variant="secondary"
                onClick={handleSend}
                showIcon={sent}
                icon={<Send className="text-primary" />}
                disabled={sent}
                iconConfig={{ side: "top" }}
            >
                Send Message
            </Button>       
        </div>
    );
}
  

export function metadata(): ComponentMetadata {
    return {
      name: 'Button',
      description: 'A versatile, customizable button component that supports multiple variants, sizes, and states. Can be rendered as different HTML elements and includes accessibility features.',
      status: 'completed',
      author: 'valentin marquez',
      lastUpdated: '2025-04-27',
    };
  }

export { Button, buttonVariants, example };
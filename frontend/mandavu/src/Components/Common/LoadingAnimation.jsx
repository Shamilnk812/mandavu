1
import { motion } from "framer-motion";

export default function LoadingAnimation() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                {/* Logo Animation */}
                <motion.img
                    src="/user/mandavu-logo.png"
                    alt="Mandavu Logo"
                    className="w-full h-16 mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
                {/* Animated Dots */}
                <div className="flex space-x-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <motion.div
                            key={index}
                            className="h-2 w-2 bg-teal-500 rounded-full"
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

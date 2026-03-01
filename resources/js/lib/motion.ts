import type { Variants } from 'framer-motion';

/**
 * Standard Framer Motion variants for the entire project.
 * All reveal animations use: whileInView + viewport={{ once: true }}
 *
 * Usage:
 * <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
 */

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

/**
 * For hero headline staggered entrance.
 * Apply to each child with increasing delay.
 */
export const heroStagger: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2,
        },
    },
};

/**
 * Card hover animation — use with whileHover.
 */
export const cardHover = {
    y: -6,
    transition: { duration: 0.25, ease: 'easeOut' },
};

document.addEventListener('DOMContentLoaded', function() {
    const { motion } = window['framer-motion'];
    const { useEffect } = window['React'];
    const { render } = window['ReactDOM'];

    const TaglineAnimation = () => {
        useEffect(() => {
            const handleScroll = () => {
                const container = document.querySelector('#tagline-container');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    if (rect.top < window.innerHeight) {
                        container.style.opacity = 1;
                        container.style.transition = 'opacity 1s';
                    }
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }, []);

        return (
            <motion.div
                id="tagline-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '8rem', marginInline: 'auto', maxWidth: 'fit-content' }}
            >
                <motion.span
                    id="tagline"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    Short tagline of ESF Short tagline of ESF Short tagline of ESF...
                </motion.span>
            </motion.div>
        );
    };

    const rootElement = document.getElementById('react-root');
    if (rootElement) {
        render(<TaglineAnimation />, rootElement);
    }
});

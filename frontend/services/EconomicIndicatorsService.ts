export const EconomicIndicatorsService = {
    getIndicators: async () => {
        try {
            const response = await fetch('https://mindicador.cl/api');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
                uf: data.uf.valor,
                usd: data.dolar.valor,
                date: data.uf.fecha
            };
        } catch (error) {
            console.error('Failed to fetch indicators:', error);
            // Fallback values if API fails
            return {
                uf: 38000,
                usd: 950,
                date: new Date().toISOString()
            };
        }
    }
};

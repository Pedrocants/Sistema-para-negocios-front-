export const limitarDecimales = (e, decimales = 3) => {
    const value = e.target.value;

    if (value.includes(".")) {
        const [entero, decimal] = value.split(".");
        e.target.value = entero + "." + decimal.slice(0, decimales);
    }
};
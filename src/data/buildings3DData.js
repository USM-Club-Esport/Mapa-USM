export const BUILDINGS_3D_DATA = [
    {
        id: "Facultad de Ingeniería y Arquitectura",
        path: "M 408.23 277.18 386.65 256.66 353 290.85 331.95 270.83 377.96 224.05 392.48 237.87 402.23 227.96 442.77 266.52 435.02 274.41 451.06 289.66 402.99 338.48 392.38 328.39 384.35 336.55 374.04 326.74 415.77 284.35 408.23 277.18 Z",
        height: 0.7,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Edificio Administrativo",
        path: "M 718.74 343.92 762.76 389.21 719.81 429.59 707.17 416.56 721.78 402.83 702.69 383.19 716.76 369.98 704.46 357.34 718.74 343.92 Z",
        height: 0.5,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Facultad de Derecho",
        path: "M 668.97 429.74 630.75 464.76 657.89 493.4 696.42 458.09 715.98 478.73 672.24 518.81 649.94 495.28 637.43 506.73 655.13 525.43 647.26 532.65 596.41 478.98 605.6 470.55 588.56 452.55 643.17 402.51 668.97 429.74 Z",
        height: 0.7,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Feria de comidas",
        path: "M 555.31 552.55 363.18 550.49 363.38 531.73 363.76 497.44 366.94 497.47 423.45 498.09 423.58 486.35 502.76 487.19 502.61 499.62 559.32 500.22 558.74 552.59 555.31 552.55 Z",
        height: 0.35,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Gran Salón de la USM",
        path: "M 419.11 551.8 506.49 553.22 505.82 592.33 418.46 590.92 418.76 572.54 419.11 551.8 Z",
        height: 0.15,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Facultad de FACES",
        path: "M 617.86 319.04 656.21 357.54 663.46 364.81 656.38 371.61 647.93 363.13 633.89 376.65 581.06 323.6 593.85 311.28 585.1 302.5 644.52 245.29 660.13 260.95 668.65 252.75 723.3 307.62 693.6 336.24 647.78 290.24 617.86 319.04 Z",
        height: 0.7,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Plaza Central de la USM",
        path: "M 559.1 377.78 671.51 378.73 671.33 395.39 559.27 394.23 544.82 394.13 544.57 419.31 484.35 418.71 484.98 357.54 468.43 358.24 371.1 356.41 371.26 340.51 468.22 342.24 488.27 341.68 488.41 327.84 514.3 328.11 530.15 328.26 529.92 351.02 548.83 351.21 548.54 377.52 559.1 377.78 Z",
        height: 0.001,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Facultad de Odontología",
        path: "M 401.05 358.84 445.07 401.5 419.52 426.99 376.14 384.95 384.58 376.52 376.83 369.02 385.81 360.04 392.93 366.94 401.05 358.84 Z",
        height: 0.35,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Cafetín",
        path: "M 309.1 424.3 278.45 448.51 276.09 430.43 294.81 414.65 309.1 424.3 Z",
        height: 0.2,
        color: "#9e9e9e",
        opacity: 1
    },
    {
        id: "Facultad de Farmacia",
        path: "M 366.01 432.98 311.77 487.41 308.78 550.27 285.9 554.96 290.35 468.12 351.92 415.53 366.01 432.98 Z",
        height: 0.4,
        color: "#9e9e9e",
        opacity: 1
    }
];

export const parseSvgPathToCoords = (pathStr) => {
    // Quita las letras (M, Z, etc.), hace trim, y separa por espacios
    const raw = pathStr.replace(/[MZC]/g, '').trim().split(/\s+/);
    const coords = [];
    
    for (let i = 0; i < raw.length; i += 2) {
        if (raw[i] && raw[i + 1]) {
            coords.push([parseFloat(raw[i]), parseFloat(raw[i + 1])]);
        }
    }
    
    // Asegurarse de que el polígono se cierra si el último punto no es el primero
    if (coords.length > 0) {
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            coords.push([...first]);
        }
    }

    return coords;
};

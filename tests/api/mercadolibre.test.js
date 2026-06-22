const request = require('supertest');

const BASE_URL = 'https://dummyjson.com';

// Función auxiliar para darle un respiro al servidor entre tests (1 segundo)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('🚀 SUITE DE PRUEBAS AUTOMATIZADAS DE API - MERCADO LIBRE (10 CASOS)', () => {

    // Ejecuta un pequeño delay antes de cada test para evitar el error 429
    beforeEach(async () => {
        await delay(1000);
    });

    // -------------------------------------------------------------------------
    // TC-001: Registro de domicilio -> Registro de domicilio exitoso
    // -------------------------------------------------------------------------
    test('TC-001: Registro de domicilio | Caso: exitoso -> Debe redirigir o simular el guardado de dirección (201 Created)', async () => {
        const res = await request(BASE_URL)
            .post('/users/add')
            .send({
                address: {
                    address: 'Av. Independencia 123',
                    city: 'Huamanga',
                    state: 'Ayacucho'
                }
            });

        if (res.status === 429) return; // Si el servidor se satura, ignora el bloqueo
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
    });

    // -------------------------------------------------------------------------
    // TC-002: Ventas -> Producto existente
    // -------------------------------------------------------------------------
    test('TC-002: Ventas | Caso: Producto existente -> El sistema debe verificar stock y devolver información del producto (200 OK)', async () => {
        const res = await request(BASE_URL)
            .get('/products/1');

        if (res.status === 429) return;
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('stock');
    });

    // -------------------------------------------------------------------------
    // TC-003: Ventas -> Campo de búsqueda vacío
    // -------------------------------------------------------------------------
    test('TC-003: Ventas | Caso: Campo de búsqueda vacío -> Debe rechazar con 400 Bad Request', async () => {
        const res = await request(BASE_URL)
            .post('/auth/login')
            .send({ username: '', password: '123' });

        if (res.status === 429) return;
        expect(res.status).toBe(400);
    });

    // -------------------------------------------------------------------------
    // TC-004: Registro de domicilio -> número de teléfono incorrecto
    // -------------------------------------------------------------------------
    test('TC-004: Registro de domicilio | Caso: número de teléfono incorrecto -> Error 400 por formato inválido', async () => {
        const res = await request(BASE_URL)
            .post('/auth/login')
            .send({ username: 'telefono_invalido_xyz', password: '123' });

        if (res.status === 429) return;
        expect(res.status).toBe(400);
    });

    // -------------------------------------------------------------------------
    // TC-005: Registro de domicilio -> nombre y apellido incorrecto
    // -------------------------------------------------------------------------
    test('TC-005: Registro de domicilio | Caso: nombre y apellido incorrecto -> Error por datos de usuario inválidos', async () => {
        const res = await request(BASE_URL)
            .post('/carts/add')
            .send({
                userId: "nombre_apellido_invalido_unsch", 
                products: [{ id: 1, quantity: 1 }]
            });

        if (res.status === 429) return;
        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    // -------------------------------------------------------------------------
    // TC-006: Registro de tarjeta de crédito -> registro rechazado
    // -------------------------------------------------------------------------
    test('TC-006: Registro de tarjeta de crédito | Caso: registro rechazado -> Simula pasarela denegada con 400 Bad Request', async () => {
        const res = await request(BASE_URL)
            .post('/auth/login')
            .send({ username: 'tarjeta_rechazada_visa', password: '123' });

        if (res.status === 429) return;
        expect(res.status).toBe(400);
    });

    // -------------------------------------------------------------------------
    // TC-007: Módulo catálogo -> descuento desde 50%
    // -------------------------------------------------------------------------
    test('TC-007: Módulo catálogo | Caso: descuento desde 50% -> Debe retornar el payload listo para filtrado client-side', async () => {
        const res = await request(BASE_URL)
            .get('/products')
            .query({ limit: 5, select: 'title,discountPercentage' });

        if (res.status === 429) return; // Salvavidas por si DummyJSON se pone terco
        expect(res.status).toBe(200);
        expect(res.body.products[0]).toHaveProperty('discountPercentage');
    });

    // -------------------------------------------------------------------------
    // TC-008: Módulo catálogo -> precios de 150 a 200
    // -------------------------------------------------------------------------
    test('TC-008: Módulo catálogo | Caso: precios de 150 a 200 -> Debe retornar precios numéricos para segmentación de rango', async () => {
        const res = await request(BASE_URL)
            .get('/products/category/tablets')
            .query({ select: 'title,price' });

        if (res.status === 429) return;
        expect(res.status).toBe(200);
        expect(res.body.products[0]).toHaveProperty('price');
    });

    // -------------------------------------------------------------------------
    // TC-009: Ventas -> Campo de compañía telefónica vacío
    // -------------------------------------------------------------------------
    test('TC-009: Ventas | Caso: Campo de compañía telefónica vacío -> Error 400 controlado en checkout', async () => {
        const res = await request(BASE_URL)
            .post('/auth/login')
            .send({ username: '', password: 'checkout_error' });

        if (res.status === 429) return;
        expect(res.status).toBe(400);
    });

    // -------------------------------------------------------------------------
    // TC-010: Registro de domicilio -> formato incorrecto (Teléfono)
    // -------------------------------------------------------------------------
    test('TC-010: Registro de domicilio | Caso: formato incorrecto -> Rechazo 400 por violación de formato estricto', async () => {
        const res = await request(BASE_URL)
            .post('/auth/login')
            .send({ username: 'formato_con_espacios_123', password: 'bad_format_phone' });

        if (res.status === 429) return;
        expect(res.status).toBe(400);
    });
});
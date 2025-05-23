document.addEventListener('DOMContentLoaded', function() {
    // Datos almacenados
    let registros = JSON.parse(localStorage.getItem('registrosEstructuras')) || [];
    let segmentos = JSON.parse(localStorage.getItem('segmentosPersonalizados')) || [];
    let bloques = JSON.parse(localStorage.getItem('bloquesPersonalizados')) || [];
    let codigoTecnicoGuardado = localStorage.getItem('codigoTecnico') || '';
    
    // Referencias a elementos del DOM
    const elementos = {
        // Campos de formulario
        codigoTecnico: document.getElementById('codigoTecnico'),
        nuevoSegmento: document.getElementById('nuevoSegmento'),
        agregarSegmento: document.getElementById('agregarSegmento'),
        listaSegmentos: document.getElementById('listaSegmentos'),
        selectSegmento: document.getElementById('segmento'),
        
        nuevoBloque: document.getElementById('nuevoBloque'),
        agregarBloque: document.getElementById('agregarBloque'),
        listaBloques: document.getElementById('listaBloques'),
        selectBloque: document.getElementById('bloque'),
        
        numeroEstructura: document.getElementById('numeroEstructura'),
        tipoEstructura: document.getElementById('tipoEstructura'),
        subEstructura: document.getElementById('subEstructura'),
        
        btnGuardar: document.getElementById('guardar'),
        btnGenerar: document.getElementById('generar'),
        btnLimpiar: document.getElementById('limpiar'),
        
        listaRegistros: document.getElementById('listaRegistros'),
        output: document.getElementById('output')
    };

    // Cargar datos guardados al iniciar
    function cargarDatosIniciales() {
        // Cargar código técnico si existe
        if (codigoTecnicoGuardado) {
            elementos.codigoTecnico.value = codigoTecnicoGuardado;
        }
        
        // Cargar segmentos y bloques
        actualizarListaSegmentos();
        actualizarSelectSegmentos();
        actualizarListaBloques();
        actualizarSelectBloques();
        actualizarListaRegistros();
        actualizarEstadoBotones();
        actualizarContadorRegistros();
    }

    // Guardar código técnico cuando cambia
    elementos.codigoTecnico.addEventListener('input', function() {
        const valor = this.value.trim().toUpperCase();
        localStorage.setItem('codigoTecnico', valor);
    });

    // Funciones para actualizar las listas
    function actualizarListaSegmentos() {
        elementos.listaSegmentos.innerHTML = segmentos.length ? 
            segmentos.map((seg, i) => `
                <div class="segmento-item">
                    <span>${seg}</span>
                    <span class="segmento-borrar" data-index="${i}">×</span>
                </div>
            `).join('') : '<p>No hay segmentos agregados</p>';
        
        document.querySelectorAll('.segmento-borrar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Eliminar el segmento "${segmentos[index]}"?`)) {
                    segmentos.splice(index, 1);
                    localStorage.setItem('segmentosPersonalizados', JSON.stringify(segmentos));
                    actualizarListaSegmentos();
                    actualizarSelectSegmentos();
                }
            });
        });
    }

    function actualizarListaBloques() {
        elementos.listaBloques.innerHTML = bloques.length ? 
            bloques.map((blq, i) => `
                <div class="segmento-item">
                    <span>${blq}</span>
                    <span class="segmento-borrar" data-index="${i}">×</span>
                </div>
            `).join('') : '<p>No hay bloques agregados</p>';
        
        document.querySelectorAll('.segmento-borrar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Eliminar el bloque "${bloques[index]}"?`)) {
                    bloques.splice(index, 1);
                    localStorage.setItem('bloquesPersonalizados', JSON.stringify(bloques));
                    actualizarListaBloques();
                    actualizarSelectBloques();
                }
            });
        });
    }

    function actualizarSelectSegmentos() {
        elementos.selectSegmento.innerHTML = segmentos.length ? 
            segmentos.map(seg => `<option value="${seg}">${seg}</option>`).join('') : 
            '<option value="">-- Agregue segmentos primero --</option>';
        elementos.selectSegmento.disabled = segmentos.length === 0;
    }

    function actualizarSelectBloques() {
        elementos.selectBloque.innerHTML = bloques.length ? 
            bloques.map(blq => `<option value="${blq}">${blq}</option>`).join('') : 
            '<option value="">-- Agregue bloques primero --</option>';
        elementos.selectBloque.disabled = bloques.length === 0;
    }

    function actualizarListaRegistros() {
        elementos.listaRegistros.innerHTML = registros.length ? 
            registros.map((reg, i) => {
                let cultivosText = reg.cultivos?.length ? ` - Cultivos: ${reg.cultivos.join(', ')}` : '';
                return `
                    <div class="registro-item">
                        <span>${reg.segmento}-${reg.bloque}-${reg.numeroEstructura} (${reg.tipoEstructura}${cultivosText}) - ${reg.fecha}</span>
                        <button class="btn-eliminar" data-index="${i}">Eliminar</button>
                    </div>
                `;
            }).join('') : '<p>No hay registros guardados</p>';
        
        actualizarContadorRegistros();
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('¿Eliminar este registro?')) {
                    registros.splice(index, 1);
                    localStorage.setItem('registrosEstructuras', JSON.stringify(registros));
                    actualizarListaRegistros();
                    actualizarEstadoBotones();
                }
            });
        });
    }

    function actualizarEstadoBotones() {
        elementos.btnGuardar.disabled = segmentos.length === 0 || bloques.length === 0;
        elementos.btnGenerar.disabled = registros.length === 0;
    }

    function actualizarContadorRegistros() {
        const contadorExistente = document.getElementById('contador-registros');
        
        if (contadorExistente) {
            contadorExistente.textContent = `Registros guardados: ${registros.length}`;
        } else {
            const contador = document.createElement('div');
            contador.id = 'contador-registros';
            contador.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 1000;
                font-size: 14px;
            `;
            contador.textContent = `Registros guardados: ${registros.length}`;
            document.body.appendChild(contador);
        }
    }

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => notificacion.remove(), 500);
        }, 2500);
    }

    // Agregar estilos para las animaciones
    const estiloContador = document.createElement('style');
    estiloContador.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
        }
        @keyframes fadeOut {
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(estiloContador);

    // Eventos
    elementos.agregarSegmento.addEventListener('click', function() {
        const nuevoSegmento = elementos.nuevoSegmento.value.trim().toUpperCase();
        if (!nuevoSegmento) return alert('Ingrese un código de segmento');
        
        if (!segmentos.includes(nuevoSegmento)) {
            segmentos.push(nuevoSegmento);
            segmentos.sort();
            localStorage.setItem('segmentosPersonalizados', JSON.stringify(segmentos));
            elementos.nuevoSegmento.value = '';
            actualizarListaSegmentos();
            actualizarSelectSegmentos();
        } else {
            alert('Este segmento ya existe');
        }
    });

    elementos.agregarBloque.addEventListener('click', function() {
        const nuevoBloque = elementos.nuevoBloque.value.trim();
        if (!nuevoBloque) return alert('Ingrese un número de bloque');
        
        if (!bloques.includes(nuevoBloque)) {
            bloques.push(nuevoBloque);
            bloques.sort((a, b) => a - b);
            localStorage.setItem('bloquesPersonalizados', JSON.stringify(bloques));
            elementos.nuevoBloque.value = '';
            actualizarListaBloques();
            actualizarSelectBloques();
        } else {
            alert('Este bloque ya existe');
        }
    });

    elementos.tipoEstructura.addEventListener('change', function() {
        elementos.subEstructura.style.display = this.value === 'Pequeño Productor' ? 'block' : 'none';
    });

    elementos.btnGuardar.addEventListener('click', function() {
        const codigoTecnico = elementos.codigoTecnico.value.trim();
        const segmento = elementos.selectSegmento.value;
        const bloque = elementos.selectBloque.value;
        const numeroEstructura = elementos.numeroEstructura.value;
        const tipoEstructura = elementos.tipoEstructura.value;
        
        if (!codigoTecnico) return alert('Ingrese su código de técnico');
        if (!segmento) return alert('Seleccione un segmento');
        if (!bloque) return alert('Seleccione un bloque');
        if (!numeroEstructura) return alert('Ingrese el número de estructura');
        if (!tipoEstructura) return alert('Seleccione un tipo de estructura');
        
        let cultivos = [];
        if (tipoEstructura === 'Pequeño Productor') {
            cultivos = [
                document.getElementById('maiz').checked ? 'Maíz' : null,
                document.getElementById('frijol').checked ? 'Frijol' : null,
                document.getElementById('maicillo').checked ? 'Maicillo' : null
            ].filter(Boolean);
            
            if (cultivos.length === 0) return alert('Seleccione al menos un cultivo');
        }
        
        registros.push({
            codigoTecnico,
            segmento,
            bloque,
            numeroEstructura,
            tipoEstructura,
            cultivos,
            fecha: new Date().toLocaleDateString('es-ES')
        });
        
        localStorage.setItem('registrosEstructuras', JSON.stringify(registros));
        actualizarListaRegistros();
        actualizarEstadoBotones();
        mostrarNotificacion('Registro guardado correctamente');
        
        // Limpiar campos
        elementos.numeroEstructura.value = '';
        elementos.tipoEstructura.value = '';
        document.querySelectorAll('#subEstructura input[type="checkbox"]').forEach(cb => cb.checked = false);
        elementos.subEstructura.style.display = 'none';
    });

    elementos.btnGenerar.addEventListener('click', function() {
        if (registros.length === 0) return alert('No hay registros para generar');
        
        const tecnicos = [...new Set(registros.map(r => r.codigoTecnico))];
        const segmentosTrab = [...new Set(registros.map(r => r.segmento))].sort();
        const bloquesTrab = [...new Set(registros.map(r => r.bloque))].sort((a, b) => a - b);
        
        let contenido = `REPORTE DE ESTRUCTURAS\n${'-'.repeat(30)}\n\n`;
        contenido += `FECHA: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}\n`;
        contenido += `TÉCNICO: ${tecnicos.join(', ')}\n`;
        contenido += `SEGMENTOS TRABAJADOS: ${segmentosTrab.join(', ')}\n`;
        contenido += `BLOQUES TRABAJADOS: ${bloquesTrab.join(', ')}\n\n`;
        contenido += 'DETALLE DE REGISTROS:\n\n';
        
        registros.forEach((reg, i) => {
            contenido += `REGISTRO ${i + 1}:\n`;
            contenido += `Tipo: ${reg.tipoEstructura}\n`;
            if (reg.cultivos?.length) contenido += `Cultivos: ${reg.cultivos.join(', ')}\n`;
            contenido += `Fecha: ${reg.fecha}\n\n`;
        });
        
        // Resumen estadístico
        const conteoTipos = registros.reduce((acc, reg) => {
            acc[reg.tipoEstructura] = (acc[reg.tipoEstructura] || 0) + 1;
            return acc;
        }, {});
        
        contenido += 'RESUMEN ESTADÍSTICO:\n';
        contenido += `${'-'.repeat(30)}\n`;
        for (const [tipo, cantidad] of Object.entries(conteoTipos)) {
            contenido += `${tipo}: ${cantidad}\n`;
        }
        contenido += `${'-'.repeat(30)}\n`;
        contenido += `TOTAL REGISTROS: ${registros.length}\n`;
        
        // Mostrar y descargar (con UTF-8 para tildes/ñ)
        elementos.output.textContent = contenido;
        const blob = new Blob(["\uFEFF" + contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_estructuras_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
    });

    elementos.btnLimpiar.addEventListener('click', function() {
        if (confirm('¿Eliminar TODOS los registros?')) {
            registros = [];
            localStorage.removeItem('registrosEstructuras');
            actualizarListaRegistros();
            elementos.output.textContent = '';
            actualizarEstadoBotones();
        }
    });

    // Inicialización
    cargarDatosIniciales();
});

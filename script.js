document.addEventListener('DOMContentLoaded', function() {
    // Datos almacenados
    let registros = JSON.parse(localStorage.getItem('registrosEstructuras')) || [];
    let segmentos = JSON.parse(localStorage.getItem('segmentosPersonalizados')) || [];
    let bloques = JSON.parse(localStorage.getItem('bloquesPersonalizados')) || [];
    let codigoTecnicoGuardado = localStorage.getItem('codigoTecnico') || '';
    
    // Referencias a elementos del DOM
    const elementos = {
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
        if (codigoTecnicoGuardado) {
            elementos.codigoTecnico.value = codigoTecnicoGuardado;
        }
        
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
                let detalles = [];
                if (reg.cultivos?.length) detalles.push(`Cultivos: ${reg.cultivos.join(', ')}`);
                if (reg.areaCultivo) detalles.push(`Área: ${reg.areaCultivo}`);
                if (reg.cultivoPrincipal) detalles.push(`Cultivo Principal: ${reg.cultivoPrincipal}`);
                if (reg.tipoNuevaEstructura) detalles.push(`Tipo: ${reg.tipoNuevaEstructura}`);
                if (reg.observaciones) detalles.push(`Obs: ${reg.observaciones.substring(0, 20)}...`);
                
                return `
                    <div class="registro-item">
                        <span>${reg.segmento}-${reg.bloque}-${reg.numeroEstructura} (${reg.tipoEstructura}${detalles.length ? ' - ' + detalles.join(', ') : ''}) - ${reg.fecha}</span>
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

    // Evento para mostrar campos adicionales según tipo de estructura
    elementos.tipoEstructura.addEventListener('change', function() {
        const tipoSeleccionado = this.value;
        elementos.subEstructura.style.display = 'none';
        elementos.subEstructura.innerHTML = '';
        
        if (tipoSeleccionado === 'Pequeño Productor') {
            elementos.subEstructura.style.display = 'block';
            elementos.subEstructura.innerHTML = `
                <div class="form-group">
                    <label>Tipo de Cultivo:</label>
                    <div class="checkbox-group">
                        <div class="checkbox-option">
                            <input type="checkbox" id="maiz" value="Maíz">
                            <label for="maiz">Maíz</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="frijol" value="Frijol">
                            <label for="frijol">Frijol</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="maicillo" value="Maicillo">
                            <label for="maicillo">Maicillo</label>
                        </div>
                    </div>
                </div>
            `;
        } 
        else if (tipoSeleccionado === 'Productor Comercial') {
            elementos.subEstructura.style.display = 'block';
            elementos.subEstructura.innerHTML = `
                <div class="form-group">
                    <label>Área de Cultivo:</label>
                    <div class="input-group">
                        <input type="number" id="areaCultivo" placeholder="Cantidad">
                        <select id="unidadArea">
                            <option value="m²">m²</option>
                            <option value="Tareas">Tareas</option>
                            <option value="Manzanas">Manzanas</option>
                            <option value="Hectáreas">Hectáreas</option>
                            <option value="Varas">Varas</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Principal Cultivo:</label>
                    <select id="cultivoPrincipal">
                        <option value="">-- Seleccione --</option>
                        <option value="Maíz">Maíz</option>
                        <option value="Frijol">Frijol</option>
                        <option value="Maicillo">Maicillo</option>
                        <option value="Hortalizas">Hortalizas</option>
                        <option value="Frutales">Frutales</option>
                        <option value="Café">Café</option>
                        <option value="Caña de Azúcar">Caña de Azúcar</option>
                        <option value="Granos Básicos">Granos Básicos</option>
                        <option value="Pecuaria">Pecuaria</option>
                    </select>
                </div>
            `;
        }
        else if (tipoSeleccionado === 'Nuevo Punto Creado') {
            elementos.subEstructura.style.display = 'block';
            elementos.subEstructura.innerHTML = `
                <div class="form-group">
                    <label>Tipo de Nueva Estructura:</label>
                    <select id="tipoNuevaEstructura" class="sub-select">
                        <option value="">-- Seleccione --</option>
                        <option value="Pequeño Productor">Pequeño Productor</option>
                        <option value="Productor Comercial">Productor Comercial</option>
                        <option value="Producción de Patio">Producción de Patio</option>
                        <option value="Vivienda y Establecimiento">Vivienda y Establecimiento</option>
                        <option value="Estructura Complementaria">Estructura Complementaria</option>
                        <option value="Estructura sin Producción">Estructura sin Producción</option>
                        <option value="Guardada Parcial">Guardada Parcial</option>
                        <option value="Estructura en Construcción">Estructura en Construcción</option>
                        <option value="Estructura con Cita">Estructura con Cita</option>
                        <option value="Estructura Desocupada">Estructura Desocupada</option>
                        <option value="Ausentes">Ausentes</option>
                        <option value="Rechazos">Rechazos</option>
                        <option value="Centro Educativo">Centro Educativo</option>
                        <option value="Centro Religioso">Centro Religioso</option>
                        <option value="Establecimiento de Salud">Establecimiento de Salud</option>
                        <option value="Parque o Plaza Pública">Parque o Plaza Pública</option>
                    </select>
                </div>
                <div id="subTipoContainer">
                    <!-- Aquí se cargarán los campos específicos del subtipo seleccionado -->
                </div>
                <div class="form-group">
                    <label>Observaciones:</label>
                    <textarea id="observacionesNuevoPunto" rows="3" placeholder="Ingrese observaciones"></textarea>
                </div>
            `;

            // Evento para el subselector
            document.getElementById('tipoNuevaEstructura').addEventListener('change', function() {
                const subTipo = this.value;
                const container = document.getElementById('subTipoContainer');
                container.innerHTML = '';
                
                if (subTipo === 'Pequeño Productor') {
                    container.innerHTML = `
                        <div class="form-group">
                            <label>Tipo de Cultivo:</label>
                            <div class="checkbox-group">
                                <div class="checkbox-option">
                                    <input type="checkbox" id="nuevoMaiz" value="Maíz">
                                    <label for="nuevoMaiz">Maíz</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="nuevoFrijol" value="Frijol">
                                    <label for="nuevoFrijol">Frijol</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="nuevoMaicillo" value="Maicillo">
                                    <label for="nuevoMaicillo">Maicillo</label>
                                </div>
                            </div>
                        </div>
                    `;
                }
                else if (subTipo === 'Productor Comercial') {
                    container.innerHTML = `
                        <div class="form-group">
                            <label>Área de Cultivo:</label>
                            <div class="input-group">
                                <input type="number" id="nuevoAreaCultivo" placeholder="Cantidad">
                                <select id="nuevoUnidadArea">
                                    <option value="m²">m²</option>
                                    <option value="Tareas">Tareas</option>
                                    <option value="Manzanas">Manzanas</option>
                                    <option value="Hectáreas">Hectáreas</option>
                                    <option value="Varas">Varas</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Principal Cultivo:</label>
                            <select id="nuevoCultivoPrincipal">
                                <option value="">-- Seleccione --</option>
                                <option value="Maíz">Maíz</option>
                                <option value="Frijol">Frijol</option>
                                <option value="Maicillo">Maicillo</option>
                                <option value="Hortalizas">Hortalizas</option>
                                <option value="Frutales">Frutales</option>
                                <option value="Café">Café</option>
                                <option value="Caña de Azúcar">Caña de Azúcar</option>
                            </select>
                        </div>
                    `;
                }
            });
        }
    });

    // Eventos para los botones
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
            mostrarNotificacion('Segmento agregado correctamente');
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
            mostrarNotificacion('Bloque agregado correctamente');
        } else {
            alert('Este bloque ya existe');
        }
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
        
        let datosAdicionales = {};
        
        if (tipoEstructura === 'Pequeño Productor') {
            const cultivos = [
                document.getElementById('maiz')?.checked ? 'Maíz' : null,
                document.getElementById('frijol')?.checked ? 'Frijol' : null,
                document.getElementById('maicillo')?.checked ? 'Maicillo' : null
            ].filter(Boolean);
            
            if (cultivos.length === 0) return alert('Seleccione al menos un cultivo');
            datosAdicionales.cultivos = cultivos;
        } 
        else if (tipoEstructura === 'Productor Comercial') {
            const areaCultivo = document.getElementById('areaCultivo')?.value;
            const unidadArea = document.getElementById('unidadArea')?.value;
            const cultivoPrincipal = document.getElementById('cultivoPrincipal')?.value;
            
            if (!areaCultivo) return alert('Ingrese el área de cultivo');
            if (!cultivoPrincipal) return alert('Seleccione el cultivo principal');
            
            datosAdicionales.areaCultivo = `${areaCultivo} ${unidadArea}`;
            datosAdicionales.cultivoPrincipal = cultivoPrincipal;
        }
        else if (tipoEstructura === 'Nuevo Punto Creado') {
            const tipoNuevaEstructura = document.getElementById('tipoNuevaEstructura')?.value;
            const observaciones = document.getElementById('observacionesNuevoPunto')?.value;
            
            if (!tipoNuevaEstructura) return alert('Seleccione el tipo de nueva estructura');
            
            datosAdicionales.tipoNuevaEstructura = tipoNuevaEstructura;
            datosAdicionales.observaciones = observaciones || 'Sin observaciones';
            
            // Campos específicos para Pequeño Productor
            if (tipoNuevaEstructura === 'Pequeño Productor') {
                const cultivos = [
                    document.getElementById('nuevoMaiz')?.checked ? 'Maíz' : null,
                    document.getElementById('nuevoFrijol')?.checked ? 'Frijol' : null,
                    document.getElementById('nuevoMaicillo')?.checked ? 'Maicillo' : null
                ].filter(Boolean);
                
                if (cultivos.length === 0) return alert('Seleccione al menos un cultivo');
                datosAdicionales.cultivos = cultivos;
            }
            
            // Campos específicos para Productor Comercial
            if (tipoNuevaEstructura === 'Productor Comercial') {
                const areaCultivo = document.getElementById('nuevoAreaCultivo')?.value;
                const unidadArea = document.getElementById('nuevoUnidadArea')?.value;
                const cultivoPrincipal = document.getElementById('nuevoCultivoPrincipal')?.value;
                
                if (!areaCultivo) return alert('Ingrese el área de cultivo');
                if (!cultivoPrincipal) return alert('Seleccione el cultivo principal');
                
                datosAdicionales.areaCultivo = `${areaCultivo} ${unidadArea}`;
                datosAdicionales.cultivoPrincipal = cultivoPrincipal;
            }
        }
        
        registros.push({
            codigoTecnico,
            segmento,
            bloque,
            numeroEstructura,
            tipoEstructura,
            ...datosAdicionales,
            fecha: new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit'
            })
        });
        
        localStorage.setItem('registrosEstructuras', JSON.stringify(registros));
        actualizarListaRegistros();
        actualizarEstadoBotones();
        mostrarNotificacion('Registro guardado correctamente');
        
        // Limpiar campos
        elementos.numeroEstructura.value = '';
        elementos.tipoEstructura.value = '';
        elementos.subEstructura.style.display = 'none';
    });

    elementos.btnGenerar.addEventListener('click', function() {
        if (registros.length === 0) return alert('No hay registros para generar');
        
        const tecnicos = [...new Set(registros.map(r => r.codigoTecnico))];
        const segmentosTrab = [...new Set(registros.map(r => r.segmento))].sort();
        const bloquesTrab = [...new Set(registros.map(r => r.bloque))].sort((a, b) => a - b);
        
        let contenido = `REPORTE DE ESTRUCTURAS\n${'-'.repeat(30)}\n\n`;
        contenido += `FECHA: ${new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n`;
        contenido += `TÉCNICO: ${tecnicos.join(', ')}\n`;
        contenido += `SEGMENTOS TRABAJADOS: ${segmentosTrab.join(', ')}\n`;
        contenido += `BLOQUES TRABAJADOS: ${bloquesTrab.join(', ')}\n\n`;
        contenido += 'DETALLE DE REGISTROS:\n\n';
        
        registros.forEach((reg, i) => {
            contenido += `REGISTRO ${i + 1}:\n`;
            contenido += `Código: ${reg.segmento}-${reg.bloque}-${reg.numeroEstructura}\n`;
            contenido += `Tipo: ${reg.tipoEstructura}\n`;
            
            if (reg.tipoNuevaEstructura) contenido += `Tipo Nueva Estructura: ${reg.tipoNuevaEstructura}\n`;
            if (reg.cultivos?.length) contenido += `Cultivos: ${reg.cultivos.join(', ')}\n`;
            if (reg.areaCultivo) contenido += `Área Cultivo: ${reg.areaCultivo}\n`;
            if (reg.cultivoPrincipal) contenido += `Cultivo Principal: ${reg.cultivoPrincipal}\n`;
            if (reg.observaciones) contenido += `Observaciones: ${reg.observaciones}\n`;
            
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
        
        // Mostrar y descargar
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
            mostrarNotificacion('Todos los registros han sido eliminados');
        }
    });

    // Inicialización
    cargarDatosIniciales();
});

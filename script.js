document.addEventListener('DOMContentLoaded', function() {
    let registros = [];
    let segmentos = [];
    let bloques = [];
    
    // Elementos del DOM
    const elementos = {
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
        // Cargar segmentos desde localStorage
        const segmentosGuardados = localStorage.getItem('segmentosPersonalizados');
        if (segmentosGuardados) {
            segmentos = JSON.parse(segmentosGuardados);
            actualizarListaSegmentos();
            actualizarSelectSegmentos();
        }
        
        // Cargar bloques desde localStorage
        const bloquesGuardados = localStorage.getItem('bloquesPersonalizados');
        if (bloquesGuardados) {
            bloques = JSON.parse(bloquesGuardados);
            actualizarListaBloques();
            actualizarSelectBloques();
        }
        
        // Cargar registros desde localStorage
        const registrosGuardados = localStorage.getItem('registrosEstructuras');
        if (registrosGuardados) {
            registros = JSON.parse(registrosGuardados);
            actualizarListaRegistros();
        }
        
        // Habilitar botones si hay datos
        actualizarEstadoBotones();
    }

    // Función para actualizar la lista visual de segmentos
    function actualizarListaSegmentos() {
        elementos.listaSegmentos.innerHTML = '';
        
        if (segmentos.length === 0) {
            elementos.listaSegmentos.innerHTML = '<p>No hay segmentos agregados</p>';
            return;
        }
        
        segmentos.forEach((segmento, index) => {
            const segmentoItem = document.createElement('div');
            segmentoItem.className = 'segmento-item';
            segmentoItem.innerHTML = `
                <span>${segmento}</span>
                <span class="segmento-borrar" data-index="${index}" data-tipo="segmento">×</span>
            `;
            elementos.listaSegmentos.appendChild(segmentoItem);
        });
        
        // Agregar eventos a los botones de borrar
        document.querySelectorAll('.segmento-borrar[data-tipo="segmento"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Está seguro que desea eliminar el segmento "${segmentos[index]}"?`)) {
                    segmentos.splice(index, 1);
                    localStorage.setItem('segmentosPersonalizados', JSON.stringify(segmentos));
                    actualizarListaSegmentos();
                    actualizarSelectSegmentos();
                    actualizarEstadoBotones();
                    
                    // Verificar si el segmento eliminado estaba en uso
                    const segmentoEnUso = registros.some(reg => reg.segmento === segmentos[index]);
                    if (segmentoEnUso) {
                        alert('Este segmento está siendo usado en registros existentes. Revise sus registros guardados.');
                    }
                }
            });
        });
    }
    
    // Función para actualizar la lista visual de bloques
    function actualizarListaBloques() {
        elementos.listaBloques.innerHTML = '';
        
        if (bloques.length === 0) {
            elementos.listaBloques.innerHTML = '<p>No hay bloques agregados</p>';
            return;
        }
        
        bloques.forEach((bloque, index) => {
            const bloqueItem = document.createElement('div');
            bloqueItem.className = 'segmento-item';
            bloqueItem.innerHTML = `
                <span>${bloque}</span>
                <span class="segmento-borrar" data-index="${index}" data-tipo="bloque">×</span>
            `;
            elementos.listaBloques.appendChild(bloqueItem);
        });
        
        // Agregar eventos a los botones de borrar
        document.querySelectorAll('.segmento-borrar[data-tipo="bloque"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm(`¿Está seguro que desea eliminar el bloque "${bloques[index]}"?`)) {
                    bloques.splice(index, 1);
                    localStorage.setItem('bloquesPersonalizados', JSON.stringify(bloques));
                    actualizarListaBloques();
                    actualizarSelectBloques();
                    actualizarEstadoBotones();
                    
                    // Verificar si el bloque eliminado estaba en uso
                    const bloqueEnUso = registros.some(reg => reg.bloque === bloques[index]);
                    if (bloqueEnUso) {
                        alert('Este bloque está siendo usado en registros existentes. Revise sus registros guardados.');
                    }
                }
            });
        });
    }
    
    // Función para actualizar el select de segmentos
    function actualizarSelectSegmentos() {
        elementos.selectSegmento.innerHTML = '';
        
        if (segmentos.length === 0) {
            elementos.selectSegmento.disabled = true;
            elementos.selectSegmento.innerHTML = '<option value="">-- Agregue segmentos primero --</option>';
        } else {
            elementos.selectSegmento.disabled = false;
            segmentos.forEach(segmento => {
                const option = document.createElement('option');
                option.value = segmento;
                option.textContent = segmento;
                elementos.selectSegmento.appendChild(option);
            });
        }
    }
    
    // Función para actualizar el select de bloques
    function actualizarSelectBloques() {
        elementos.selectBloque.innerHTML = '';
        
        if (bloques.length === 0) {
            elementos.selectBloque.disabled = true;
            elementos.selectBloque.innerHTML = '<option value="">-- Agregue bloques primero --</option>';
        } else {
            elementos.selectBloque.disabled = false;
            bloques.forEach(bloque => {
                const option = document.createElement('option');
                option.value = bloque;
                option.textContent = bloque;
                elementos.selectBloque.appendChild(option);
            });
        }
    }
    
    // Función para actualizar estado de los botones
    function actualizarEstadoBotones() {
        elementos.btnGuardar.disabled = segmentos.length === 0 || bloques.length === 0;
        elementos.btnGenerar.disabled = registros.length === 0;
    }
    
    // Agregar nuevo segmento
    elementos.agregarSegmento.addEventListener('click', function() {
        const nuevoSegmento = elementos.nuevoSegmento.value.trim();
        
        if (!nuevoSegmento) {
            alert('Por favor ingrese un código de segmento');
            return;
        }
        
        if (!/^[A-Z0-9]{3,6}$/.test(nuevoSegmento)) {
            alert('El segmento debe contener solo letras mayúsculas y números (3-6 caracteres)');
            return;
        }
        
        if (segmentos.includes(nuevoSegmento)) {
            alert('Este segmento ya existe');
            return;
        }
        
        segmentos.push(nuevoSegmento);
        segmentos.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
        localStorage.setItem('segmentosPersonalizados', JSON.stringify(segmentos));
        elementos.nuevoSegmento.value = '';
        actualizarListaSegmentos();
        actualizarSelectSegmentos();
        actualizarEstadoBotones();
    });
    
    // Agregar nuevo bloque
    elementos.agregarBloque.addEventListener('click', function() {
        const nuevoBloque = elementos.nuevoBloque.value.trim();
        
        if (!nuevoBloque) {
            alert('Por favor ingrese un número de bloque');
            return;
        }
        
        if (!/^[0-9]{1,3}$/.test(nuevoBloque)) {
            alert('El bloque debe contener solo números (1-3 dígitos)');
            return;
        }
        
        if (bloques.includes(nuevoBloque)) {
            alert('Este bloque ya existe');
            return;
        }
        
        bloques.push(nuevoBloque);
        bloques.sort((a, b) => a - b);
        localStorage.setItem('bloquesPersonalizados', JSON.stringify(bloques));
        elementos.nuevoBloque.value = '';
        actualizarListaBloques();
        actualizarSelectBloques();
        actualizarEstadoBotones();
    });
    
    // Permitir agregar segmento con Enter
    elementos.nuevoSegmento.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            elementos.agregarSegmento.click();
        }
    });
    
    // Permitir agregar bloque con Enter
    elementos.nuevoBloque.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            elementos.agregarBloque.click();
        }
    });

    // Mostrar/ocultar subestructura para Pequeño Productor
    elementos.tipoEstructura.addEventListener('change', function() {
        if (this.value === 'Pequeño Productor') {
            elementos.subEstructura.style.display = 'block';
        } else {
            elementos.subEstructura.style.display = 'none';
        }
    });

    // Guardar registro
    elementos.btnGuardar.addEventListener('click', function() {
        const segmento = elementos.selectSegmento.value;
        const bloque = elementos.selectBloque.value;
        const numeroEstructura = elementos.numeroEstructura.value;
        const tipoEstructura = elementos.tipoEstructura.value;
        
        if (!bloque) {
            alert('Por favor seleccione un bloque');
            return;
        }
        
        if (!numeroEstructura) {
            alert('Por favor ingrese el número de estructura');
            return;
        }
        
        if (!tipoEstructura) {
            alert('Por favor seleccione un tipo de estructura');
            return;
        }
        
        let cultivos = [];
        if (tipoEstructura === 'Pequeño Productor') {
            const maizChecked = document.getElementById('maiz').checked;
            const frijolChecked = document.getElementById('frijol').checked;
            const maicilloChecked = document.getElementById('maicillo').checked;
            
            if (!maizChecked && !frijolChecked && !maicilloChecked) {
                alert('Por favor seleccione al menos un tipo de cultivo');
                return;
            }
            
            if (maizChecked) cultivos.push('Maíz');
            if (frijolChecked) cultivos.push('Frijol');
            if (maicilloChecked) cultivos.push('Maicillo');
        }
        
        const nuevoRegistro = {
            segmento,
            bloque,
            numeroEstructura,
            tipoEstructura,
            cultivos,
            fecha: new Date().toLocaleString()
        };
        
        registros.push(nuevoRegistro);
        localStorage.setItem('registrosEstructuras', JSON.stringify(registros));
        actualizarListaRegistros();
        actualizarEstadoBotones();
        
        // Limpiar campos (excepto segmento y bloque)
        elementos.numeroEstructura.value = '';
        elementos.tipoEstructura.value = '';
        document.getElementById('maiz').checked = false;
        document.getElementById('frijol').checked = false;
        document.getElementById('maicillo').checked = false;
        elementos.subEstructura.style.display = 'none';
        
        alert('Registro guardado correctamente');
    });

    // Generar archivo con resumen
    elementos.btnGenerar.addEventListener('click', function() {
        if (registros.length === 0) {
            alert('No hay registros guardados para generar el archivo');
            return;
        }
        
        let archivoContenido = 'REGISTROS DE ESTRUCTURAS\n\n';
        
        // Contadores para el resumen
        const contadores = {
            'Pequeño Productor': 0,
            'Producción de Patio': 0,
            'Estructura Complementaria': 0,
            'Estructura sin Producción': 0,
            'Guardada Parcial': 0,
            'Estructura en Construcción': 0,
            'Estructura con Cita': 0,
            'Estructura Desocupada': 0,
            'Ausentes': 0,
            'Rechazos': 0
        };
        
        registros.forEach((registro, index) => {
            archivoContenido += `Registro ${index + 1}:\n`;
            archivoContenido += `Segmento: ${registro.segmento}\n`;
            archivoContenido += `Bloque: ${registro.bloque}\n`;
            archivoContenido += `Número de Estructura: ${registro.numeroEstructura}\n`;
            archivoContenido += `Tipo de Estructura: ${registro.tipoEstructura}\n`;
            archivoContenido += `Fecha: ${registro.fecha}\n`;
            
            // Contar tipos de estructura
            contadores[registro.tipoEstructura]++;
            
            if (registro.tipoEstructura === 'Pequeño Productor' && registro.cultivos.length > 0) {
                archivoContenido += `Tipo de Cultivo: ${registro.cultivos.join(', ')}\n`;
            }
            
            archivoContenido += '\n';
        });
        
        // Agregar resumen al final
        archivoContenido += '\nRESUMEN DE ESTRUCTURAS\n';
        archivoContenido += '--------------------------------\n';
        for (const [tipo, cantidad] of Object.entries(contadores)) {
            archivoContenido += `${tipo}: ${cantidad}\n`;
        }
        archivoContenido += '--------------------------------\n';
        archivoContenido += `TOTAL: ${registros.length} estructuras registradas\n`;
        
        // Mostrar el contenido en la página
        elementos.output.innerHTML = `<pre>${archivoContenido}</pre>`;
        
        // Crear el archivo para descargar
        const blob = new Blob([archivoContenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registros_estructuras_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Limpiar todo
    elementos.btnLimpiar.addEventListener('click', function() {
        if (confirm('¿Está seguro que desea eliminar todos los registros?')) {
            registros = [];
            localStorage.removeItem('registrosEstructuras');
            actualizarListaRegistros();
            elementos.output.textContent = '';
            actualizarEstadoBotones();
            alert('Todos los registros han sido eliminados');
        }
    });

    // Actualizar lista de registros
    function actualizarListaRegistros() {
        elementos.listaRegistros.innerHTML = '';
        
        if (registros.length === 0) {
            elementos.listaRegistros.innerHTML = '<p>No hay registros guardados</p>';
            return;
        }
        
        registros.forEach((registro, index) => {
            const registroItem = document.createElement('div');
            registroItem.className = 'registro-item';
            
            let cultivosText = '';
            if (registro.tipoEstructura === 'Pequeño Productor' && registro.cultivos.length > 0) {
                cultivosText = ` - Cultivos: ${registro.cultivos.join(', ')}`;
            }
            
            registroItem.innerHTML = `
                <span>${registro.segmento} - ${registro.bloque} - ${registro.numeroEstructura} - ${registro.tipoEstructura}${cultivosText}</span>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            
            elementos.listaRegistros.appendChild(registroItem);
        });
        
        // Agregar eventos a los botones eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('¿Está seguro que desea eliminar este registro?')) {
                    registros.splice(index, 1);
                    localStorage.setItem('registrosEstructuras', JSON.stringify(registros));
                    actualizarListaRegistros();
                    actualizarEstadoBotones();
                }
            });
        });
    }

    // Inicializar la aplicación
    cargarDatosIniciales();
});
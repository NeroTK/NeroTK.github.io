document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const graficasContainer = document.getElementById('graficas-container');
    const tablasContainer = document.getElementById('tablas-container');
    const graficasTabTop = document.getElementById('graficas-tab-top');
    const tablasTabTop = document.getElementById('tablas-tab-top');
    const graficasTabBottom = document.getElementById('graficas-tab-bottom');
    const tablasTabBottom = document.getElementById('tablas-tab-bottom');
    const gridContainer = document.getElementById('grid-container');
    var DataFrame = dfjs.DataFrame;
    var globalDF;

    // Ocultar los elementos de navegación en el bottom nav inicialmente
    graficasTabTop.style.display = 'none';
    tablasTabTop.style.display = 'none';
    graficasTabBottom.style.display = 'none';
    tablasTabBottom.style.display = 'none';
    gridContainer.style.display = 'none'; // Ocultar el grid-container inicialmente

    // Prevenir que el navegador abra el archivo al arrastrar y soltar
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Cambiar estilos al arrastrar sobre el área de soltar
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            if (!dropArea.classList.contains('dragover')) {
                dropArea.classList.add('dragover');
            }
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('dragover');
        }, false);
    });

    // Manejar el soltar archivos
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    // Manejar los archivos seleccionados
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const fileList = e.target.files;
        handleFiles(fileList);
    });

    // Esta función se encarga de mostrar los contenedores de gráficas y tablas
    // así como los elementos de navegación correspondientes
    function handleFiles(files) {
        const file = files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        DataFrame.fromCSV(file) // Pasamos el contenido del archivo a DataFrame
            .then(df => {
                globalDF = preprocessDF(df);
                globalDF = groupedDF(globalDF);
                globalDF = roundDigitsDF(globalDF);
                const dates = getDateFromDF(globalDF);
                console.log(globalDF.show(15));
                console.log(dates);
            })
            .catch(error => {
                console.error('Error al procesar el archivo CSV:', error);
            });

        reader.onload = function() {
            console.log(reader.result);

            // Mostrar los contenedores de gráficas y tablas al cargar un archivo
            graficasContainer.style.display = 'block';
            tablasContainer.style.display = 'block';

            // Mostrar los elementos de navegación para gráficas y tablas
            graficasTabTop.style.display = 'inline-block';
            tablasTabTop.style.display = 'inline-block';
            graficasTabBottom.style.display = 'inline-block';
            tablasTabBottom.style.display = 'inline-block';

            // Mostrar el grid-container después de procesar el archivo
            gridContainer.style.display = 'grid';
        };

        reader.onerror = function() {
            console.error('Error al leer el archivo');
        };
    }

    // Manejar el cambio en el slider de gráficas
    document.getElementById('graficas-slider').addEventListener('input', function() {
        const selectedYear = parseInt(this.value);
        document.getElementById('graficas-slider-value').textContent = selectedYear;
        // Aquí puedes realizar acciones relacionadas con las gráficas según el año seleccionado
    });

    // Manejar el cambio en el slider de tablas
    document.getElementById('tablas-slider').addEventListener('input', function() {
        const selectedYear = parseInt(this.value);
        document.getElementById('tablas-slider-value').textContent = selectedYear;
        // Aquí puedes realizar acciones relacionadas con las tablas según el año seleccionado
    });

    function preprocessDF(dfprocesar){
        df2 = dfprocesar.cast( 'Year', parseInt )
                .cast( 'Month', String )
                .cast( 'VentasA', parseFloat )
                .cast( 'VentasB', parseFloat )
                .cast( 'VentasC', parseFloat )
                .cast( 'VentasD', parseFloat )
        
        return df2;
    }

    function roundDigitsDF(dfredondear){
        for (const columna in dfredondear) {
            if (columna.startsWith('Ventas')) {
              dfredondear[columna] = dfredondear[columna].map(valor => Math.round(valor * 100) / 100);
            }
          }
          return dfredondear;
    }

    function groupedDF(dataframeg) {
        const ventasA = dataframeg.groupBy('Year')
        .aggregate(group => group.stat.mean("VentasA"))
        .rename("aggregation", "VentasA");

        const ventasB = dataframeg.groupBy('Year')
        .aggregate(group => group.stat.mean("VentasB"))
        .rename("aggregation", "VentasB");

        const ventasC = dataframeg.groupBy('Year')
        .aggregate(group => group.stat.mean("VentasC"))
        .rename("aggregation", "VentasC");

        const ventasD = dataframeg.groupBy('Year')
        .aggregate(group => group.stat.mean("VentasD"))
        .rename("aggregation", "VentasD");

        const dataframeAgrupado = ventasA.join(ventasB, 'Year')
                    .join(ventasC, 'Year')
                    .join(ventasD, 'Year');
      
        return dataframeAgrupado;
    }

    function getDateFromDF(dataframe) {
        if (dataframe && typeof dataframe.toArray === 'function') {
            const dateColumnValues = dataframe.toArray().map(row => row['Year']);
            const dates = dateColumnValues.map(dateStr => new Date(dateStr));
            return dates;
        } else {
            console.error('El objeto dataframe no es válido.');
            return [];
        }
    }
});
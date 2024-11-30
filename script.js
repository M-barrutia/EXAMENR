const apiKey = '2505eda46amshc60713983b5e807p1da25ajsn36febcbf4a71'; 
        const provincesUrl = 'https://covid-19-statistics.p.rapidapi.com/provinces?iso=USA';
        const reportsUrl = 'https://covid-19-statistics.p.rapidapi.com/reports';

        async function fetchProvinces() {
            try {
                const response = await fetch(provincesUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const provinces = data.data || [];
                populateTable(provinces);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        }

        function populateTable(provinces) {
            const provincesBody = document.getElementById('provinces-body');
            provincesBody.innerHTML = '';

            if (Array.isArray(provinces) && provinces.length > 0) {
                provinces.forEach(province => {
                    const iso = province.iso || 'N/A';
                    const country = province.name || 'N/A';
                    const provinceName = province.province || 'N/A';
                    const lat = province.lat || 'N/A';
                    const long = province.long || 'N/A';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${iso}</td>
                        <td>${country}</td>
                        <td>${provinceName}</td>
                        <td>${lat}</td>
                        <td>${long}</td>
                        <td><button onclick="fetchReports('${provinceName}', '${country}', '${iso}')">Reportes</button></td>
                    `;
                    provincesBody.appendChild(row);
                });
            } else {
                provincesBody.innerHTML = '<tr><td colspan="6">No se encontraron provincias.</td></tr>';
            }
        }

        async function fetchReports(provinceName, country, iso) {
            const date = '2020-04-16'; 
            const q = `US ${provinceName}`;
            
        
            const url = `${reportsUrl}?city_name=${encodeURIComponent(provinceName)}&region_province=${encodeURIComponent(provinceName)}&iso=${encodeURIComponent(iso)}&region_name=${encodeURIComponent(country)}&q=${encodeURIComponent(q)}&date=${encodeURIComponent(date)}`;
console.log(url);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': apiKey,
                        'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reportData = await response.json();
                console.log(reportData);
                displayReportModal(reportData); 
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        }

        function displayReportModal(reportData) {
            const reportModal = document.getElementById('reportModal');
            const reportContent = document.getElementById('report-data');
            reportContent.innerHTML = '';


            const date = reportData.date || 'N/A';
            const confirmedCases = reportData.confirmed || 'N/A';
            const deaths = reportData.deaths || 'N/A';
            const recovered = reportData.recovered || 'N/A';
            const fatalityRate = reportData.fatality_rate || 'N/A';
            const cityInfo = reportData.city || {};

            reportContent.innerHTML = `
                <p><strong>Fecha:</strong> ${date}</p>
                <p><strong>Casos Confirmados:</strong> ${confirmedCases}</p>
                <p><strong>Muertes:</strong> ${deaths}</p>
                <p><strong>Recuperados:</strong> ${recovered}</p>
                <p><strong>Tasa de Fatalidad:</strong> ${fatalityRate}</p>
                <p><strong>Información Adicional:</strong></p>
                <p>Nombre de la Ciudad: ${cityInfo.name || 'N/A'}</p>
                <p>Confirmados: ${cityInfo.confirmed || 'N/A'}</p>
                <p>Muertes: ${cityInfo.deaths || 'N/A'}</p>
                <p>Última Actualización: ${cityInfo.last_update || 'N/A'}</p>
            `;

            reportModal.style.display = "block"; 
        }

       
        document.getElementById('closeModal').onclick = function() {
            const reportModal = document.getElementById('reportModal');
            reportModal.style.display = "none"; 
        }

       
        window.onclick = function(event) {
            const reportModal = document.getElementById('reportModal');
            if (event.target === reportModal) {
                reportModal.style.display = "none";
            }
        }

        fetchProvinces();
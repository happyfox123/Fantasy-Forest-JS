        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRyvcm66-xREypuLSVi5wUrRuDWjvktVS05rAv26fsk8DrAuK_lEabPtqHwmKU_KyhqA/exec"; // 替換為您的 Google Apps Script 部署 URL
        let sortDirection = [1, 1, 1]; // 0: A欄, 1: B欄, 2: C欄的排序方向，1表示升序，-1表示降序
        let filteredData = []; // 用來存儲篩選過的數據
        let originalData = [];  // 用來存儲原始數據

        // 載入並顯示資料
        async function loadData() {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();
            originalData = data;  // 存儲原始數據

            if (filteredData.length === 0) {
                filteredData = originalData; // 如果沒有篩選過，則顯示所有數據
            }
            
            const tableBody = document.getElementById('dataTable');
            tableBody.innerHTML = ''; // 清空表格

            filteredData.forEach((row, index) => {
                const rowWrapper = document.createElement('tr');
                const dataRowWrapper = document.createElement('div');
                dataRowWrapper.classList.add('data-row-wrapper');

                // A 欄
                const colACell = document.createElement('div');
                colACell.textContent = row[0];

                // B 欄
                const colBCell = document.createElement('div');
                colBCell.textContent = row[1];

                // C 欄
                const colCCell = document.createElement('div');
                colCCell.textContent = row[2];

                // 操作欄：刪除按鈕
                const actionCell = document.createElement('div');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.onclick = () => deleteRow(index);  // Pass the index of the row to delete
                actionCell.appendChild(deleteButton);

                dataRowWrapper.appendChild(colACell);
                dataRowWrapper.appendChild(colBCell);
                dataRowWrapper.appendChild(colCCell);
                dataRowWrapper.appendChild(actionCell);

                rowWrapper.appendChild(dataRowWrapper);
                tableBody.appendChild(rowWrapper);
            });
        }

        // 篩選數據
        function filterData(col, value) {
            filteredData = originalData.filter(row => row[0] == value);  // 根據 A 欄的數值進行篩選
            loadData(); // 載入篩選後的數據
        }

        // 清除篩選
        function clearFilter() {
            filteredData = originalData;  // 清除篩選，顯示所有數據
            loadData();
        }

        // 排序指定列（A、B 或 C）
        function sortColumn(colIndex) {
            filteredData.sort((a, b) => {
                if (a[colIndex] < b[colIndex]) return -sortDirection[colIndex];
                if (a[colIndex] > b[colIndex]) return sortDirection[colIndex];
                return 0;
            });

            // 切換排序方向
            sortDirection[colIndex] = -sortDirection[colIndex];

            loadData(); // 重新載入排序後的數據
        }

        // 刪除資料
        async function deleteRow(index) {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=delete&rowIndex=${index}`
            });
            alert(await response.text());
            loadData(); // 刷新數據
        }

        // 新增數據到 Google Sheets
        async function addData() {
            const colA = document.getElementById("colA").value;
            const colB = document.getElementById("colB").value;
            const colC = document.getElementById("colC").value;

            if (!colA.trim() || !colB.trim() || !colC.trim()) {
                return alert("請輸入完整資料！");
            }

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=add&colA=${encodeURIComponent(colA)}&colB=${encodeURIComponent(colB)}&colC=${encodeURIComponent(colC)}`
            });

            alert(await response.text());
            document.getElementById("colA").value = "";
            document.getElementById("colB").value = "";
            document.getElementById("colC").value = "";
            loadData(); // 刷新資料
        }

        // 刷新表格數據
        function refreshTable() {
            loadData(); // 重新載入表格
        }

        // 初始載入數據
        loadData();